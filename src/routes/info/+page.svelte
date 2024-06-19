<script>
    const { data } = $props();
    const { sights } = data;

    import SightSection from './SightSection.svelte';

    import { title } from '$lib/title.svelte';

    title('Info | Nature Bingo');

    let search = $state('');

    const currentMonth = new Date().getMonth();

    const { alwaysInSeason, inSeason, notInSeason } = Object.groupBy(
        sights,
        (sight, _) => {
            if (sight.isAlwaysInSeason) return 'alwaysInSeason';
            if (sight.isInSeason(currentMonth)) return 'inSeason';
            return 'notInSeason';
        },
    );
</script>


<h1 class="title is-spaced has-text-centered">Nature Bingo</h1>

<div class="block">
    <div class="control has-icons-left">
        <input class="input" bind:value={search} type="text" />
        <span class="icon is-left">
            <i class="fa-solid fa-magnifying-glass"></i>
        </span>
    </div>
</div>

<SightSection sightList={inSeason ?? []} {search} colored showsInfo>
    Currently In Season
</SightSection>

<SightSection sightList={notInSeason ?? []} {search} showsInfo>
    Not In Season
</SightSection>

<SightSection sightList={alwaysInSeason ?? []} {search} colored>
    Always In Season
</SightSection>
