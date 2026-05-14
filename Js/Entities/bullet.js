//mermi oluşturma
export function createBullet(x, y, angle) {
    const speed = 9;
    return {
        x,
        y,
        radius: 5,

        velocityX: Math.cos(angle) * speed,
        velocityY: Math.sin(angle) * speed
    };
}
export const bulletImg = new Image();
bulletImg.src = "../assets/turret/turret_bullet.png";

export function playBlastSound() {
    const audio = new Audio("./assets/sounds/blast.mp3");
    audio.volume = 1;
    audio.currentTime = 0;
    audio.play();
}