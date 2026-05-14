import *as state from "../states.js";
import * as door from "./door.js"

export const player = {
    x: 0,
    y: 0,
    size: 20,

    velocityX: 0,
    velocityY: 0,

    acceleration: 0.4,
    friction: 0.9,
    maxSpeed: 15,

    angle: 0,
};


const idleImg = new Image();
const walkImg1 = new Image();
const walkImg2 = new Image();
idleImg.src = "assets/player/idle.png";
walkImg1.src = "assets/player/walk1.png";
walkImg2.src = "assets/player/walk2.png";

//animasyon kareleri
const walkFrames = [walkImg1, walkImg2];
let currentFrame = 0;
let animationTimer = 0;
let animationSpeed = 10;
let isMoving = false;


//oyuncuyu günceller
export function updatePlayer(keys, canvas, objects, delta) {
    if (keys["w"] || keys["arrowup"]) player.velocityY -= player.acceleration * delta;
    if (keys["s"] || keys["arrowdown"]) player.velocityY += player.acceleration * delta;
    if (keys["a"] || keys["arrowleft"]) player.velocityX -= player.acceleration;
    if (keys["d"] || keys["arrowright"]) player.velocityX += player.acceleration;

    //animasyon kontrolü
    isMoving =
        keys["w"] || keys["arrowup"] ||
        keys["a"] || keys["arrowleft"] ||
        keys["s"] || keys["arrowdown"] ||
        keys["d"] || keys["arrowright"];

    if (isMoving) {
        animationTimer++;
        if (animationTimer >= animationSpeed) {
            animationTimer = 0;
            currentFrame++;
            if (currentFrame >= walkFrames.length) {
                currentFrame = 0;
            }
        }
    } else {
        currentFrame = 0;
    }

    // speed clamp
    player.velocityX = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.velocityX));
    player.velocityY = Math.max(-player.maxSpeed, Math.min(player.maxSpeed, player.velocityY));


    // friction
    player.velocityX *= player.friction;
    player.velocityY *= player.friction;


    // hareket ve çarpışma kontrolü
    player.x += player.velocityX;
    for (let box of objects.boxes) {
        if (
            player.x < box.x + box.width + player.size &&
            player.x + player.size > box.x &&
            player.y < box.y + box.height + player.size &&
            player.y + player.size > box.y
        ) {
            player.x -= player.velocityX;
        }
    }
    player.y += player.velocityY;
    for (let box of objects.boxes) {
        if (
            player.x < box.x + box.width + player.size &&
            player.x + player.size > box.x &&
            player.y < box.y + box.height + player.size &&
            player.y + player.size > box.y
        ) {
            player.y -= player.velocityY;
        }
    }
    //kapıya çarparsa sonraki bölüme geçer
    for (let d of objects.doors) {
        if (
            player.x < d.x + d.width + player.size &&
            player.x + player.size > d.x &&
            player.y < d.y + d.height + player.size &&
            player.y + player.size > d.y
        ) {
            door.playDoorSound();
            state.completeState(true);
            break;
        }
    }


    // bounds
    player.x = Math.max(player.size, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(player.size, Math.min(canvas.height - player.size, player.y));
}


//oyuncuyu çizer
export function drawPlayer(ctx) {

    ctx.save();
    ctx.translate(player.x, player.y);

    //karakterin hareket yönüne göre döndürme
    if (player.velocityX !== 0 || player.velocityY !== 0) {
        player.angle = Math.atan2(player.velocityY, player.velocityX);
    }
    ctx.rotate(player.angle);

    //animsyonları çizer
    if (isMoving) {
        ctx.drawImage(
            walkFrames[currentFrame],
            -32,
            -32,
            64,
            64
        );
    } else {
        ctx.drawImage(
            idleImg,
            -32,
            -32,
            64,
            64
        );
    }

    ctx.restore();
}


//oyuncunun konumunu resteler
export function resetPlayer(canvas) {
    player.x = 0;
    player.y = 0;

    player.velocityX = 0;
    player.velocityY = 0;
    player.angle = 0;

    state.killPlayer(false);
    state.completeState(false);
}