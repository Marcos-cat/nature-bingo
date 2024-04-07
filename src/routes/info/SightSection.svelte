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

    let searching = $derived(search !== '');

    let filteredList = $derived(
        searching
            ? sightList.filter(({ sight }) => fuzzySearch(sight))
            : sightList,
    );
</script>

<h2 class="subtitle">
    <span class="icon-text">
        {#if collapsable}
            <button
                class="icon is-clickable has-text-link mr-2"
                onclick={() => (expanded = !expanded)}
                style="background: none; border: none;"
            >
                <i
                    class="fa-solid fa-2x fa-caret-down"
                    class:collapsed={!expanded}
                ></i>
            </button>
        {/if}
        <span>
            <span>
                {@render children()}
            </span>
            <span class="tag">
                {sightList.length}
            </span>
            {#if searching}
                <span class="tag is-link">
                    {filteredList.length}
                </span>
            {/if}
        </span>
    </span>
</h2>

{#if expanded || !collapsable}
    {#if filteredList.length > 0}
        <div class="columns is-mobile is-multiline">
            {#each filteredList as sight}
                <div class="column is-half">
                    <div class="notification" class:is-primary={colored}>
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
    i {
        transition: transform 250ms ease;
    }

    i.collapsed {
        transform: rotate(-90deg);
    }
</style>
