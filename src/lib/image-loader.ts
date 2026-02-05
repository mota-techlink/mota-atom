import fs from 'fs';
import path from 'path';

export async function getImagesFromDir(dir: string): Promise<string[]> {
  // 1. 确定 public 文件夹的物理路径
  const publicDir = path.join(process.cwd(), 'public');
  
  // 2. 拼接目标文件夹路径 (移除开头的 / 防止路径错误)
  const targetDir = path.join(publicDir, dir.replace(/^\//, ''));

  // 3. 如果文件夹不存在，返回空数组
  if (!fs.existsSync(targetDir)) {
    console.warn(`[ImageSlider] Directory not found: ${targetDir}`);
    return [];
  }

  // 4. 读取所有文件并过滤图片
  const files = fs.readdirSync(targetDir);
  const images = files
    .filter((file) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)) // 只取图片
    .sort() // 排序，保证顺序一致
    .map((file) => {
      // 5. 拼接回 Web 可访问的 URL 路径 (e.g., /images/showcase/xxx.jpg)
      const urlPath = path.join(dir, file).replace(/\\/g, '/'); // 修复 Windows 路径分隔符
      return urlPath.startsWith('/') ? urlPath : `/${urlPath}`;
    });

  return images;
}