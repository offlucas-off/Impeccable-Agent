import type { PresetCategory, PresetEntry } from './PresetRegistry';

export interface ZipFileEntry {
  path: string;
  data: Uint8Array | string;
}

export interface BatchExportOptions {
  categories: PresetCategory[] | 'all';
  includeGlb: boolean;
  includePng: boolean;
  include8DirSheet: boolean;
  quantizeGlb: boolean;
  ditherGlb: boolean;
  pngSize?: number;
  sheetHeightPx?: number;
  sheetFramesPerDir?: number;
  onProgress?: (done: number, total: number, currentName: string) => void;
}

export interface BatchAssetManifestEntry {
  id: string;
  name: string;
  category: PresetCategory;
  approxHeightM: number;
  files: string[];
  triangles?: number;
  byteLengthGlb?: number;
  error?: string;
}

export interface BatchManifest {
  generatedAt: string;
  stylePreset: string;
  paletteId: string;
  rampId: string;
  totalAssets: number;
  assets: BatchAssetManifestEntry[];
}

export interface BatchExportCallbacks {
  loadPreset: (entry: PresetEntry) => Promise<void>;
  capturePngDataUrl: (size: number) => string;
  exportSheet?: (
    targetHeightPx: number,
    framesPerDir: number
  ) => { imageDataUrl: string; atlasJson: string } | null;
  exportGlbBytes: (
    quantize: boolean,
    dither: boolean
  ) => Promise<{ bytes: Uint8Array; triangles: number } | null>;
  getStyleInfo: () => { stylePreset: string; paletteId: string; rampId: string };
}

// ─── Zero-Dependency CRC32 + STORE ZIP Builder ───────────────────────────────

const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const textEncoder = new TextEncoder();

export function createZipUint8Array(entries: ZipFileEntry[]): Uint8Array {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const cleanPath = entry.path.replace(/^\/+/, '');
    const nameBytes = textEncoder.encode(cleanPath);
    const dataBytes =
      typeof entry.data === 'string' ? textEncoder.encode(entry.data) : entry.data;
    const crc = crc32(dataBytes);
    const size = dataBytes.length;

    // Local File Header (30 bytes + name)
    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true); // version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 flag
    lv.setUint16(8, 0, true); // compression: STORE
    lv.setUint16(10, 0, true); // mod time
    lv.setUint16(12, 0x5421, true); // mod date
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    // Central Directory Header (46 bytes + name)
    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5421, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  let centralSize = 0;
  for (const c of centralParts) centralSize += c.length;

  // End of Central Directory (22 bytes)
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalBytes = offset + centralSize + eocd.length;
  const out = new Uint8Array(totalBytes);
  let cursor = 0;
  for (const part of localParts) {
    out.set(part, cursor);
    cursor += part.length;
  }
  for (const part of centralParts) {
    out.set(part, cursor);
    cursor += part.length;
  }
  out.set(eocd, cursor);
  return out;
}

export function createZipBlob(entries: ZipFileEntry[]): Blob {
  const bytes = createZipUint8Array(entries);
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy.buffer], { type: 'application/zip' });
}

export function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const commaIdx = dataUrl.indexOf(',');
  const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
  if (typeof atob === 'function') {
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      out[i] = bin.charCodeAt(i);
    }
    return out;
  }
  // Pure-JS base64 fallback for environments without atob
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const clean = base64.replace(/[^A-Za-z0-9+/=]/g, '');
  const bytes: number[] = [];
  for (let i = 0; i < clean.length; i += 4) {
    const e1 = chars.indexOf(clean[i] ?? 'A');
    const e2 = chars.indexOf(clean[i + 1] ?? 'A');
    const e3 = clean[i + 2] === '=' ? -1 : chars.indexOf(clean[i + 2] ?? 'A');
    const e4 = clean[i + 3] === '=' ? -1 : chars.indexOf(clean[i + 3] ?? 'A');
    bytes.push((e1 << 2) | (e2 >> 4));
    if (e3 >= 0) bytes.push(((e2 & 15) << 4) | (e3 >> 2));
    if (e4 >= 0) bytes.push(((e3 & 3) << 6) | e4);
  }
  return new Uint8Array(bytes);
}

export async function runBatchExport(
  presets: PresetEntry[],
  callbacks: BatchExportCallbacks,
  opts: BatchExportOptions
): Promise<{ zipBlob: Blob; manifest: BatchManifest }> {
  const filtered =
    opts.categories === 'all'
      ? presets
      : presets.filter((p) => opts.categories.includes(p.category));

  const styleInfo = callbacks.getStyleInfo();
  const manifest: BatchManifest = {
    generatedAt: new Date().toISOString(),
    stylePreset: styleInfo.stylePreset,
    paletteId: styleInfo.paletteId,
    rampId: styleInfo.rampId,
    totalAssets: filtered.length,
    assets: [],
  };

  const zipFiles: ZipFileEntry[] = [];
  const pngSize = opts.pngSize ?? 512;
  const sheetH = opts.sheetHeightPx ?? 108;
  const sheetFrames = opts.sheetFramesPerDir ?? 4;

  for (let i = 0; i < filtered.length; i++) {
    const entry = filtered[i];
    opts.onProgress?.(i, filtered.length, entry.name);
    const safeId = entry.id.replace(/[^a-zA-Z0-9._-]/g, '_');
    const folder = `${entry.category}/${safeId}`;
    const files: string[] = [];
    const mEntry: BatchAssetManifestEntry = {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      approxHeightM: entry.approxHeightM,
      files,
    };

    try {
      await callbacks.loadPreset(entry);

      if (opts.includePng) {
        const pngUrl = callbacks.capturePngDataUrl(pngSize);
        if (pngUrl) {
          const p = `${folder}/${safeId}_preview.png`;
          zipFiles.push({ path: p, data: dataUrlToUint8Array(pngUrl) });
          files.push(p);
        }
      }

      if (opts.include8DirSheet && entry.supports8DirSheet && callbacks.exportSheet) {
        const sheet = callbacks.exportSheet(sheetH, sheetFrames);
        if (sheet) {
          const pPng = `${folder}/${safeId}_sheet_8dir.png`;
          const pAtlas = `${folder}/${safeId}_atlas.json`;
          zipFiles.push({ path: pPng, data: dataUrlToUint8Array(sheet.imageDataUrl) });
          zipFiles.push({ path: pAtlas, data: sheet.atlasJson });
          files.push(pPng, pAtlas);
        }
      }

      if (opts.includeGlb) {
        const glbRes = await callbacks.exportGlbBytes(opts.quantizeGlb, opts.ditherGlb);
        if (glbRes) {
          const p = `${folder}/${safeId}.glb`;
          zipFiles.push({ path: p, data: glbRes.bytes });
          files.push(p);
          mEntry.triangles = glbRes.triangles;
          mEntry.byteLengthGlb = glbRes.bytes.byteLength;
        }
      }
    } catch (err) {
      mEntry.error = err instanceof Error ? err.message : String(err);
    }

    manifest.assets.push(mEntry);
  }

  opts.onProgress?.(filtered.length, filtered.length, 'Empacotando ZIP...');
  zipFiles.push({
    path: 'manifest.json',
    data: JSON.stringify(manifest, null, 2),
  });

  const zipBlob = createZipBlob(zipFiles);
  return { zipBlob, manifest };
}
