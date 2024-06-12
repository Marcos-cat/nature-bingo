<script>
    /** @type {{ 
        sight: string, 
        selected?: boolean, 
        winning: boolean,
        context: CanvasRenderingContext2D 
    }} */
    let { winning, sight, selected = $bindable(), context } = $props();

    let isTree = $derived(sight == 'tree');

    /** @type {HTMLButtonElement|null} */
    let button = $state(null);

    /** @param {string} text @param {string} font */
    function textWidth(text, font) {
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }

    /** @param {string} sight */
    function shortenSight(sight) {
        if (isTree) return sight;
        if (!button) return '';
        const { font } = getComputedStyle(button);
        const { width, borderWidth } = getComputedStyle(button);
        const boxWidth = parseFloat(width) - 2 * parseFloat(borderWidth);

        const words = sight.split(' ');
        const shortenedSight = words
            .map(word => {
                let shortenedWord = word;
                while (textWidth(shortenedWord, font) > boxWidth) {
                    word = word.slice(0, word.length - 1);
                    if (word === '') return '...';
                    shortenedWord = word + '-';
                }

                return shortenedWord;
            })
            .join(' ');

        return shortenedSight;
    }

    let shortenedSight = $state(sight);

    $effect(() => {
        shortenedSight = shortenSight(sight);
    });
</script>

<div class="cell">
    <button
        disabled={isTree}
        bind:this={button}
        class="box is-clickable is-size-7 m-0 p-0"
        class:winning
        class:has-text-weight-bold={winning}
        class:has-background-primary={selected || isTree}
        class:has-text-dark={selected || isTree}
        onclick={() => (selected = !selected)}
    >
        {shortenedSight}
    </button>
</div>

<style>
    @keyframes bounce {
        50% {
            transform: scale(1.1);
        }
    }

    button.winning {
        animation: bounce 1s ease forwards;
        font-weight: bold;
    }

    button.box {
        overflow: hidden;
        aspect-ratio: 1;

        align-items: center;
        justify-content: center;

        width: 100%;
    }

    @media only screen and (max-width: 650px) {
        button.box {
            width: 17vw;
        }
    }
</style>
