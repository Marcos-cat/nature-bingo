export const prerender = true;
export const trailingSlash = 'always';

import { Sight } from '$lib/months';

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch }) {
    const resp = await fetch('/sights.txt');
    const content = await resp.text();
    const lines = content
        .split('\n')
        .map(s => s.trim())
        .filter(s => '' != s);

    const sights = lines.map(Sight.parseSight);

    return { sights };
}
