// AudioManager.js

const audioCache = new Map();

/**
 * @param {string} src - ses dosyasının yolu
 */
export let volume = 1.0;
export function sound(clip) {
    let baseAudio;

    // cache kontrol
    if (audioCache.has(clip.src)) {
        baseAudio = audioCache.get(clip.src);
    } else {
        baseAudio = clip;
        audioCache.set(clip.src, baseAudio);
    }

    // HER ZAMAN clone kullan (kritik nokta)
    const audio = baseAudio.cloneNode();

    audio.volume = volume;
    audio.currentTime = 0;
}