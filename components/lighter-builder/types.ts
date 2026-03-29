export interface UploadedImage {
	file: File;
	url: string;
	width: number;
	height: number;
	size: number;
}

export interface LighterTransform {
	scrollX: number;
	scrollY: number;
	rotation: number;
	scale: number;
}
