export interface ZipEntryBuffer {
  name: string;
  baseName: string;
  data: Uint8Array;
}

/**
 * Pure-TS ZIP archive extractor using browser-standard `DecompressionStream('deflate-raw')`
 * (zero Node built-in imports, compatible with browser main thread, Web Workers, and modern V8 runtimes).
 */
export async function extractZipArchiveEntries(buffer: ArrayBuffer): Promise<ZipEntryBuffer[]> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);

  // Locate End of Central Directory (EOCD) signature 0x06054b50 scanning backward from end
  let eocdOffset = -1;
  const minEocdSearch = Math.max(0, bytes.length - 65557);
  for (let i = bytes.length - 22; i >= minEocdSearch; i--) {
    if (view.getUint32(i, true) === 0x06054b50) {
      eocdOffset = i;
      break;
    }
  }
  if (eocdOffset < 0) {
    throw new Error('Arquivo .zip inválido: cabeçalho EOCD não encontrado.');
  }

  const totalEntries = view.getUint16(eocdOffset + 10, true);
  const cdSize = view.getUint32(eocdOffset + 12, true);
  const cdOffset = view.getUint32(eocdOffset + 16, true);
  if (totalEntries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) {
    throw new Error('ZIP64 (>4GB ou >65535 entradas) não é suportado no leitor browser-pure.');
  }
  const decoder = new TextDecoder('utf-8');
  const entries: ZipEntryBuffer[] = [];

  let ptr = cdOffset;
  for (let i = 0; i < totalEntries && ptr + 46 <= bytes.length; i++) {
    const sig = view.getUint32(ptr, true);
    if (sig !== 0x02014b50) break;

    const method = view.getUint16(ptr + 10, true);
    const compSize = view.getUint32(ptr + 20, true);
    const uncompSize = view.getUint32(ptr + 24, true);
    const nameLen = view.getUint16(ptr + 28, true);
    const extraLen = view.getUint16(ptr + 30, true);
    const commentLen = view.getUint16(ptr + 32, true);
    const localHeaderOffset = view.getUint32(ptr + 42, true);

    if (
      compSize === 0xffffffff ||
      uncompSize === 0xffffffff ||
      localHeaderOffset === 0xffffffff
    ) {
      throw new Error('ZIP64 (>4GB ou >65535 entradas) não é suportado no leitor browser-pure.');
    }

    const rawName = decoder.decode(bytes.subarray(ptr + 46, ptr + 46 + nameLen));
    ptr += 46 + nameLen + extraLen + commentLen;

    // Skip directories and macOS __MACOSX metadata
    if (rawName.endsWith('/') || rawName.includes('__MACOSX/')) continue;

    if (localHeaderOffset + 30 > bytes.length) continue;
    const localSig = view.getUint32(localHeaderOffset, true);
    if (localSig !== 0x04034b50) continue;

    const localNameLen = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLen = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen;
    if (dataStart + compSize > bytes.length) {
      throw new Error(`Entrada .zip truncada ou corrompida em "${rawName}".`);
    }
    const compSlice = bytes.subarray(dataStart, dataStart + compSize);

    let fileData: Uint8Array;
    if (method === 0) {
      fileData = new Uint8Array(compSlice);
    } else if (method === 8) {
      if (typeof DecompressionStream === 'undefined') {
        throw new Error('DecompressionStream ausente neste ambiente para descompactar .zip.');
      }
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      void writer.write(new Uint8Array(compSlice));
      void writer.close();
      const ab = await new Response(ds.readable).arrayBuffer();
      fileData = new Uint8Array(ab);
    } else {
      throw new Error(`Método de compressão ZIP (${method}) não suportado em ${rawName}.`);
    }

    if (uncompSize > 0 && fileData.length !== uncompSize) {
      // Tolerate minor stream differences, keep actual decoded bytes
    }

    const cleanPath = rawName.replace(/\\/g, '/');
    const baseName = cleanPath.split('/').pop() || cleanPath;
    entries.push({ name: cleanPath, baseName, data: fileData });
  }

  return entries;
}
