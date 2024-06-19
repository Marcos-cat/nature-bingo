/**
 * @param {number} n
 * @param {number} min
 * @param {number} max
 */
function isBetween(n, min, max) {
    return min <= n && n <= max;
}

export class Month {
    #monthIndex = 0;

    /**
     * @param {string|number} month
     * @throws when `month` is not a month abbreviation or valid index
     */
    constructor(month) {
        if (typeof month === 'string') {
            const index = Month.#fromMonthAbbreviation(month);
            if (index === null) {
                throw new Error(`${month} is an invalid month abbreviation`);
            }
            this.#monthIndex = index;
        } else {
            if (!isBetween(month, 0, 11)) {
                throw new Error(`${month} is an invalid month index`);
            }
            this.#monthIndex = month;
        }
    }

    static #monthNames = Object.freeze([
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
    ]);

    static get monthNames() {
        return this.#monthNames;
    }

    static #monthAbbreviations = Object.freeze(
        this.monthNames.map(month => month.slice(0, 3).toLowerCase()),
    );

    static get monthAbbreviations() {
        return this.#monthAbbreviations;
    }

    /** @param {number} month */
    static toMonthName(month) {
        return this.monthNames[month];
    }

    /** @param {string} month */
    static #fromMonthAbbreviation(month) {
        let index = this.monthAbbreviations.indexOf(month.trim());
        return index !== -1 ? index : null;
    }

    get index() {
        return this.#monthIndex;
    }

    get name() {
        return Month.monthNames[this.index];
    }

    toString() {
        return this.name;
    }
}

class Duration {
    /** @param {{ start: Month, end: Month }} argument */
    constructor({ start, end }) {
        this.start = start;
        this.end = end;
    }

    /** @param {string|number} start @param {string|number} end */
    static fromMonths(start, end) {
        return new Duration({
            start: new Month(start),
            end: new Month(end),
        });
    }

    get isAllYear() {
        return this.start.index === 0 && this.end.index == 11;
    }

    /** @type {Readonly<Partial<Record<string, Duration>>>} */
    static #specialTimes = Object.freeze({
        all: Duration.fromMonths('jan', 'dec'),
        summer: Duration.fromMonths('apr', 'sep'),
        farm: Duration.fromMonths('may', 'oct'),
    });

    static get specialTimes() {
        return Duration.#specialTimes;
    }
}

export class Sight {
    /** @param {{ sight: string, duration: Duration }} argument */
    constructor({ sight, duration }) {
        this.sight = sight;
        this.duration = duration;
    }

    get isAlwaysInSeason() {
        return this.duration.isAllYear;
    }

    /** @param {string} line */
    static parseSight(line) {
        const [sight, time] = line.split(': ');

        const specialTime = Duration.specialTimes[time];
        if (specialTime) {
            return new Sight({ sight, duration: specialTime });
        }

        const [startMonth, endMonth] = time.split('-');
        const duration = Duration.fromMonths(startMonth, endMonth);

        return new Sight({ sight, duration });
    }

    /** @param {number} currentMonth */
    isInSeason(currentMonth) {
        const { start, end } = this.duration;
        return start.index < end.index
            ? isBetween(currentMonth, start.index, end.index)
            : start.index <= currentMonth || currentMonth <= end.index;
    }
}
