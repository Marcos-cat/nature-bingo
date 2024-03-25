<script>
    let { children } = $props();
    import { base } from '$app/paths';

    let menuActive = $state(false);

    const links = [
        { title: 'Home', icon: 'home', href: '' },
        { title: 'Info', icon: 'circle-info', href: 'info' },
    ];

    function getDate() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const year = now.getFullYear().toString().slice(-2);
        return `${month}/${day}/${year}`;
    }
</script>

<nav class="navbar">
    <div class="navbar-brand">
        <a class="navbar-item" href="{base}/">
            <img src="{base}/favicon.svg" alt="Leaf Logo" />
        </a>
        <div class="navbar-item">
            <span class="tag is-medium">
                <span class="icon">
                    <i class="fa-solid fa-calendar"></i>
                </span>
                <span>{getDate()}</span>
            </span>
        </div>

        <button
            class="navbar-burger"
            onclick={() => (menuActive = !menuActive)}
            style="background: none; border: none;"
        >
            <div class="icon">
                <i class="fa-solid fa-2x fa-bars"></i>
            </div>
        </button>
    </div>

    <div class="navbar-menu" class:is-active={menuActive}>
        <div class="navbar-end">
            {#each links as { title, icon, href }}
                <a class="navbar-item" href="{base}/{href}">
                    <span class="icon-text">
                        <span class="icon">
                            <i class="fa-solid fa-{icon}"></i>
                        </span>
                        <span>{title}</span>
                    </span>
                </a>
            {/each}
        </div>
    </div>
</nav>

<main class="section">
    {@render children()}
</main>
