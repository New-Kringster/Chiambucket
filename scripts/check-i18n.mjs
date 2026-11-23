#!/usr/bin/env node
/*
  Keeps every language in step with the English site (see "Languages (i18n)" in CLAUDE.md).

    node scripts/check-i18n.mjs            structure + git staleness (run before you push)
    node scripts/check-i18n.mjs --ci       structure only (prebuild; the deploy has no git history)
    node scripts/check-i18n.mjs --staged   structure + "did this commit change English copy without
                                           changing every translation of it?" (the pre-commit hook)

  Structure: every page has a /[lang] route, is listed in LOCALIZED, proxy.ts and the sitemap, and every
  copy file has a translation in each language that its loader actually imports.
  Staleness: an English copy file changed in a later commit than one of its translations.
  A commit that really only touches English (a typo in a code comment, say) can skip the hook with
  I18N_SKIP=1 git commit ...
*/
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative, dirname, basename } from 'node:path';

const ROOT = join(dirname(new URL(import.meta.url).pathname), '..');
const mode = process.argv.includes('--staged') ? 'staged' : process.argv.includes('--ci') ? 'ci' : 'full';
if (mode === 'staged' && process.env.I18N_SKIP) process.exit(0);

const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const i18n = read('lib/i18n.ts');
const LANGS = JSON.parse(i18n.match(/LANGS = (\[[^\]]+\])/)[1].replace(/'/g, '"'));
const OTHER = LANGS.filter((l) => l !== 'en');
const LOCALIZED = JSON.parse(i18n.match(/LOCALIZED = (\[[^\]]*\])/s)[1].replace(/'/g, '"').replace(/,\s*\]/, ']'));
const MATCHER = JSON.parse(read('proxy.ts').match(/matcher: (\[[^\]]*\])/s)[1].replace(/'/g, '"').replace(/,\s*\]/, ']'));
const SITEMAP = read('public/sitemap.xml');

/* Pages that are deliberately English only, and pages kept out of the sitemap. */
const ENGLISH_ONLY = ['/stackchan-lidar/embed'];
const NOT_IN_SITEMAP = ['/comingsoon'];

const problems = []; // [message, the folder or file it is about]
const add = (msg, about) => problems.push([msg, about]);
const walk = (dir, out = []) => {
  for (const name of readdirSync(join(ROOT, dir))) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(join(ROOT, p)).isDirectory()) walk(p, out); else out.push(p);
  }
  return out;
};
const files = [...walk('app'), ...walk('components'), ...walk('lib')];

// 1. Routes
for (const f of files.filter((f) => basename(f) === 'page.tsx' && !f.startsWith('app/[lang]') && !f.startsWith('app/api'))) {
  const route = '/' + dirname(relative('app', f)).replace(/^\.$/, '');
  const base = route === '/' ? '/' : route.replace(/\/$/, '');
  if (ENGLISH_ONLY.includes(base)) continue;
  const langPage = join('app/[lang]', base === '/' ? '' : base, 'page.tsx');
  if (!existsSync(join(ROOT, langPage))) add(`${base}: no ${langPage}, so the page has no translated route`, dirname(f));
  if (!LOCALIZED.includes(base)) add(`${base}: missing from LOCALIZED in lib/i18n.ts`, dirname(f));
  if (!MATCHER.includes(base)) add(`${base}: missing from config.matcher in proxy.ts`, dirname(f));
  if (!NOT_IN_SITEMAP.includes(base)) {
    for (const l of OTHER) {
      const url = `https://www.chiambucket.com/${l}${base === '/' ? '' : base}`;
      if (!SITEMAP.includes(`"${url}"`) && !SITEMAP.includes(`<loc>${url}</loc>`)) { add(`${base}: public/sitemap.xml has no ${l} alternate`, dirname(f)); break; }
    }
  }
}

// 2. Copy files. A group is a folder with en.tsx/en.ts beside other languages (app/x/_copy, components/peeks, ...).
const groups = []; // { en, siblings: [path per other lang] }
const src = new Map(files.filter((f) => /\.(tsx?|mjs)$/.test(f)).map((f) => [f, read(f)]));
for (const f of files.filter((f) => /\/en\.tsx?$/.test(f))) {
  const dir = dirname(f), ext = f.endsWith('.tsx') ? '.tsx' : '.ts';
  const siblings = OTHER.map((l) => join(dir, l + ext));
  groups.push({ en: f, siblings });
  for (const [i, l] of OTHER.entries()) {
    if (!existsSync(join(ROOT, siblings[i]))) { add(`${siblings[i]}: missing (${l} translation of ${f})`, dir); continue; }
    // the language must be wired in: imported from the folder's index.ts or from anywhere else by path
    const local = src.get(join(dir, 'index.ts')) ?? '';
    const byIndex = new RegExp(`['"]\\./${l}['"]`).test(local);
    const byPath = [...src.values()].some((s) => s.includes(`${basename(dir)}/${l}'`) || s.includes(`${basename(dir)}/${l}"`) || s.includes(`${basename(dir)}/\${`));
    if (!byIndex && !byPath) add(`${siblings[i]}: exists but nothing imports it (add it to the loader map)`, dir);
  }
}
for (const f of files.filter((f) => basename(f) === '_copy.tsx')) {
  const body = src.get(f), dir = dirname(f);
  const siblings = [];
  for (const l of OTHER) {
    const file = join(dir, `_copy.${l}.tsx`);
    if (existsSync(join(ROOT, file))) {
      siblings.push(file);
      if (!body.includes(`./_copy.${l}'`)) add(`${file}: exists but ${f} does not import it`, f);
    } else if (!new RegExp(`^\\s+${l}\\s*:\\s*\\{|[{,]\\s*${l}\\s*[,}]`, 'm').test(body)) {
      add(`${f}: no ${l} copy (add _copy.${l}.tsx or a ${l} entry)`, f);
    }
  }
  if (siblings.length) groups.push({ en: f, siblings });
}

// 3. Staleness
const git = (...a) => { try { return execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return ''; } };
if (mode === 'staged') {
  const staged = new Set(git('diff', '--cached', '--name-only', '--diff-filter=AM').split('\n').filter(Boolean));
  for (const g of groups) {
    if (!staged.has(g.en)) continue;
    const behind = g.siblings.filter((s) => !staged.has(s));
    if (behind.length) add(`${g.en} changed, but not ${behind.map((s) => basename(s)).join(', ')}: update every language in the same commit`, g.en);
  }
} else if (mode === 'full') {
  const last = (p) => Number(git('log', '-1', '--format=%ct', '--', p)) || 0;
  for (const g of groups) {
    const t = last(g.en);
    const behind = g.siblings.filter((s) => existsSync(join(ROOT, s)) && last(s) < t);
    if (behind.length) add(`${g.en} was changed after ${behind.map((s) => basename(s)).join(', ')}: those translations may be out of date`, g.en);
  }
}

if (mode === 'staged') {
  // a commit is only held to the pages and copy it touches; the build (--ci) checks the whole site
  const staged = git('diff', '--cached', '--name-only', '--diff-filter=AM').split('\n').filter(Boolean);
  const touched = (about) => staged.some((s) => s === about || s.startsWith(about + '/') || (about.startsWith('app/') && s.startsWith(about.replace(/^app\//, 'app/[lang]/') + '/')));
  for (let i = problems.length - 1; i >= 0; i--) if (!touched(problems[i][1])) problems.splice(i, 1);
}
if (problems.length) {
  console.error(`\ni18n check (${mode}): ${problems.length} problem${problems.length > 1 ? 's' : ''}\n` + problems.map(([p]) => '  - ' + p).join('\n') +
    '\n\nEvery page and every copy change ships in all languages: ' + LANGS.join(', ') + '. See "Languages (i18n)" in CLAUDE.md.\n');
  process.exit(1);
}
console.log(`i18n check (${mode}): every page and copy file is in all ${LANGS.length} languages`);
