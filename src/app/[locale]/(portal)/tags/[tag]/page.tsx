import { getBlogPosts, getAllTags } from '@/lib/mdx';
import { Link } from '@/navigation';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  
  const posts = getBlogPosts().filter(post => 
    post.metadata.tags?.some(t => t.toLowerCase() === decodedTag.toLowerCase())
  );

  if (posts.length === 0) notFound();

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">Tag: <span className="text-blue-600">{decodedTag}</span></h1>
      
      <div className="grid gap-8">
        {posts.map(post => (
          <div key={post.slug} className="border-b pb-8 border-slate-100 dark:border-slate-900">
             <Link href={`/blog/${post.slug}`} className="text-xl font-bold hover:underline">{post.metadata.title}</Link>
             <p className="text-slate-500 mt-2">{post.metadata.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}