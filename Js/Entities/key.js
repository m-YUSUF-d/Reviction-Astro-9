//anahtar oluşturma
export function createKey(x, y, width, height) {
    return {
        x,
        y,
        width,
        height
    };
}
export const keyImg = new Image();
keyImg.src = "assets/objects/data_drive.png";

export function playKeyPickSound() {
    const audio = new Audio("assets/sounds/driver.mp3");
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play();
}