<script>
    /** @type {{ sights: Sight[], onWin: (win: boolean) => void }} */
    let { sights, onWin } = $props();

    import Box from './Box.svelte';

    import { isInSeason } from '$lib/months';
    import { dailyShuffle, isWinningBingoBoard } from '$lib/bingo';

    /** @type {CanvasRenderingContext2D|null} */
    let context = $state(null);

    $effect(() => {
        const canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        return () => canvas.remove();
    });

    const currentMonth = new Date().getMonth();

    const inSeasonSights = sights
        .filter(sight => isInSeason(currentMonth, sight))
        .map(({ sight }) => sight);

    let generator = dailyShuffle(inSeasonSights);
    let boardIndex = $state(0);

    /** @type {string[][]} */ let boards = [];
    /** @type {boolean[][]} */ let boardStates = $state([]);

    function makeNextBoard() {
        boardStates.push(Array(25).fill(false));
        boards.push(generator.next().value);
    }

    makeNextBoard();

    let board = $derived(boards[boardIndex].slice(0, 25).with(12, 'tree'));
    let boardState = $derived(boardStates[boardIndex]);

    let boardData = $derived(isWinningBingoBoard(boardState));
    let winningIndexes = $derived(boardData.win ? boardData.indices : []);

    $effect(() => onWin(boardData.win));

    function previous() {
        if (boardIndex > 0) boardIndex--;
    }

    function next() {
        while (boards.length <= boardIndex + 1) makeNextBoard();
        boardIndex++;
    }
</script>

{#if context}
    <div class="container mb-6 p-0">
        {#each board as sight, i}
            <Box
                {sight}
                {context}
                winning={winningIndexes.includes(i)}
                bind:selected={boardState[i]}
            />
        {/each}
    </div>

    <nav class="level is-mobile">
        <div class="level-item">
            <button
                class="button is-primary"
                onclick={previous}
                disabled={boardIndex == 0}
            >
                <span class="icon">
                    <i class="fa-solid fa-chevron-left"></i>
                </span>
                <span>Previous</span>
            </button>
        </div>

        <div class="level-item">
            <span id="board-counter" class="tag is-large">
                {boardIndex + 1}
            </span>
        </div>

        <div class="level-item">
            <button class="button is-primary" onclick={next}>
                <span>Next</span>
                <span class="icon">
                    <i class="fa-solid fa-chevron-right"></i>
                </span>
            </button>
        </div>
    </nav>
{/if}

<style>
    div.container {
        --gap: 4px;
        max-width: 20rem;

        display: grid;
        grid-template-columns: repeat(5, calc(20% - var(--gap)));
        gap: var(--gap);
    }

    button {
        width: 7.5em;
    }
</style>
