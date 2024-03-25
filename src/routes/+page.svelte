<script>
    import { title } from '$lib/title.svelte';
    import Board from './Board.svelte';

    const { data } = $props();
    const { sights } = data;

    title('Nature Bingo');

    let isWinning = $state(false);
</script>

{#snippet winStar()}
    {#if isWinning}
        <span class="icon is-medium has-text-primary">
            <i class="fa-solid fa-star"></i>
        </span>
    {/if}
{/snippet}

<h1 class="title has-text-centered">
    {@render winStar()}
    <span class:has-text-primary={isWinning}>Nature Bingo</span>
    {@render winStar()}
</h1>

<Board {sights} onWin={win => (isWinning = win)} />
