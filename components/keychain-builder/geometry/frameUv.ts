export function mapCenteredGeometryToFrameUv(x: number, y: number, width: number, height: number) {
	return [(x + width / 2) / width, (y + height / 2) / height] as const;
}
