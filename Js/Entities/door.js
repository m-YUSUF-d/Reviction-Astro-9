//kapı oluşturma
export function createDoor(x, y, width, height) {
    return {
        x,
        y,
        width,
        height
    };
}
export const doorImg = new Image();
export const doorImg2 = new Image();
export const doorImg3 = new Image();
export const doorImg4 = new Image();
doorImg.src = "assets/doors/door_1.png";
doorImg2.src = "assets/doors/door_2.png";
doorImg3.src = "assets/doors/door_3.png";
doorImg4.src = "assets/doors/door_4.png";

export function playDoorSound() {
    const audio = new Audio("assets/sounds/door.mp3");
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play();
}