import { Marked, type Tokens } from "marked";
import { isPostFile, parsePost, sortPosts, type Post } from "./posts-core";

export type { Post } from "./posts-core";

const files = import.meta.glob("../../../posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

/** Published posts, newest first. Drafts only show up in `npm run dev`. */
export const posts: Post[] = sortPosts(
  Object.entries(files)
    .map(([path, raw]) => [path.split("/").pop()!, raw] as const)
    .filter(([name]) => isPostFile(name))
    .map(([name, raw]) => parsePost(name, raw))
    .filter((post) => import.meta.env.DEV || !post.draft),
);

export const allTags: string[] = [...new Set(posts.flatMap((post) => post.tags))].sort();

export function findPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const markdown = new Marked({ gfm: true });
markdown.use({
  renderer: {
    heading({ tokens, depth }: Tokens.Heading) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${headingId(html)}">${html}</h${depth}>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const html = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noreferrer"' : "";
      const titleAttr = title ? ` title="${title}"` : "";
      return `<a href="${href}"${titleAttr}${attrs}>${html}</a>`;
    },
    image({ href, title, text }: Tokens.Image) {
      const caption = title ? `<figcaption>${title}</figcaption>` : "";
      return `<figure><img src="${href}" alt="${text}" loading="lazy" />${caption}</figure>`;
    },
  },
});

export function renderMarkdown(body: string): string {
  return markdown.parse(body, { async: false });
}
