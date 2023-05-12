const drawBg: (ctx: CanvasRenderingContext2D, color: string) => void = (ctx, color) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    const transverseGradient = ctx.createLinearGradient(0, 0, width, 0);
    const directionGradient = ctx.createLinearGradient(0, 0, 0, height);

    transverseGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    transverseGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    directionGradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    directionGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

    ctx.fillStyle = transverseGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = directionGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
};
const drawCircle: (ctx: CanvasRenderingContext2D, x: number, y: number) => void = (ctx, x, y) => {
    ctx.save();
    ctx.beginPath();
    const raidalGradient = ctx.createRadialGradient(x, y, 3, x, y, 4);
    raidalGradient.addColorStop(0, "#333");
    raidalGradient.addColorStop(1, "#fff");
    ctx.strokeStyle = raidalGradient;
    ctx.arc(x, y, 3, 0, 2 * Math.PI);
    ctx.arc(x, y, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.closePath();
    ctx.restore();
};

const calcuateColor: (x: number, y: number, width: number, height: number, color: string) => string = (
    x,
    y,
    width,
    height,
    color
) => {
    const opacityOne = (width - x) / width;
    const opacityTwo = y / height;
    const [r, g, b] = hue2rgb(color);
    return rgb2hue(
        r * (1 - opacityOne) * (1 - opacityTwo) + 255 * opacityOne * (1 - opacityTwo),
        g * (1 - opacityOne) * (1 - opacityTwo) + 255 * opacityOne * (1 - opacityTwo),
        b * (1 - opacityOne) * (1 - opacityTwo) + 255 * opacityOne * (1 - opacityTwo)
    );
};

const rgb2hue: (r: number, g: number, b: number) => string = (r, g, b) => {
    const hex = "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
    return hex;
};

const hue2rgb: (color: string) => [number, number, number] = (color) => {
    var a, b, c;
    a = color.slice(1, 3);
    b = color.slice(3, 5);
    c = color.slice(5, 7);
    return [parseInt(a, 16), parseInt(b, 16), parseInt(c, 16)];
};

export { drawBg, drawCircle, rgb2hue, calcuateColor, hue2rgb };
