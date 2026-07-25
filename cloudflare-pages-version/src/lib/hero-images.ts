/**
 * Shared hero image selection. Same logic as the main project's
 * `lib/hero-images.ts`, but image paths are relative (`./bg/...`) so they
 * resolve correctly under any base path (Cloudflare root or GitHub Pages
 * sub-path).
 */

const DAY_DESKTOP = [
  "./bg/day/1764535480103.jpg",
  "./bg/day/20251212125216.jpg",
  "./bg/day/IMG_20260712_022434.jpg",
  "./bg/day/IMG_20260712_022557.jpg",
  "./bg/day/IMG_20260712_022635.jpg",
  "./bg/day/IMG_20260717_034250.jpg",
  "./bg/day/bbcc0e10bce0600208eae76d56175c25620521548.jpg",
];
const DAY_MOBILE = [
  "./bg/day-mobile/IMG_20260717_033901.jpg",
  "./bg/day-mobile/IMG_20260717_033954.jpg",
  "./bg/day-mobile/IMG_20260717_034107.jpg",
  "./bg/day-mobile/IMG_20260717_034127.jpg",
  "./bg/day-mobile/IMG_20260717_034422.jpg",
  "./bg/day-mobile/IMG_20260717_034445.jpg",
  "./bg/day-mobile/IMG_20260717_034513.jpg",
  "./bg/day-mobile/IMG_20260717_034539.jpg",
];
const NIGHT_DESKTOP = [
  "./bg/night/1765255232753.jpg",
  "./bg/night/1781673941796.jpg",
  "./bg/night/20251210211750.jpg",
  "./bg/night/45691349_p0.jpg",
  "./bg/night/IMG_20260717_034235.jpg",
];
const NIGHT_MOBILE = [
  "./bg/night-mobile/IMG_20260717_033818.jpg",
  "./bg/night-mobile/IMG_20260717_034216.jpg",
  "./bg/night-mobile/IMG_20260717_034330_edit_111494215253924.jpg",
  "./bg/night-mobile/IMG_20260717_034956.jpg",
];

export function getDayPool(isMobile: boolean) {
  return isMobile ? DAY_MOBILE : DAY_DESKTOP;
}
export function getNightPool(isMobile: boolean) {
  return isMobile ? NIGHT_MOBILE : NIGHT_DESKTOP;
}

export function pickRandom<T>(pool: T[], avoid?: T): T {
  if (pool.length === 1) return pool[0];
  let next = pool[Math.floor(Math.random() * pool.length)];
  for (let i = 0; i < 5 && next === avoid; i++) {
    next = pool[Math.floor(Math.random() * pool.length)];
  }
  return next;
}

/** Preload all images so theme/viewport switches are instant. */
export function preloadAll() {
  [...DAY_DESKTOP, ...DAY_MOBILE, ...NIGHT_DESKTOP, ...NIGHT_MOBILE].forEach(
    (src) => {
      const img = new Image();
      img.src = src;
    }
  );
}

/** Preload a single image, returns a promise that resolves on load. */
export function preloadOne(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

// Module-level storage for picked images. A fresh page load re-runs the
// module so these reset, giving a new random pick every refresh.
let pickedDay: string | null = null;
let pickedNight: string | null = null;

export function pickInitialImages(isMobile: boolean) {
  pickedDay = pickRandom(getDayPool(isMobile));
  pickedNight = pickRandom(getNightPool(isMobile));
  return { day: pickedDay, night: pickedNight };
}

export function getStoredImages(): { day: string | null; night: string | null } {
  return { day: pickedDay, night: pickedNight };
}
