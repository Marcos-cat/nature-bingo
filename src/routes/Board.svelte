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

    /** @param {number} newBoardIndex */
    function generateNecessaryBoards(newBoardIndex) {
        while (boards.length <= newBoardIndex) makeNextBoard();
    }

    generateNecessaryBoards(0);

    let board = $derived(boards[boardIndex].slice(0, 25).with(12, 'tree'));
    let boardState = $derived(boardStates[boardIndex]);

    let boardData = $derived(isWinningBingoBoard(boardState));
    let winningIndexes = $derived(boardData.win ? boardData.indices : []);

    $effect(() => onWin(boardData.win));

    function previous() {
        if (boardIndex > 0) boardIndex--;
    }

    function next() {
        generateNecessaryBoards(boardIndex + 1);
        boardIndex++;
    }
</script>

{#if context}
    <div class="fixed-grid has-5-cols mb-6">
        <div class="grid is-gap-0.5">
            {#each board as sight, i}
                <Box
                    {sight}
                    {context}
                    winning={winningIndexes.includes(i)}
                    bind:selected={boardState[i]}
                />
            {/each}
        </div>
    </div>

    <nav class="field is-grouped is-grouped-centered">
        <div class="control">
            <button
                class="button is-link"
                onclick={previous}
                disabled={boardIndex == 0}
            >
                <span class="icon">
                    <i class="fa-solid fa-chevron-left"></i>
                </span>
                <span>Previous</span>
            </button>
        </div>

        <div class="control">
            <span class="tag is-large">{boardIndex + 1}</span>
        </div>

        <div class="control">
            <button class="button is-link" onclick={next}>
                <span>Next</span>
                <span class="icon">
                    <i class="fa-solid fa-chevron-right"></i>
                </span>
            </button>
        </div>
    </nav>
{/if}

<style>
    div.grid {
        max-width: 25rem;
        margin: auto;
    }

    button {
        width: 7.5em;
    }
</style>
