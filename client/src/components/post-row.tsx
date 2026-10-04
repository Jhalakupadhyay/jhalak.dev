import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { formatDate, type Post } from "@/lib/posts-core";

/** One post in a list: date column, title, summary and tags. */
export function PostRow({ post, index = 0 }: { post: Post, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 5) * 0.05 }}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="hover-target group grid grid-cols-1 md:grid-cols-[160px_1fr_auto] gap-4 md:gap-10 py-8 border-b border-white/10 hover:bg-white/[0.02] transition-colors"
      >
        <div className="font-mono text-xs uppercase tracking-widest text-zinc-500 pt-1">
          <div className="text-primary">{formatDate(post.date)}</div>
          <div className="mt-1">{post.readingMinutes} min read</div>
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl text-white group-hover:text-primary transition-colors font-display tracking-tight mb-3">
            {post.title}
          </h3>
          <p className="text-zinc-400 font-mono text-sm leading-relaxed max-w-3xl mb-4">{post.summary}</p>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-mono uppercase tracking-widest text-accent bg-accent/10 px-2 py-1 border border-accent/20">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <ArrowUpRight className="hidden md:block w-6 h-6 text-zinc-600 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
      </Link>
    </motion.div>
  );
}
