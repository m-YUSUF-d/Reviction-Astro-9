export let isPlayerDead = false;
export let isStateComplete = false;

export function killPlayer(dead) {
    isPlayerDead = dead;
}
export function completeState(complete) {
    isStateComplete = complete;
}
