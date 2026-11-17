// Headless Node compatibility shims for Three.js GLTFLoader when re-importing GLBs with embedded PNGs.
const g = globalThis as Record<string, unknown>;

if (typeof g.self === 'undefined') {
  g.self = globalThis;
}

if (typeof g.createImageBitmap === 'undefined') {
  g.createImageBitmap = async (source: unknown): Promise<ImageBitmap> => {
    let width = 1;
    let height = 1;
    if (source && typeof (source as Blob).arrayBuffer === 'function') {
      const buf = await (source as Blob).arrayBuffer();
      const bytes = new Uint8Array(buf);
      // Parse PNG IHDR width/height if header matches PNG signature
      if (
        bytes.length >= 24 &&
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
      ) {
        const view = new DataView(buf);
        width = Math.max(1, view.getUint32(16, false));
        height = Math.max(1, view.getUint32(20, false));
      }
    }
    return {
      width,
      height,
      close() {},
    };
  };
}
