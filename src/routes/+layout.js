export const prerender = true;
export const trailingSlash = 'always';

import { fromMonthAbbreviation } from '$lib/months';

/**
 * @param {string} monthAbbreviation
 * @returns {number}
 *
 * @throws when `month` is not a month abbreviation
 */
function month(monthAbbreviation) {
    const month = fromMonthAbbreviation(monthAbbreviation);

    if (month === null) {
        throw new Error('Invalid month abbreviation: ' + monthAbbreviation);
    }

    return month;
}

/**
 * @param {string} line
 * @returns {Sight}
 */
function parseSight(line) {
    /** @type {Record<string, {start: number, end: number}>} */
    const specialTimes = {
        all: { start: month('jan'), end: month('dec') },
        summer: { start: month('apr'), end: month('sep') },
        farm: { start: month('may'), end: month('oct') },
    };

    let [sight, time] = line.split(':').map(s => s.trim());

    if (specialTimes[time] !== undefined) {
        return { sight, duration: specialTimes[time] };
    }

    const [startMonth, endMonth] = time.split('-');

    return {
        sight,
        duration: { start: month(startMonth), end: month(endMonth) },
    };
}

/** @type {import('./$types').LayoutLoad} */
export async function load({ fetch, route }) {
    const resp = await fetch('/sights.txt');
    const content = await resp.text();
    const lines = content
        .split('\n')
        .map(s => s.trim())
        .filter(s => '' != s);

    const sights = lines.map(parseSight);

    return { sights, route };
}
