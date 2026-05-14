//patlama oluşturma
export function createBlast(x, y) {
    return {
        x,
        y,
        radius: 35,
        frame: 0,
        maxFrames: 10
    };
}
export const blastImg = new Image();
blastImg.src = "../assets/turret/blast.png";