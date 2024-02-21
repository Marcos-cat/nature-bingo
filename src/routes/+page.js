/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const resp = await fetch('sights.txt');
    const content = await resp.text();
    const sights = content
        .split('\n')
        .map(s => s.trim())
        .filter(s => '' != s);

    return { sights };
}
