import { useEffect } from "react";

interface PageMeta {
  title: string;
  description?: string;
  /** Canonical URL; defaults to the current page on jhalak.dev. */
  canonical?: string;
  type?: "website" | "article";
}

const SITE_URL = "https://jhalak.dev";

function setMeta(attr: "name" | "property", key: string, value: string): () => void {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const created = !el;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  const previous = el.content;
  el.content = value;
  return () => {
    if (created) el!.remove();
    else el!.content = previous;
  };
}

/** Sets the title, description and canonical link while a page is mounted. */
export function usePageMeta({ title, description, canonical, type = "website" }: PageMeta) {
  useEffect(() => {
    const restore: (() => void)[] = [];
    const previousTitle = document.title;
    document.title = title;
    restore.push(() => (document.title = previousTitle));

    restore.push(setMeta("property", "og:title", title));
    restore.push(setMeta("name", "twitter:title", title));
    restore.push(setMeta("property", "og:type", type));
    if (description) {
      restore.push(setMeta("name", "description", description));
      restore.push(setMeta("property", "og:description", description));
      restore.push(setMeta("name", "twitter:description", description));
    }

    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = canonical ?? `${SITE_URL}${window.location.pathname}`;
    document.head.appendChild(link);
    restore.push(() => link.remove());

    return () => restore.reverse().forEach((undo) => undo());
  }, [title, description, canonical, type]);
}
