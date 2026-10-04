import { ArrowLeft, ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "wouter";
import { SiteFooter, SiteShell } from "@/components/site-chrome";
import { findPost, posts, renderMarkdown } from "@/lib/blog";
import { usePageMeta } from "@/lib/page-meta";
import { formatDate } from "@/lib/posts-core";
import NotFound from "@/pages/not-found";

export default function BlogPost() {
  const { slug = "" } = useParams<{ slug: string }>();
  const post = findPost(slug);
  if (!post) return <NotFound />;
  return <Article slug={slug} />;
}

function Article({ slug }: { slug: string }) {
  const post = findPost(slug)!;
  const html = useMemo(() => renderMarkdown(post.body), [post.body]);
  usePageMeta({
    title: `${post.title} | Jhalak Upadhyay`,
    description: post.summary,
    canonical: post.canonical,
    type: "article",
  });

  const index = posts.indexOf(post);
  const newer = index > 0 ? posts[index - 1] : undefined;
  const older = index < posts.length - 1 ? posts[index + 1] : undefined;
  const fromMedium = post.canonical?.includes("medium.com");

  return (
    <SiteShell>
      <main className="pt-32 pb-24 bg-[#030303] min-h-screen">
        <article className="container mx-auto px-6 max-w-3xl">
          <Link href="/blog" className="hover-target inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> cd ../blog
          </Link>

          <header className="mb-12 border-b border-primary/30 pb-10">
            <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 mb-6 flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-primary">{formatDate(post.date)}</span>
              <span>//</span>
              <span>{post.readingMinutes} min read</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display text-white mb-6 leading-[1.05]">{post.title}</h1>
            <p className="text-zinc-400 font-mono text-sm leading-relaxed border-l-2 border-accent pl-4 mb-6">{post.summary}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 border border-accent/20">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

          {post.canonical && (
            <p className="mt-16 font-mono text-xs text-zinc-500 border border-white/10 bg-[#050505] px-4 py-3">
              &gt; originally published on{" "}
              <a href={post.canonical} target="_blank" rel="noreferrer" className="hover-target text-primary hover:text-accent underline underline-offset-4">
                {fromMedium ? "Medium" : new URL(post.canonical).hostname}
              </a>
            </p>
          )}

          <nav className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
            {older ? (
              <Link href={`/blog/${older.slug}`} className="hover-target group border border-white/15 hover:border-primary/60 p-4 transition-colors">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2"><ArrowLeft className="w-3 h-3" /> Older</div>
                <div className="text-sm text-white group-hover:text-primary">{older.title}</div>
              </Link>
            ) : <div />}
            {newer && (
              <Link href={`/blog/${newer.slug}`} className="hover-target group border border-white/15 hover:border-primary/60 p-4 transition-colors sm:text-right">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-2 sm:justify-end">Newer <ArrowRight className="w-3 h-3" /></div>
                <div className="text-sm text-white group-hover:text-primary">{newer.title}</div>
              </Link>
            )}
          </nav>
        </article>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
