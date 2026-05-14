import * as player from "./Entities/player.js";
import * as sector1 from "./Levels/sector1.js";
import * as sector2 from "./Levels/sector2.js";
import * as sector3 from "./Levels/sector3.js";
import * as sector4 from "./Levels/sector4.js";
import * as state from "./states.js";


//canvas oluşturma
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export let currentSector = 1;


//dialoglar
export const dialogs = {
    sector1: [
        "Uyan... sistem çöktü.",
        "Bu tesis artık güvenli değil.",
        "Hayatta kalmak için hareket etmelisin.",
        "Hazır ol. Başlıyoruz."
    ],

    sector2: [
        "Sector 2 aktif.",
        "Yeni düşmanlar tespit edildi."
    ]
};
let dialogIndex = 0;
let charIndex = 0;
let typedText = "";
let frameCounter = 0;


//inputlar
const keys = {};
document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    keys[key] = true;

    if (key === "r") {
        if (state.isPlayerDead) restartGame()
        else if (state.isStateComplete) nextSector();
    }
});
document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});


//araçlar
function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}


//oyunu yeniden başlatır
function restartGame() {
    player.resetPlayer(canvas);

    if (currentSector === 2) {
        sector2.createEntities(canvas);
        sector2.setTemperature(0);
    } else if (currentSector === 3) {
        sector3.createEntities(canvas);
    } else if (currentSector === 4) {
        sector4.createEntities(canvas);
    }
}
function nextSector() {
    currentSector++;
    player.resetPlayer(canvas);
}


//ana oyun döngüsü
function gameLoop() {
    if (state.isPlayerDead) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over! Press R to Restart", canvas.width / 2, canvas.height / 2);
    }
    else if (state.isStateComplete) {
        const list = dialogs[currentSector];

        ctx.fillStyle = "rgba(2, 21, 84, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";

        if (list && dialogIndex < list.length) {

            const fullText = list[dialogIndex];
            frameCounter++;

            // hız kontrolü (her 2 frame'de 1 karakter)
            if (frameCounter % 2 === 0) {
                if (charIndex < fullText.length) {
                    typedText += fullText[charIndex];
                    charIndex++;
                }
            }

            ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
        }
    }
    else {
        switch (currentSector) {
            case 1:
                sector1.updateSector1(player.player, canvas);
                sector1.drawSector1(ctx);
                player.updatePlayer(keys, canvas, sector1.sectorObjects);
                break;
            case 2:
                sector2.updateSector2(player.player, canvas, ctx);
                sector2.drawSector2(ctx);
                player.updatePlayer(keys, canvas, sector2.sectorObjects);
                break;
            case 3:
                sector3.updateSector3(player.player, canvas);
                sector3.drawSector3(ctx);
                player.updatePlayer(keys, canvas, sector3.sectorObjects);

                break;
            case 4:
                sector4.updateSector4();
                sector4.drawSector4(ctx, player.player);
                player.updatePlayer(keys, canvas, sector4.sectorObjects);

                sector4.drawLighting(ctx, player.player, canvas);
                sector4.drawTimer(ctx);
                break;
            default:
                break;
        }

        player.drawPlayer(ctx);
    }
    requestAnimationFrame(gameLoop);
}

sector1.createEntities(canvas);
sector2.createEntities(canvas);
sector3.createEntities(canvas);
sector4.createEntities(canvas);

gameLoop();