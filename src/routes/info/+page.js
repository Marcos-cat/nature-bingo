/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
    const { sights } = await parent();

    return { sights };
}
