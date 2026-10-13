// Post-render step (see `post-render` in _quarto.yml).
//
// Our own stylesheets and scripts keep the same URL across deploys, and GitHub
// Pages lets browsers cache them for 10 minutes. After a deploy a browser can
// therefore combine new HTML with old CSS/JS (e.g. the dark-mode artwork shown
// in light mode). This appends a content fingerprint to every reference to
// /assets/css/*.css and /assets/js/*.js in the rendered HTML:
//   href="assets/css/home.css"  ->  href="assets/css/home.css?v=1a2b3c4d"
// so the URL changes exactly when the file changes.

const SITE = "_site";

async function fingerprint(path: string): Promise<string> {
  const data = await Deno.readFile(path);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash)).slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function* walk(dir: string): AsyncGenerator<string> {
  for await (const entry of Deno.readDir(dir)) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory) yield* walk(path);
    else if (entry.isFile && entry.name.endsWith(".html")) yield path;
  }
}

const versions = new Map<string, string>();
for (const sub of ["assets/css", "assets/js"]) {
  try {
    for await (const entry of Deno.readDir(`${SITE}/${sub}`)) {
      if (entry.isFile) {
        versions.set(`${sub}/${entry.name}`, await fingerprint(`${SITE}/${sub}/${entry.name}`));
      }
    }
  } catch {
    // directory not present in this render
  }
}

// matches  assets/css/name.css  or  assets/js/name.js  (optionally prefixed by
// ../ or /) inside an href/src attribute, with or without an existing ?v=
const ref = /((?:href|src)=["'](?:\.\.\/|\/)*)(assets\/(?:css|js)\/[\w.-]+\.(?:css|js))(\?v=[0-9a-f]+)?(["'])/g;

let changed = 0;
for await (const file of walk(SITE)) {
  const html = await Deno.readTextFile(file);
  const out = html.replace(ref, (m, pre, asset, _old, quote) => {
    const v = versions.get(asset);
    return v ? `${pre}${asset}?v=${v}${quote}` : m;
  });
  if (out !== html) {
    await Deno.writeTextFile(file, out);
    changed++;
  }
}
console.log(`cache-bust: fingerprinted assets in ${changed} pages`);
