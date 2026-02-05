import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us",
  description: "We are building the future of SaaS asset management.",
}

export default function AboutPage() {
  return (
    // 🟢 修复: 添加 mx-auto
    <div className="container mx-auto  px-4 md:px-6 py-5 ">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          About <span className="text-blue-600">MOTA ATOM</span>
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          We are on a mission to simplify the chaos of digital asset management through intelligent, GenAI-first solutions.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
          <p>
            It started with a simple observation: managing SaaS assets and computer vision datasets was becoming impossibly complex. Traditional tools were clunky, slow, and disconnected.
          </p>
          <p>
            We realized that Generative AI wasn't just a buzzword—it was the key to unlocking a new workflow. By generating data instead of just collecting it, we could speed up development cycles by 10x.
          </p>
          <p>
            Today, MOTA ATOM helps thousands of developers and companies structure their chaos and build faster.
          </p>
        </div>
        <div className="relative aspect-square md:aspect-video overflow-hidden rounded-2xl border bg-muted/50">
           <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
             About Us Image Placeholder
           </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 md:p-12 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-blue-600">10k+</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Users</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-blue-600">99.9%</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Uptime</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-blue-600">50+</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Integrations</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-bold text-blue-600">24/7</h3>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Support</p>
          </div>
        </div>
      </div>
    </div>
  )
}