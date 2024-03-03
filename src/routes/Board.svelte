<script>
    import Box from './Box.svelte';
    import { dailyShuffle } from './shuffle';

    /** @type {{ sights: string[], win: boolean }} */
    let { sights, win } = $props();

    /** @type {CanvasRenderingContext2D|null} */
    let context = $state(null);

    $effect(() => {
        const canvas = document.createElement('canvas');
        context = canvas.getContext('2d');

        return () => canvas.remove();
    });

    let generator = dailyShuffle(sights);

    let boardIndex = $state(0);

    /** @type {string[][]} */
    let boards = [];

    /** @type {boolean[][]} */
    let boardStates = $state([]);

    function makeNextBoard() {
        boardStates.push(Array(25).fill(false));
        boards.push(generator.curr);
        generator = generator.next();
    }

    makeNextBoard();

    let board = $derived(boards[boardIndex].slice(0, 25).with(12, 'tree'));
    let boardState = $derived(boardStates[boardIndex]);

    /** @param {boolean[]} boardArray */
    function isWinningBingoBoard(boardArray) {
        let board = [];
        for (let i = 0; i < boardArray.length; i += 5) {
            let row = boardArray.slice(i, i + 5);
            board.push(row);
        }

        board[2][2] = true;

        for (let row = 0; row < board.length; row++) {
            if (board[row].every(val => val)) return true;
        }

        for (let col = 0; col < board[0].length; col++) {
            if (board.every(row => row[col])) return true;
        }

        // prettier-ignore
        if (board[0][0] && board[1][1] && board[2][2] && board[3][3] && board[4][4]) return true;
        // prettier-ignore
        if (board[0][4] && board[1][3] && board[2][2] && board[3][1] && board[4][0]) return true;

        return false;
    }

    $effect(() => {
        win = isWinningBingoBoard(boardState);
    });

    function previous() {
        boardIndex--;
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
            <Box {sight} {context} bind:selected={boardState[i]} />
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
