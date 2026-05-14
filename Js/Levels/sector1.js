import * as turret from "../Entities/turret.js";
import * as box from "../Entities/box.js";
import * as bullet from "../Entities/bullet.js";
import * as blast from "../Entities/blast.js";
import * as door from "../Entities/door.js";
import * as player from "../Entities/player.js";
import * as state from "../states.js";

export const sectorObjects = {
    turrets: [],
    boxes: [],
    bullets: [],
    explosions: [],
    doors: []
};

export const tileImg_1 = new Image();
tileImg_1.src = "./assets/tiles/tile1.png";


//mesafeler
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}


//turretleri oluşturur
function initturrets(canvas) {
    sectorObjects.turrets = [
        turret.createTurret(canvas.width / 2, 100),
        turret.createTurret(600, 500)
    ];
}
//kutuları oluşturur
function crateBoxes(canvas) {

    sectorObjects.boxes = [
        box.createBox(0, canvas.height / 2 - 125, 100, 100),
        box.createBox(0, canvas.height / 2 - 25, 100, 100),

        box.createBox(175, 0, 100, 100),
        box.createBox(100, canvas.height / 2 - 50, 100, 100),
        box.createBox(100, canvas.height / 2 + 50, 100, 100),
        box.createBox(275, canvas.height / 2 + 50, 100, 100),

        box.createBox(200, canvas.height / 2 - 50, 100, 100),
        box.createBox(450, canvas.height / 2 - 50, 100, 100),
        box.createBox(600, 200, 100, 100),
        box.createBox(canvas.width - 100, canvas.height - 100, 100, 100),
    ];

}
//kapıyı oluşturur
function createDoors(canvas) {
    sectorObjects.doors = [door.createDoor(0, canvas.height - 125, 10, 125)];
}
export function createEntities(canvas) {
    initturrets(canvas);
    crateBoxes(canvas);
    createDoors(canvas);
}


//update turrets
function updateTurrets(player) {

    for (let t of sectorObjects.turrets) {

        const dx = (player.x + player.size / 2) - t.x;
        const dy = (player.y + player.size / 2) - t.y;

        const dist = Math.hypot(dx, dy);

        if (dist < t.range) {
            t.angle = Math.atan2(dy, dx);
        }

        if (t.cooldown > 0) {
            t.cooldown--;
        }

        if (dist < t.range && t.cooldown === 0) {
            turret.playTurretSound();
            sectorObjects.bullets.push(bullet.createBullet(t.x + 4, t.y + 4, t.angle));//mermiler oluşur
            t.cooldown = t.fireRate;
        }
    }
}
//update bullets
function updateBullets(player_, canvas) {
    for (let i = sectorObjects.bullets.length - 1; i >= 0; i--) {

        const b = sectorObjects.bullets[i];

        b.x += b.velocityX;
        b.y += b.velocityY;

        //mermiler kutulara çarparsa patlama olur
        for (let box of sectorObjects.boxes) {
            if (
                b.x < box.x + box.width &&
                b.x + b.radius > box.x &&
                b.y < box.y + box.height &&
                b.y + b.radius > box.y
            ) {
                bullet.playBlastSound();
                sectorObjects.explosions.push(blast.createBlast(b.x, b.y));
                sectorObjects.bullets.splice(i, 1);
                break;
            }
        }
        // mermi canvas dışına çıkarsa patlama olur
        if (
            b.x < 2 ||
            b.x + 2 > canvas.width ||
            b.y < 2 ||
            b.y + 2 > canvas.height
        ) {
            bullet.playBlastSound();
            sectorObjects.explosions.push(blast.createBlast(b.x, b.y));
            sectorObjects.bullets.splice(i, 1);
            break;
        }
        //mermiler oyuncuya çarparsa patlama olur ve oyun biter
        if (
            b.x - 10 < player_.x + player_.size &&
            b.x + b.radius > player_.x - 10 &&
            b.y - 10 < player_.y + player_.size &&
            b.y + b.radius > player_.y - 10
        ) {
            bullet.playBlastSound();
            sectorObjects.explosions.push(blast.createBlast(b.x, b.y));
            sectorObjects.bullets.splice(i, 1);
            state.killPlayer(true);
            break;
        }

    }
}
//update blasts
function updateBlasts() {
    for (let i = sectorObjects.explosions.length - 1; i >= 0; i--) {
        const blast = sectorObjects.explosions[i];
        blast.frame++;
        if (blast.frame >= blast.maxFrames) {
            sectorObjects.explosions.splice(i, 1);
        }
    }
}
export function updateSector1(player, canvas) {
    updateTurrets(player);
    updateBullets(player, canvas);
    updateBlasts();
}


// sektör 1 haritasını çizer
export function drawSector1(ctx) {
    // arkaplan
    for (let y = 0; y < 600; y += 120) {
        for (let x = 0; x < 800; x += 120) {
            ctx.drawImage(tileImg_1, x, y, 120, 120);
        }
    }

    // turrets çizilir
    for (let t of sectorObjects.turrets) {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.rotate(t.angle);

        // turret body
        ctx.drawImage(
            turret.turretImg,
            -t.radius,
            -t.radius,
            t.radius * 1.75,
            t.radius * 1.75
        );
        // barrel
        ctx.drawImage(
            turret.barrelImg,
            -10,
            -t.radius / 2.5,
            50,
            12.5
        );
        ctx.restore();

        // turret in menzilini gösterir
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 0, 0, 0.5)";
        ctx.stroke();
    }
    //kutular çizilir
    for (let b of sectorObjects.boxes) {
        ctx.drawImage(
            box.boxImg,
            b.x,
            b.y,
            b.width,
            b.height
        );
    }
    //mermiler çizilir
    for (let b of sectorObjects.bullets) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(Math.atan2(b.velocityY, b.velocityX) + Math.PI / 2);

        ctx.drawImage(
            bullet.bulletImg,
            -b.radius,
            -b.radius,
            b.radius * 3,
            b.radius * 4
        );
        ctx.restore();
    }
    //patlamalar çizilir
    for (let b of sectorObjects.explosions) {
        ctx.drawImage(
            blast.blastImg,
            b.x - b.radius,
            b.y - b.radius,
            b.radius * 2,
            b.radius * 2
        );
    }
    //kapı çizilir
    for (let d of sectorObjects.doors) {
        ctx.drawImage(
            door.doorImg,
            d.x,
            d.y,
            d.width,
            d.height
        );
    }
}
