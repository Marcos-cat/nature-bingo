/** @param {string} title */
export function title(title) {
    $effect(() => {
        document.title = title;
    });
}
