<script>
    const { data } = $props();
    const { sights } = data;

    import SightSection from './SightSection.svelte';

    import { isInSeason, isAlwaysInSeason } from '$lib/months';
    import { title } from '$lib/title.svelte';

    title('Info | Nature Bingo');

    let search = $state('');

    const currentMonth = new Date().getMonth();

    const ALWAYS = 0;
    const IN_SEASON = 1;
    const NOT_IN_SEASON = 2;

    const [alwaysInSeasonSights, inSeasonSights, notInSeasonSights] =
        sights.reduce(
            (/** @type {Sight[][]} */ acc, sight) => {
                if (isAlwaysInSeason(sight)) {
                    acc[ALWAYS].push(sight);
                    return acc;
                }

                if (isInSeason(currentMonth, sight)) {
                    acc[IN_SEASON].push(sight);
                    return acc;
                }

                acc[NOT_IN_SEASON].push(sight);
                return acc;
            },
            [[], [], []],
        );
</script>

<section class="section">
    <h1 class="title is-spaced">Nature Bingo</h1>

    <div class="block">
        <div class="control has-icons-left">
            <input class="input" bind:value={search} type="text" />
            <span class="icon is-left">
                <i class="fa-solid fa-magnifying-glass"></i>
            </span>
        </div>
    </div>

    <SightSection sightList={inSeasonSights} {search} colored showsInfo>
        Currently In Season
    </SightSection>

    <SightSection sightList={notInSeasonSights} {search} showsInfo>
        Not In Season
    </SightSection>

    <SightSection sightList={alwaysInSeasonSights} {search} colored>
        Always In Season
    </SightSection>
</section>
