//kutu oluşturma
export function createBox(x, y, width, height) {
    return {
        x,
        y,
        width,
        height,

        velocityX: (Math.random() - 0.5) * 2,
        velocityY: (Math.random() - 0.5) * 2
    };
}
export const boxImg = new Image();
export const boxImg2 = new Image();
boxImg.src = "../assets/objects/box1.jpg";
boxImg2.src = "../assets/objects/box2.png";