import { useState } from "react";
import { PostRow } from "@/components/post-row";
import { ScrambleText, SiteFooter, SiteShell } from "@/components/site-chrome";
import { allTags, posts } from "@/lib/blog";
import { usePageMeta } from "@/lib/page-meta";

export default function Blog() {
  usePageMeta({
    title: "Blog.log | Jhalak Upadhyay",
    description: "Notes, deep dives and things I've learned while building software.",
  });
  const [tag, setTag] = useState<string | null>(null);
  const visible = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;

  return (
    <SiteShell>
      <main className="pt-36 pb-32 bg-[#030303] min-h-screen">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 border-b border-primary/30 pb-8">
            <div>
              <p className="font-mono text-xs text-zinc-500 mb-4">$ ls ~/blog --sort=date</p>
              <h1 className="text-5xl md:text-7xl mb-4 font-display text-white glitch-hover" data-text="Blog.log">
                <ScrambleText text="Blog.log" />
              </h1>
              <p className="text-primary text-lg max-w-xl font-mono">
                Notes, deep dives and things I've learned while building software.
              </p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 text-right">
              <div>[ newest // first ]</div>
              <div className="text-accent mt-1">{posts.length} {posts.length === 1 ? "ENTRY" : "ENTRIES"}</div>
            </div>
          </div>

          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {[null, ...allTags].map((t) => (
                <button
                  key={t ?? "all"}
                  onClick={() => setTag(t)}
                  className={`hover-target text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                    tag === t
                      ? "bg-primary text-black border-primary"
                      : "text-zinc-400 border-white/15 hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  {t ?? "all"}
                </button>
              ))}
            </div>
          )}

          {visible.length === 0 ? (
            <p className="font-mono text-zinc-500 py-16">&gt; no entries found. first post compiling...</p>
          ) : (
            <div className="border-t border-white/10">
              {visible.map((post, i) => (
                <PostRow key={post.slug} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
