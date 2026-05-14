import * as turret from "../Entities/turret.js";
import * as bullet from "../Entities/bullet.js";
import * as blast from "../Entities/blast.js";
import * as box from "../Entities/box.js";
import * as door from "../Entities/door.js";
import * as player from "../Entities/player.js";
import * as state from "../states.js";
import * as audio from "../audioManager.js"

export const sectorObjects = {
    turrets: [],
    boxes: [],
    bullets: [],
    explosions: [],
    doors: []
};

export const tileImg_3 = new Image();
tileImg_3.src = "../assets/tiles/tile3.png";


//turretleri oluşturur
function createTurrets(canvas) {
    sectorObjects.turrets = [
        turret.createTurret(canvas.width / 2, canvas.height / 2)
    ];
}
//kutuları oluşturur
function crateBoxes(canvas) {
    const margin = 75; // oyuncu 0,0 olduğu için güvenli alan

    sectorObjects.boxes = [
        box.createBox(margin + Math.random() * (canvas.width - 80 - margin), margin + Math.random() * (canvas.height - 60 - margin), 70, 70),
        box.createBox(margin + Math.random() * (canvas.width - 100 - margin), margin + Math.random() * (canvas.height - 80 - margin), 90, 90),
        box.createBox(margin + Math.random() * (canvas.width - 100 - margin), margin + Math.random() * (canvas.height - 80 - margin), 90, 90),
        box.createBox(margin + Math.random() * (canvas.width - 60 - margin), margin + Math.random() * (canvas.height - 45 - margin), 50, 50),
        box.createBox(margin + Math.random() * (canvas.width - 60 - margin), margin + Math.random() * (canvas.height - 45 - margin), 40, 40),
        box.createBox(margin + Math.random() * (canvas.width - 60 - margin), margin + Math.random() * (canvas.height - 45 - margin), 40, 40),
        box.createBox(margin + Math.random() * (canvas.width - 100 - margin), margin + Math.random() * (canvas.height - 75 - margin), 80, 80),
        box.createBox(margin + Math.random() * (canvas.width - 60 - margin), margin + Math.random() * (canvas.height - 45 - margin), 50, 50),
        box.createBox(margin + Math.random() * (canvas.width - 100 - margin), margin + Math.random() * (canvas.height - 75 - margin), 80, 80),
        box.createBox(margin + Math.random() * (canvas.width - 80 - margin), margin + Math.random() * (canvas.height - 60 - margin), 70, 70)
    ];
}
//kapıyı oluşturur
function createDoors(canvas) {
    sectorObjects.doors = [door.createDoor(canvas.width - 10, canvas.height - 125, 10, 125)];
}
export function createEntities(canvas) {
    createTurrets(canvas);
    crateBoxes(canvas);
    createDoors(canvas);
}


//çarpışma
function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}
function resolveCollision(a, b) {

    // merkezler
    const ax = a.x + a.width / 2;
    const ay = a.y + a.height / 2;

    const bx = b.x + b.width / 2;
    const by = b.y + b.height / 2;

    // fark
    const dx = ax - bx;
    const dy = ay - by;

    // overlap
    const overlapX =
        (a.width / 2 + b.width / 2) - Math.abs(dx);

    const overlapY =
        (a.height / 2 + b.height / 2) - Math.abs(dy);

    if (overlapX < overlapY) {

        // X çöz
        if (dx > 0) {
            a.x += overlapX / 2;
            b.x -= overlapX / 2;
        } else {
            a.x -= overlapX / 2;
            b.x += overlapX / 2;
        }

        // velocity değiştir
        let temp = a.velocityX;
        a.velocityX = b.velocityX;
        b.velocityX = temp;

    } else {

        // Y çöz
        if (dy > 0) {
            a.y += overlapY / 2;
            b.y -= overlapY / 2;
        } else {
            a.y -= overlapY / 2;
            b.y += overlapY / 2;
        }

        // velocity değiştir
        let temp = a.velocityY;
        a.velocityY = b.velocityY;
        b.velocityY = temp;
    }
}


//update turrets
function updateTurrets(player_) {

    for (let t of sectorObjects.turrets) {

        const dx = (player_.x + player_.size / 2) - t.x;
        const dy = (player_.y + player_.size / 2) - t.y;

        const dist = Math.hypot(dx, dy);

        if (dist < t.range * 1.1) {
            t.angle = Math.atan2(dy, dx);
        }

        if (t.cooldown > 0) {
            t.cooldown--;
        }

        if (dist < t.range * 1.1 && t.cooldown === 0) {
            turret.playTurretSound();
            sectorObjects.bullets.push(bullet.createBullet(t.x + 4, t.y + 4, t.angle));//mermiler oluşur
            t.cooldown = t.fireRate / 2;
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
            b.x < 0 ||
            b.x > canvas.width ||
            b.y < 0 ||
            b.y > canvas.height
        ) {
            bullet.playBlastSound();
            sectorObjects.explosions.push(blast.createBlast(b.x, b.y));
            sectorObjects.bullets.splice(i, 1);
            break;
        }
        //mermiler oyuncuya çarparsa patlama olur ve oyun biter
        if (
            b.x < player_.x + player_.size &&
            b.x + b.radius > player_.x &&
            b.y < player_.y + player_.size &&
            b.y + b.radius > player_.y
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
//update boxes
function updateBoxes(canvas, player_) {
    // hareket
    for (let b of sectorObjects.boxes) {
        b.x += b.velocityX;
        b.y += b.velocityY;

        // duvar collision X
        if (b.x < 0) {
            b.velocityX *= -1;
        }

        if (b.x + b.width > canvas.width) {
            b.velocityX *= -1;
        }

        // duvar collision Y
        if (b.y < 0) {
            b.velocityY *= -1;
        }

        if (b.y + b.height > canvas.height) {
            b.velocityY *= -1;
        }
    }

    // kutu-kutu collision
    for (let i = 0; i < sectorObjects.boxes.length; i++) {

        for (let j = i + 1; j < sectorObjects.boxes.length; j++) {

            let a = sectorObjects.boxes[i];
            let b = sectorObjects.boxes[j];

            if (isColliding(a, b)) {
                resolveCollision(a, b);
            }
        }
    }

    // kutu-oyuncu collision
    for (let b of sectorObjects.boxes) {
        if (
            player_.x - 3 < b.x + b.width + player_.size &&
            player_.x + player_.size > b.x - 3 &&
            player_.y - 3 < b.y + b.height + player_.size &&
            player_.y + player_.size > b.y - 3
        ) {
            state.killPlayer(true);
        }
    }
}

//sektör 3 güncellenir
export function updateSector3(player_, canvas) {
    updateTurrets(player_);
    updateBullets(player_, canvas);
    updateBlasts();
    updateBoxes(canvas, player_);
}


// sektör 3 haritasını çizer
export function drawSector3(ctx) {
    // arkaplan
    for (let y = 0; y < 600; y += 120) {
        for (let x = 0; x < 800; x += 120) {
            ctx.drawImage(tileImg_3, x, y, 120, 120);
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
        ctx.arc(t.x, t.y, t.range * 1.1, 0, Math.PI * 2);
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
            door.doorImg3,
            d.x,
            d.y,
            d.width,
            d.height
        );
    }
}
