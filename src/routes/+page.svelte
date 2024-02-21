<script>
    import Board from './Board.svelte';

    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    const { sights } = data;

    let date = $state('');

    $effect(() => {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const year = now.getFullYear().toString().slice(-2);

        date = `${month}/${day}/${year}`;
    });
</script>

<nav class="level is-mobile">
    <div class="level-left">
        <div class="level-item">
            <span class="tag is-medium">
                <span class="icon">
                    <i class="fa-solid fa-calendar"></i>
                </span>
                <span>
                    {date}
                </span>
            </span>
        </div>
    </div>

    <div class="level-right">
        <div class="level-item">
            <button class="button is-ghost has-text-black">
                <span class="icon is-medium">
                    <i class="fa-solid fa-gear fa-2x"></i>
                </span>
            </button>
        </div>
    </div>
</nav>

<h1 class="title has-text-centered">Nature Bingo</h1>

<Board {sights} />
