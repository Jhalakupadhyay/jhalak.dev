import { Link } from "wouter";
import { SiteFooter, SiteShell } from "@/components/site-chrome";
import { usePageMeta } from "@/lib/page-meta";

export default function NotFound() {
  usePageMeta({ title: "404 // Not found | Jhalak Upadhyay" });

  return (
    <SiteShell>
      <main className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="max-w-xl w-full border border-white/20 bg-[#050505] font-mono">
          <div className="px-4 py-3 border-b border-white/10 bg-white/5 text-xs text-zinc-500">root@judev:~</div>
          <div className="p-8">
            <p className="text-zinc-400 mb-2">$ cd {typeof window !== "undefined" ? window.location.pathname : ""}</p>
            <p className="text-accent mb-6">bash: no such file or directory</p>
            <h1 className="text-5xl font-display text-white mb-8 glitch-hover" data-text="404">404</h1>
            <Link href="/" className="hover-target inline-flex items-center justify-center bg-primary text-black hover:bg-white transition-colors h-12 px-6 text-sm uppercase tracking-widest font-bold">
              cd ~
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
