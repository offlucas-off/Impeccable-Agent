#!/usr/bin/env node
import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const TARGET_TO_PRESET = {
  knight: 'nwl_knight',
  archer: 'nwl_archer',
  mage: 'nwl_mage',
  boss_demon: 'nwl_boss_demon',
  city: 'nwl_starter_city',
  dungeon: 'nwl_dungeon_floor1',
  chest: 'nwl_chest',
};

function parseArgs(argv) {
  const opts = {
    targets: ['knight', 'archer', 'mage', 'boss_demon'],
    preset: 'stylized_crisp',
    outDir: path.resolve(ROOT_DIR, 'exports/nwl'),
    quantizeGlb: false,
    ditherGlb: false,
    frames: 8,
    height: 108,
    forceBuild: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--targets=')) {
      const val = arg.slice('--targets='.length).trim();
      if (val === 'all') {
        opts.targets = Object.keys(TARGET_TO_PRESET);
      } else {
        opts.targets = val
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else if (arg.startsWith('--preset=')) {
      opts.preset = arg.slice('--preset='.length).trim() || 'stylized_crisp';
    } else if (arg.startsWith('--out=')) {
      const outRaw = arg.slice('--out='.length).trim();
      opts.outDir = path.isAbsolute(outRaw) ? outRaw : path.resolve(ROOT_DIR, outRaw);
    } else if (arg === '--quantize-glb') {
      opts.quantizeGlb = true;
    } else if (arg === '--dither-glb') {
      opts.ditherGlb = true;
    } else if (arg.startsWith('--frames=')) {
      opts.frames = Math.max(1, Math.min(16, Number(arg.slice('--frames='.length)) || 8));
    } else if (arg.startsWith('--height=')) {
      opts.height = Math.max(24, Math.min(256, Number(arg.slice('--height='.length)) || 108));
    } else if (arg === '--build') {
      opts.forceBuild = true;
    }
  }

  return opts;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      const port = typeof addr === 'object' && addr ? addr.port : 4173;
      srv.close(() => resolve(port));
    });
  });
}

async function waitForServerReady(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Timed out waiting for Vite preview server at ${url}`);
}

function resolveChromiumExecutable() {
  const candidates = ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome'];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const distIndex = path.join(ROOT_DIR, 'dist', 'index.html');
  if (opts.forceBuild || !fs.existsSync(distIndex)) {
    console.log('[export:nwl] Building production bundle via vite build...');
    execSync('npx vite build', { cwd: ROOT_DIR, stdio: 'inherit' });
  }

  fs.mkdirSync(opts.outDir, { recursive: true });

  const port = await getFreePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  const viteBin = path.join(ROOT_DIR, 'node_modules', 'vite', 'bin', 'vite.js');
  const previewProc = spawn(
    process.execPath,
    [viteBin, 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
    {
      cwd: ROOT_DIR,
      stdio: 'ignore',
    }
  );

  let browser = null;
  try {
    await waitForServerReady(baseUrl);
    const executablePath = resolveChromiumExecutable();
    browser = await chromium.launch({
      ...(executablePath ? { executablePath } : {}),
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--use-gl=angle',
        '--use-angle=swiftshader',
        '--enable-webgl',
        '--ignore-gpu-blocklist',
      ],
    });

    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => Boolean(window.__PIXELIZER_STUDIO__), null, { timeout: 15000 });

    await page.evaluate((style) => {
      window.__PIXELIZER_STUDIO__?.setStylePreset(style);
    }, opts.preset);

    const manifest = {
      generatedAt: new Date().toISOString(),
      preset: opts.preset,
      quantizeGlb: opts.quantizeGlb,
      ditherGlb: opts.ditherGlb,
      framesPerDirection: opts.frames,
      targetCharHeightPx: opts.height,
      assets: [],
      errors: pageErrors,
    };

    for (const target of opts.targets) {
      const presetId = TARGET_TO_PRESET[target] ?? target;
      const t0 = Date.now();
      console.log(`[export:nwl] Exporting "${target}" (preset: ${presetId})...`);

      await page.evaluate(async (pid) => {
        await window.__PIXELIZER_STUDIO__?.loadPreset(pid);
      }, presetId);

      // Allow UAL clip bank and two render ticks to settle
      await page.waitForTimeout(450);
      await page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(resolve))
          )
      );

      const summary = await page.evaluate(() => window.__PIXELIZER_STUDIO__?.getStageSummary() ?? null);
      const sheet = await page.evaluate(
        (sheetOpts) => window.__PIXELIZER_STUDIO__?.exportCurrentNwlSheet(sheetOpts) ?? null,
        { targetCharHeightPx: opts.height, framesPerDirection: opts.frames }
      );
      const glb = await page.evaluate(
        async (glbOpts) => (await window.__PIXELIZER_STUDIO__?.exportCurrentGlbBase64(glbOpts)) ?? null,
        { quantizeAlbedo: opts.quantizeGlb, quantizeDither: opts.ditherGlb }
      );
      const renderStats = await page.evaluate(
        () => window.__PIXELIZER_STUDIO__?.getRenderStats() ?? null
      );

      if (!sheet) {
        throw new Error(`Failed to export NWL sheet for target "${target}"`);
      }
      if (!glb) {
        throw new Error(`Failed to export .GLB for target "${target}"`);
      }

      const sheetFile = `${target}_sheet_8dir.png`;
      const atlasFile = `${target}_atlas.json`;
      const glbFile = `${target}.glb`;

      const pngBase64 = sheet.imageDataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(path.join(opts.outDir, sheetFile), Buffer.from(pngBase64, 'base64'));
      fs.writeFileSync(path.join(opts.outDir, atlasFile), sheet.atlasJson, 'utf-8');
      fs.writeFileSync(path.join(opts.outDir, glbFile), Buffer.from(glb.base64, 'base64'));

      const entry = {
        id: target,
        presetId,
        name: summary?.name ?? target,
        heightM: summary?.heightM ?? 0,
        triangles: summary?.triangles ?? 0,
        unwrapMetrics: summary?.unwrapMetrics ?? null,
        sheet: {
          file: sheetFile,
          atlasFile,
          width: sheet.width,
          height: sheet.height,
          cols: sheet.cols,
          rows: sheet.rows,
          clippedFrames: sheet.clippedFrames,
        },
        glb: {
          file: glbFile,
          byteLength: glb.byteLength,
          quantizedAlbedo: opts.quantizeGlb,
          quantizedDither: opts.ditherGlb,
          meshCount: glb.meshCount,
          skinnedMeshCount: glb.skinnedMeshCount,
          boneCount: glb.boneCount,
          clipCount: glb.clipCount,
        },
        renderStats,
        exportMs: Date.now() - t0,
      };
      manifest.assets.push(entry);
      console.log(
        `[export:nwl]   -> ${sheetFile} (${sheet.width}x${sheet.height}), ${glbFile} (${(
          glb.byteLength / 1024
        ).toFixed(1)} KB, ${entry.triangles} tris) [${entry.exportMs}ms]`
      );
    }

    fs.writeFileSync(
      path.join(opts.outDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2),
      'utf-8'
    );
    console.log(`[export:nwl] Completed! Manifest written to ${path.join(opts.outDir, 'manifest.json')}`);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (!previewProc.killed) {
      previewProc.kill('SIGKILL');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[export:nwl] ERROR:', err);
    process.exit(1);
  });
