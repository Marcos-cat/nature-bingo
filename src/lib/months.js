const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const monthAbbreviations =
    'jan feb mar apr may jun jul aug sep oct nov dec'.split(' ');

/** @param {string} month */
export function fromMonthAbbreviation(month) {
    let index = monthAbbreviations.indexOf(month.trim());

    return index !== -1 ? index : null;
}

/** @param {number} month */
export function toMonthName(month) {
    return monthNames[month];
}

/**
 * @param {number} currentMonth
 * @param {Sight} sight
 */
export function isInSeason(currentMonth, { duration: { start, end } }) {
    if (start < end) return start <= currentMonth && currentMonth <= end;
    return start <= currentMonth || currentMonth <= end;
}

/** @param {Sight} sight */
export function isAlwaysInSeason({ duration: { start, end } }) {
    return start === 0 && end === 11;
}
