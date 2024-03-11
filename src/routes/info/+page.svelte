<script>
    const { data } = $props();
    const { sights } = data;

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

    let search = $state('');

    const currentMonth = new Date().getMonth();

    /** @param {Sight} arg1 */
    function isVisible({ duration: { start, end } }) {
        return start <= currentMonth && currentMonth <= end;
    }

    /** @param {Sight} arg1 */
    function isAlwaysInSeason({ duration: { start, end } }) {
        return start === 0 && end === 11;
    }

    const ALWAYS = 0;
    const IN_SEASON = 1;
    const NOT_IN_SEASON = 2;

    const [alwaysInSeasonSights, inSeasonSights, notInSeasonSights] =
        sights.reduce(
            (/** @type {Sight[][]} */ acc, sight) => {
                if (isAlwaysInSeason(sight)) {
                    acc[ALWAYS].push(sight);
                    return acc;
                }
                if (isVisible(sight)) {
                    acc[IN_SEASON].push(sight);
                    return acc;
                }

                acc[NOT_IN_SEASON].push(sight);
                return acc;
            },
            [[], [], []],
        );

    /** @param {string} s */
    function removeWhitespace(s) {
        return s
            .toLowerCase()
            .split('')
            .filter(c => c !== ' ')
            .join('');
    }

    /** @param {string} term */
    function fuzzySearch(term) {
        return removeWhitespace(term).includes(removeWhitespace(search));
    }
</script>

{#snippet section({ title, sightList, info=false, color='' })}
    <h2 class="subtitle">{title}</h2>

    {@const filteredList = sightList.filter((/**@type{Sight}*/ { sight }) =>
        fuzzySearch(sight),
    )}

    {#if filteredList.length > 0}
        <div class="columns is-mobile is-multiline">
            {#each filteredList as sight}
                <div class="column is-half">
                    <div class={`notification is-light ${color}`}>
                        <p class="has-text-weight-bold is-capitalized">
                            {sight.sight}
                        </p>
                        {#if info}
                            {@const { start, end } = sight.duration}
                            <p class="subtitle is-6">
                                In season from {monthNames[start]}
                                to {monthNames[end]}
                            </p>
                        {/if}
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="block">
            <span class="icon">
                <i class="fa-solid fa-x"></i>
            </span>
            <span>No matches found</span>
        </div>
    {/if}
{/snippet}

<div class="container">
    <h1 class="title is-spaced">Nature Bingo</h1>

    <div class="block">
        <div class="control has-icons-left">
            <input class="input" bind:value={search} type="text" />
            <span class="icon is-left">
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>
        </div>
    </div>

    {@render section({
        title: 'Currently In Season',
        sightList: inSeasonSights,
        info: true,
        color: 'is-primary',
    })}

    {@render section({
        title: 'Not In Season',
        sightList: notInSeasonSights,
        info: true,
    })}

    {@render section({
        title: 'Always In Season',
        sightList: alwaysInSeasonSights,
        color: 'is-primary',
    })}
</div>
