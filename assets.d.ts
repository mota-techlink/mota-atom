declare module "@/generated/assets-manifest.json" {
  const content: Record<string, any[]>;
  const images: Record<string, string[]>;
  const generatedAt: string;
  
  const manifest: {
    content: typeof content;
    images: typeof images;
    generatedAt: typeof generatedAt;
  };
  
  export default manifest;
}