const months = 'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');

/**
 * @param {string} month
 * @returns {number}
 *
 * @throws when `month` is not a month abbreviation
 */
function month(month) {
    const index = months.indexOf(month);
    if (index === -1) throw new Error(`"${month}" is an invalid month`);
    return index;
}

/**
 * @param {string} line
 * @returns {Sight}
 */
function parseSight(line) {
    /** @type {Record<string, Duration>} */
    const specialTimes = {
        all: { start: month('jan'), end: month('dec') },
        summer: { start: month('apr'), end: month('sep') },
        farm: { start: month('may'), end: month('oct') },
    };

    const sight = line.split(':')[0].trim();
    const time = line.split(':')[1].trim();

    if (specialTimes[time] !== undefined) {
        return { sight, duration: specialTimes[time] };
    }

    const [startMonth, endMonth] = time.split('-');

    return {
        sight,
        duration: { start: month(startMonth), end: month(endMonth) },
    };
}

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
    const resp = await fetch('sights.txt');
    const content = await resp.text();
    const lines = content
        .split('\n')
        .map(s => s.trim())
        .filter(s => '' != s);

    const sights = lines.map(parseSight);

    return { sights: sights };
}
