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
 * @param {number} seed
 * @returns {Generator<number, never>}
 */
function* seededRandom(seed) {
    while (true) {
        seed = xorShift(seed);
        yield Math.abs(seed % 10000) / 10000;
    }
}

/**
 * @param {readonly string[]} sights
 * @returns {Generator<string[], never>}
 */
export function* dailyShuffle(sights) {
    let gen = seededRandom(daysSinceNewYear());

    while (true) {
        let sightsCopy = [...sights];

        for (let i = sightsCopy.length - 1; i > 0; i--) {
            const { value } = gen.next();
            const j = Math.floor(value * (i + 1));
            [sightsCopy[i], sightsCopy[j]] = [sightsCopy[j], sightsCopy[i]];
        }

        yield sightsCopy;
    }
}
