<script>
    /** @type {{
        sightList: Sight[],
        search: string,
        children: import('svelte').Snippet,
        showsInfo?: boolean,
        colored?: boolean,
        collapsable?: boolean,
    }} */
    let {
        sightList,
        showsInfo = false,
        colored = false,
        collapsable = true,
        search,
        children,
    } = $props();

    import { toMonthName } from '$lib/months';

    let expanded = $state(true);

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

    let filteredList = $derived(
        search === ''
            ? sightList
            : sightList.filter(({ sight }) => fuzzySearch(sight)),
    );
</script>

<nav class="level">
    <div class="level-left">
        {#if collapsable}
            <button onclick={() => (expanded = !expanded)}>
                <span class="icon">
                    <i
                        class="fa-solid fa-2x"
                        class:fa-caret-down={expanded}
                        class:fa-caret-right={!expanded}
                    ></i>
                </span>
            </button>
        {/if}
        <h2 class="subtitle">{@render children()}</h2>
    </div>
</nav>

{#if expanded || !collapsable}
    {#if filteredList.length > 0}
        <div class="columns is-mobile is-multiline">
            {#each filteredList as sight}
                <div class="column is-half">
                    <div
                        class="notification is-light"
                        class:is-primary={colored}
                    >
                        <h2 class="has-text-weight-bold is-capitalized">
                            {sight.sight}
                        </h2>
                        {#if showsInfo}
                            {@const { start, end } = sight.duration}
                            <p class="subtitle is-6">
                                In season from {toMonthName(start)}
                                to {toMonthName(end)}
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
{/if}

<style>
    button {
        background: none;
        border: none;
        width: fit-content;
        height: fit-content;
    }
</style>
