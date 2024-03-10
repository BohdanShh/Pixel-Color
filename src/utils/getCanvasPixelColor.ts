export function getCanvasPixelColor(ctx: CanvasRenderingContext2D, x: number, y: number) {
  return ctx.getImageData(x, y, 1, 1).data;
}
