import * as box from "../Entities/box.js";
import * as door from "../Entities/door.js";
import * as key from "../Entities/key.js";
import * as state from "../states.js";


export const sectorObjects = {
    boxes: [],
    keys: [],
    doors: []
};

export const tileImg_2 = new Image();
tileImg_2.src = "assets/tiles/tile2.png";

export let temperature = 25;
export function setTemperature(temp) {
    temperature = temp;
}


//anahtarları oluşturur
function createKeys(canvas) {
    sectorObjects.keys = [
        key.createKey(210, canvas.height / 2 - 115, 60, 60),
        key.createKey(625, 10, 60, 60),
        key.createKey(525, canvas.height / 2 + 95, 60, 60)
    ];
}
//kutuları oluşturur
function crateBoxes(canvas) {

    sectorObjects.boxes = [
        box.createBox(0, canvas.height / 2 - 125, 100, 75),
        box.createBox(0, canvas.height / 2 - 50, 100, 75),

        box.createBox(100, canvas.height / 2 - 50, 100, 75),
        box.createBox(100, canvas.height / 2 - 125, 100, 75),
        box.createBox(100, canvas.height / 2 + 25, 100, 75),
        box.createBox(100, canvas.height / 2 + 100, 100, 75),
        box.createBox(150, canvas.height / 2 + 225, 100, 75),

        box.createBox(200, canvas.height / 2 + 100, 100, 75),

        box.createBox(150, 0, 100, 75),
        box.createBox(250, 50, 100, 75),
        box.createBox(500, 0, 100, 75),
        box.createBox(700, 0, 100, 75),

        box.createBox(275, canvas.height / 2 + 25, 100, 75),
        box.createBox(375, canvas.height / 2 - 125, 100, 75),


        box.createBox(200, canvas.height / 2 - 50, 100, 75),
        box.createBox(275, canvas.height / 2 - 125, 100, 75),

        box.createBox(450, canvas.height / 2 - 50, 100, 75),
        box.createBox(450, canvas.height / 2 + 25, 100, 75),
        box.createBox(550, canvas.height / 2 + 25, 100, 75),

        box.createBox(600, 200, 100, 75),
        box.createBox(600, 125, 100, 75),

        box.createBox(canvas.width - 100, canvas.height - 75, 100, 75),
        box.createBox(canvas.width - 200, canvas.height - 75, 100, 75),
        box.createBox(canvas.width - 200, canvas.height - 150, 100, 75),
        box.createBox(canvas.width - 300, canvas.height - 150, 100, 75),
        box.createBox(canvas.width - 400, canvas.height - 150, 100, 75),
        box.createBox(canvas.width - 400, canvas.height - 75, 100, 75),
    ];
    sectorObjects.boxes.push(box.createBox(165, canvas.height - 125, 75, 50));
    sectorObjects.boxes.push(box.createBox(600, canvas.height / 2 + 100, 75, 50));
    sectorObjects.boxes.push(box.createBox(550, canvas.height / 2 - 225, 75, 50));
}
//kapıyı oluşturur
function createDoors(canvas) {
    sectorObjects.doors = [door.createDoor(0, canvas.height - 125, 10, 125)];
}
export function createEntities(canvas) {
    createKeys(canvas);
    crateBoxes(canvas);
    createDoors(canvas);
}


//sektör 2 güncellenir
export function updateSector2(player_, delta) {
    if (temperature < 125) {
        temperature += 0.15 * delta;
    } else {
        state.killPlayer(true);
    }
    for (let k of sectorObjects.keys) {
        if (
            player_.x < k.x + k.width + player_.size &&
            player_.x + player_.size > k.x &&
            player_.y < k.y + k.height + player_.size &&
            player_.y + player_.size > k.y
        ) {
            key.playKeyPickSound();
            sectorObjects.keys.splice(sectorObjects.keys.indexOf(k), 1);
            sectorObjects.boxes.pop();
            temperature = Math.max(0, temperature - 7.5);
        }
    }

}


// sektör 2 haritasını çizer
export function drawSector2(ctx, canvas) {
    // arkaplan
    for (let y = 0; y < 600; y += 120) {
        for (let x = 0; x < 800; x += 120) {
            ctx.drawImage(tileImg_2, x, y, 120, 120);
        }
    }

    //keyler çizilir
    for (let k of sectorObjects.keys) {
        ctx.drawImage(
            key.keyImg,
            k.x,
            k.y,
            k.width,
            k.height
        );
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
            door.doorImg2,
            d.x,
            d.y,
            d.width,
            d.height
        );
    }
    // sıcaklık çizilir
    ctx.fillStyle = "red";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";

    ctx.fillText(
        "Temperature: " + Math.floor(temperature) + "(Danger>125)",
        20,
        40
    );
}
