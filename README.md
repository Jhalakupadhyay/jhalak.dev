# jhalak.dev

Source for [jhalak.dev](https://jhalak.dev), my portfolio and blog.

Built with React, TypeScript, Vite, Tailwind CSS and Framer Motion. Deployed
to Cloudflare Pages by GitHub Actions on every push to `main`.

## Run locally

```sh
npm install
npm run dev        # http://localhost:5000
```

## Writing a post

1. Copy `posts/_template.md` to `posts/YYYY-MM-DD-your-slug.md`. The part
   after the date becomes the URL: `jhalak.dev/blog/your-slug`.
2. Fill in the frontmatter (`title`, `date`, `summary`, `tags`) and write the
   post in Markdown.
3. Put images in `client/public/blog/your-slug/` and reference them as
   `/blog/your-slug/image.png`.
4. Run `npm run check:posts` to validate, then push to `main`.

Set `draft: true` to keep a post off the live site while you work on it; drafts
still show up in `npm run dev`. If a post was first published somewhere else,
add `canonical:` with the original URL.

## Scripts

| Command               | What it does                                 |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the dev server                         |
| `npm run build`       | Build the site into `dist/`                  |
| `npm run check`       | Type-check with TypeScript                   |
| `npm run check:posts` | Validate every post's frontmatter and images |

## Deployment

`.github/workflows/deploy.yml` type-checks, validates posts and builds on every
push and pull request. Pushes to `main` are then deployed to Cloudflare Pages.

It needs these repository settings:

- Secret `CLOUDFLARE_API_TOKEN`: an API token with the *Cloudflare Pages: Edit*
  permission.
- Secret `CLOUDFLARE_ACCOUNT_ID`: the Cloudflare account ID.
- Variable `CLOUDFLARE_PAGES_PROJECT`: the Pages project name.
