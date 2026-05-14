// turret oluşturma
export function createTurret(x, y) {
    return {
        x,
        y,
        radius: 25,

        angle: 0,
        fireRate: 60,   // frame
        cooldown: 10,

        range: 350
    };
}

//turretlerin görselleri
export const barrelImg = new Image();
barrelImg.src = "../assets/turret/turret_barrel.png";

export const turretImg = new Image();
turretImg.src = "../assets/turret/turret_body.png";

export function playTurretSound() {
    const audio = new Audio("./assets/sounds/turret.mp3");
    audio.volume = 0.7
    ;
    audio.currentTime = 0;
    audio.play();
}