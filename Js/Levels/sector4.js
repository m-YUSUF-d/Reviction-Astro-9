import * as box from "../Entities/box.js";
import * as door from "../Entities/door.js";
import * as state from "../states.js";

export const sectorObjects = {
    boxes: [],
    doors: []
};

export const tileImg_4 = new Image();
tileImg_4.src = "assets/tiles/tile4.png";


//kutuları oluşturur
function crateBoxes(canvas) {
    sectorObjects.boxes = [
        box.createBox(50, 0, 100, 75),
        box.createBox(150, 0, 100, 75),
        box.createBox(100, 75, 100, 75),
        box.createBox(0, 200, 100, 75),
        box.createBox(100, 200, 100, 75),
        box.createBox(200, 200, 100, 75),
        box.createBox(250, 125, 100, 75),
        box.createBox(300, 50, 100, 75),
        box.createBox(450, 0, 100, 75),
        box.createBox(450, 75, 100, 75),
        box.createBox(400, 200, 100, 75),
        box.createBox(500, 200, 100, 75),
        box.createBox(650, 150, 100, 75),
        box.createBox(650, 225, 100, 75),
        box.createBox(650, 300, 100, 75),
        box.createBox(550, 325, 100, 75),
        box.createBox(450, 400, 100, 75),
        box.createBox(550, 400, 100, 75),
        box.createBox(625, 75, 100, 75),
        box.createBox(625, 0, 100, 75),
        box.createBox(400, 275, 100, 75),
        box.createBox(350, 350, 100, 75),
        box.createBox(250, 325, 100, 75),
        box.createBox(150, 325, 100, 75),
        box.createBox(50, 450, 100, 75),
        box.createBox(150, 450, 100, 75),
        box.createBox(250, 450, 100, 75),
        box.createBox(350, 450, 100, 75),
        box.createBox(0, 575, 100, 75),
        box.createBox(100, 575, 100, 75),
        box.createBox(200, 575, 100, 75),
        box.createBox(550, 475, 100, 75),
        box.createBox(700, 425, 100, 75),
        box.createBox(150, 325, 100, 75),
        box.createBox(0, 325, 100, 75),
    ];
}
//kapıyı oluşturur
function createDoors(canvas) {
    sectorObjects.doors = [door.createDoor(canvas.width - 10, 0, 10, 125)];
}
export function createEntities(canvas) {
    crateBoxes(canvas);
    createDoors(canvas);
}


let timer = 30;
//sektör 4 güncellenir
export function updateSector4(delta) {
    delta = delta || 0;

    timer -= 0.016 * delta; // yaklaşık 60 FPS için
    if (timer < 0) {
        state.killPlayer(true);
        timer = 25;
    }
}


// sektör 4 haritasını çizer
export function drawSector4(ctx) {
    ctx.save();
    // arkaplan
    for (let y = 0; y < 600; y += 120) {
        for (let x = 0; x < 800; x += 120) {
            ctx.drawImage(tileImg_4, x, y, 120, 120);
        }
    }

    //kutular çizilir
    for (let b of sectorObjects.boxes) {
        ctx.drawImage(
            box.boxImg2,
            b.x,
            b.y,
            b.width,
            b.height
        );
    }

    //kapı çizilir
    for (let d of sectorObjects.doors) {
        ctx.drawImage(
            door.doorImg3,
            d.x,
            d.y,
            d.width,
            d.height
        );
    }

    ctx.restore();
}
export function drawLighting(ctx, player_, canvas) {
    const radius = 120;

    // Gradient oluştur
    const gradient = ctx.createRadialGradient(
        player_.x,
        player_.y,
        radius * 0.2,   // iç kısım
        player_.x,
        player_.y,
        radius          // dış kısım
    );

    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgb(0, 0, 0)");

    // Tüm ekranı gradient ile boya
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gradient dışındaki alanı tamamen siyah yap
    ctx.fillStyle = "rgb(0, 0, 0)";

    // üst
    ctx.fillRect(0, 0, canvas.width, player_.y - radius);
    // alt
    ctx.fillRect(0, player_.y + radius, canvas.width, canvas.height);
    // sol
    ctx.fillRect(0, player_.y - radius, player_.x - radius, radius * 2);
    // sağ
    ctx.fillRect(player_.x + radius, player_.y - radius, canvas.width, radius * 2);
}
export function drawTimer(ctx) {
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText(`Time: ${timer.toFixed(2)}s`, 10, 30);
}

