// Validates every post in /posts: frontmatter, file names, unique URLs and
// image paths. Runs in CI before the build, and locally with `npm run check:posts`.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { isPostFile, parsePost } from "../client/src/lib/posts-core.ts";

const root = join(import.meta.dirname, "..");
const postsDir = join(root, "posts");
const publicDir = join(root, "client", "public");

const errors: string[] = [];
const slugs = new Map<string, string>();
let count = 0;

for (const file of readdirSync(postsDir).filter(isPostFile).sort()) {
  try {
    const post = parsePost(file, readFileSync(join(postsDir, file), "utf8"));
    count++;

    const clash = slugs.get(post.slug);
    if (clash) errors.push(`posts/${file}: same URL /blog/${post.slug} as posts/${clash}`);
    slugs.set(post.slug, file);

    for (const [, src] of post.body.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)) {
      if (src.startsWith("/") && !existsSync(join(publicDir, src))) {
        errors.push(`posts/${file}: image ${src} not found in client/public${src}`);
      }
    }
  } catch (error) {
    errors.push((error as Error).message);
  }
}

if (errors.length > 0) {
  console.error(`✗ ${errors.length} problem(s) in posts:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log(`✓ ${count} post(s) OK`);
