function daysSinceNewYear() {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diffInTime = now.getTime() - startOfYear.getTime();
    const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));
    return diffInDays;
}

/** @param {number} n */
function xorShift(n) {
    n ^= n << 13;
    n ^= n >> 17;
    n ^= n << 5;
    return n;
}

/**
 * @template T
 * @typedef {{curr: T, next: () => Gen<T>}} Gen
 */

/**
 * @param {number} seed
 * @returns {Gen<number>}
 */
function seededRandom(seed) {
    const number = xorShift(seed);

    return {
        curr: Math.abs(number % 10000) / 10000,
        next: () => seededRandom(number),
    };
}

/**
 * Takes an array and returns the same array in a random order without modifying
 * the original array
 * @param {readonly string[]} sights
 * @param {Gen<number>} [seed]
 * @returns {Gen<string[]>}
 */
export function dailyShuffle(sights, seed) {
    if (!seed) seed = seededRandom(daysSinceNewYear());
    let sights_copy = [...sights];

    for (let i = sights_copy.length - 1; i > 0; i--) {
        seed = seed.next();
        const j = Math.floor(seed.curr * (i + 1));
        [sights_copy[i], sights_copy[j]] = [sights_copy[j], sights_copy[i]];
    }

    return { curr: sights_copy, next: () => dailyShuffle(sights, seed) };
}
