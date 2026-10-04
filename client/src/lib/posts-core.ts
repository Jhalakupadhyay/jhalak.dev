// Parsing for blog posts in /posts. Kept free of Vite-specific APIs so the
// CI check script (scripts/check-posts.ts) can reuse it under plain Node.

export interface Post {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  summary: string;
  tags: string[];
  /** Original URL when the post was first published elsewhere. */
  canonical?: string;
  draft: boolean;
  readingMinutes: number;
  /** Markdown body without the frontmatter. */
  body: string;
}

const FILENAME = /^(\d{4}-\d{2}-\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)\.md$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const WORDS_PER_MINUTE = 200;

/** Files starting with `_` (like `_template.md`) are never published. */
export function isPostFile(filename: string): boolean {
  return !filename.startsWith("_") && filename.endsWith(".md");
}

export function parsePost(filename: string, raw: string): Post {
  const fail = (message: string): never => {
    throw new Error(`posts/${filename}: ${message}`);
  };

  const match = FILENAME.exec(filename);
  if (!match) {
    fail("file name must look like 2026-01-31-my-post-title.md (lowercase, hyphens)");
  }
  const [, fileDate, slug] = match!;

  const text = raw.replace(/\r\n/g, "\n");
  if (!text.startsWith("---\n")) fail("missing frontmatter (the --- block at the top)");
  const end = text.indexOf("\n---", 4);
  if (end === -1) fail("frontmatter is not closed with ---");

  const meta: Record<string, string> = {};
  for (const line of text.slice(4, end).split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon === -1) fail(`can't read frontmatter line "${line}"`);
    const key = line.slice(0, colon).trim();
    meta[key] = unquote(line.slice(colon + 1).trim());
  }

  const title = meta.title || fail("frontmatter needs a title");
  const date = meta.date || fileDate;
  if (!DATE.test(date)) fail(`date "${date}" must be YYYY-MM-DD`);
  const summary = meta.summary || fail("frontmatter needs a summary (one or two sentences)");
  const body = text.slice(end + 4).replace(/^\n+/, "");
  if (!body.trim()) fail("post has no content");

  return {
    slug,
    title,
    date,
    summary,
    tags: parseTags(meta.tags ?? ""),
    canonical: meta.canonical || undefined,
    draft: meta.draft === "true",
    readingMinutes: Math.max(1, Math.round(countWords(body) / WORDS_PER_MINUTE)),
    body,
  };
}

/** Newest first. */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function unquote(value: string): string {
  const quoted = /^(["'])(.*)\1$/.exec(value);
  return quoted ? quoted[2] : value;
}

function parseTags(value: string): string[] {
  return value
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((tag) => unquote(tag.trim()).toLowerCase())
    .filter(Boolean);
}

function countWords(markdown: string): number {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
