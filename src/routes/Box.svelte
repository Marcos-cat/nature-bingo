<script>
    /** @type {{ 
        sight: string, 
        selected?: boolean, 
        context: CanvasRenderingContext2D 
    }} */

    let { sight, selected, context } = $props();

    let isTree = $derived(sight == 'tree');

    const COLOR = 'primary';

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

<button
    disabled={isTree}
    bind:this={button}
    class={`box ${selected || isTree ? `has-background-${COLOR}-light has-text-${COLOR}` : ''}`}
    onclick={() => (selected = !selected)}
>
    {shortenedSight}
</button>

<style>
    button.box {
        overflow: hidden;

        background: none;
        padding: 2px;
        margin: 0;
        aspect-ratio: 1;
        display: flex;
        border: none;

        align-items: center;
        justify-content: center;

        border-radius: 0;
    }

    p {
        width: fit-content;
        height: fit-content;
        margin: 0;

        font-size: 1em;
        line-height: 1.25em;
        text-align: center;
    }
</style>
