import { notFound } from "next/navigation"
import { getProductBySlug } from '@/lib/mdx'; //
import { ProductLayout } from "@/components/product/product-layout"
import { MdxContent } from "@/components/mdx/mdx-content"

export default async function AIProductPage({ params }: { params: { slug: string, locale: string } }) {
  const { slug, locale } = params;
  const product = await getProductBySlug(slug, locale);

  if (!product) notFound();

  return (
    <ProductLayout 
      data={product.metadata} 
      content={<MdxContent content={product.content} />} 
    />
  )
}