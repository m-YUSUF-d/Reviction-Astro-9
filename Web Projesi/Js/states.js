export let isPlayerDead = false;
export let isStateComplete = false;
export let isStoryTyping = false;

export function killPlayer(dead) {
    isPlayerDead = dead;
}
export function completeState(complete) {
    isStateComplete = complete;
}
