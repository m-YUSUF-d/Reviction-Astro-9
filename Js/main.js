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
    if (currentSector >= 4) {
        window.location.replace("./index.html");
        return;
    }
    currentSector++;
    player.resetPlayer(canvas);
}


let lastTime = 0;
let delta = 0;

//ana oyun döngüsü
function gameLoop(time) {
    const dt = time - lastTime; // ms
    lastTime = time;
    // 60 FPS'e normalize (16.67ms = 1 frame)
    delta = dt / (1000 / 60);

    if (state.isPlayerDead) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over! Press R to Restart", canvas.width / 2, canvas.height / 2);
    }
    else if (state.isStateComplete) {
        ctx.fillStyle = "rgba(0, 100, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        if (currentSector >= 4) {
            ctx.fillText("All sectors completed ! Press R to Main Menu", canvas.width / 2, canvas.height / 2);
        }
        else {
            ctx.fillText(`Sector ${currentSector} completed! Press R to Continue`, canvas.width / 2, canvas.height / 2);
        }

    }
    else {
        switch (currentSector) {
            case 1:
                sector1.updateSector1(player.player, canvas, delta);
                sector1.drawSector1(ctx);
                player.updatePlayer(keys, canvas, sector1.sectorObjects, delta);
                break;
            case 2:
                sector2.updateSector2(player.player, delta);
                sector2.drawSector2(ctx, canvas);
                player.updatePlayer(keys, canvas, sector2.sectorObjects, delta);
                break;
            case 3:
                sector3.updateSector3(player.player, canvas, delta);
                sector3.drawSector3(ctx);
                player.updatePlayer(keys, canvas, sector3.sectorObjects, delta);

                break;
            case 4:
                sector4.updateSector4(delta);
                sector4.drawSector4(ctx, player.player, delta);
                player.updatePlayer(keys, canvas, sector4.sectorObjects, delta);

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
//sektördeki varlıkların oluşturulası
sector1.createEntities(canvas);
sector2.createEntities(canvas);
sector3.createEntities(canvas);
sector4.createEntities(canvas);


gameLoop();