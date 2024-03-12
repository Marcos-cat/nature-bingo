<script>
    let { children, data } = $props();
    let { route } = $derived(data);
    import { base } from '$app/paths';

    let isHome = $derived(route.id == '/');
</script>

<nav class="level is-mobile p-2">
    <div class="level-left">
        <div class="level-item">
            <a class="has-text-dark" href={base + (isHome ? '/info' : '/')}>
                <span class="icon is-medium m-16">
                    <i
                        class="fa-solid fa-2x"
                        class:fa-bars={isHome}
                        class:fa-home={!isHome}
                    ></i>
                </span>
            </a>
        </div>
    </div>

    <div class="level-right">
        <div class="level-item">
            <span class="tag is-medium">
                <span class="icon">
                    <i class="fa-solid fa-calendar"></i>
                </span>
                <span>
                    {(function getDate() {
                        const now = new Date();
                        const month = now.getMonth() + 1;
                        const day = now.getDate();
                        const year = now.getFullYear().toString().slice(-2);
                        return `${month}/${day}/${year}`;
                    })()}
                </span>
            </span>
        </div>
    </div>
</nav>

{@render children()}
