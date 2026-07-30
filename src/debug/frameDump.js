/**
 * Debug frame dump — press F9 in-game to save a PNG strip of the WebGL canvas
 * into downloads (or call window.GAME.dumpFrames(n) from the console).
 */
export function installFrameDumper(renderer, { prefix = 'meridian' } = {}) {
  let dumping = false;

  async function dumpFrames(count = 8, delayMs = 180) {
    if (dumping) return;
    dumping = true;
    const canvas = renderer.domElement;
    for (let i = 0; i < count; i++) {
      await new Promise((r) => setTimeout(r, delayMs));
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${prefix}_frame_${String(i).padStart(2, '0')}.png`;
      a.click();
    }
    dumping = false;
  }

  window.addEventListener('keydown', (e) => {
    if (e.code === 'F9') dumpFrames(6, 200);
  });

  return { dumpFrames };
}
