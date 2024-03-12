<script>
    /** @type {{ sights: Sight[], win: boolean }} */
    let { sights, win } = $props();

    import Box from './Box.svelte';

    import { isInSeason } from '$lib/months';
    import { dailyShuffle } from './shuffle';

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

    /** @type {string[][]} */
    let boards = [];

    /** @type {boolean[][]} */
    let boardStates = $state([]);

    function makeNextBoard() {
        boardStates.push(Array(25).fill(false));
        const { value } = generator.next();
        boards.push(value);
    }

    makeNextBoard();

    let board = $derived(boards[boardIndex].slice(0, 25).with(12, 'tree'));
    let boardState = $derived(boardStates[boardIndex]);

    /** @param {number} n */
    function* range(n) {
        for (let i = 0; i < n; i++) {
            yield i;
        }
    }

    /**
     * @param {boolean[]} inputBingoBoard
     * @returns {{win: true, indices: number[]}|{win: false}} boardArray
     */
    function isWinningBingoBoard(inputBingoBoard) {
        let bingoBoard = [...inputBingoBoard].with(12, true);

        for (const row of range(5)) {
            let indices = [...range(5)].map(col => row * 5 + col);

            if (indices.every(i => bingoBoard[i])) {
                return { win: true, indices };
            }
        }

        for (const col of range(5)) {
            let indices = [...range(5)].map(row => row * 5 + col);

            if (indices.every(i => bingoBoard[i])) {
                return { win: true, indices };
            }
        }

        // Main diagonal
        let indices = Array(5)
            .fill(null)
            .map((_, i) => i * 5 + i);
        if (indices.every(i => bingoBoard[i])) return { win: true, indices };

        indices = Array(5)
            .fill(null)
            .map((_, i) => i * 5 + (5 - i - 1));
        if (indices.every(i => bingoBoard[i])) return { win: true, indices };

        return { win: false };
    }

    let boardData = $derived(isWinningBingoBoard(boardState));
    let winningIndexes = $derived(boardData.win ? boardData.indices : []);

    $effect(() => {
        win = boardData.win;
    });

    function previous() {
        if (boardIndex > 0) boardIndex--;
    }

    function next() {
        if (boards.length <= boardIndex + 1) {
            makeNextBoard();
        }

        boardIndex++;
    }
</script>

{#if context}
    <div class="container">
        {#each board as sight, i}
            <Box
                {sight}
                {context}
                winning={winningIndexes.includes(i)}
                bind:selected={boardState[i]}
            />
        {/each}
    </div>

    <nav id="board-controls" class="level is-mobile">
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
        width: 90vw;
        margin: auto;
        max-width: 350px;

        margin-bottom: 1em;

        display: grid;
        grid-template-columns: repeat(5, calc(20% - var(--gap)));
        padding: 0;
        gap: var(--gap);
    }

    button {
        width: 7.5em;
    }
</style>
