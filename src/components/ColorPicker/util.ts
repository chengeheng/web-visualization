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
};

export { drawBg };
