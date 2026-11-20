export type GeometryMaterialGroup = { start: number; count: number; materialIndex?: number };

/** ExtrudeGeometry combines both caps into one group: bottom cap vertices come first, then the top cap. */
export function splitExtrudeMaterialGroups(groups: readonly GeometryMaterialGroup[]) {
	const caps = groups.find((group) => (group.materialIndex ?? 0) === 0);
	if (!caps || caps.count % 2 !== 0) throw new Error("Không thể tách hai mặt mica từ geometry 3D");
	const capFaceCount = caps.count / 2;
	return [
		{ start: caps.start, count: capFaceCount, materialIndex: 0 },
		{ start: caps.start + capFaceCount, count: capFaceCount, materialIndex: 1 },
		...groups.filter((group) => group !== caps).map((group) => ({ start: group.start, count: group.count, materialIndex: 2 })),
	];
}
