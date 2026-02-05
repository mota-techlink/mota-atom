import manifest from '@/generated/assets-manifest.json';

export async function getImagesFromDir(dir: string): Promise<string[]> {
  // 规范化 key：确保以 / 开头，且不以 / 结尾 (除非是根目录)
  // 例如: "/images/showcase"
  let normalizeKey = dir.startsWith('/') ? dir : `/${dir}`;
  normalizeKey = normalizeKey.replace(/\\/g, '/'); // Win 兼容
  
  // @ts-ignore
  const images = manifest.images[normalizeKey] || [];

  if (images.length === 0) {
    console.warn(`[ImageSlider] No images found for key: ${normalizeKey}`);
    // 尝试做一下模糊匹配或 debug
    // const keys = Object.keys(manifest.images);
    // console.log('Available keys:', keys);
  }

  return images;
}