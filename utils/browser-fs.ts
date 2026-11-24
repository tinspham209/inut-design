function unavailable(): never {
	throw new Error("The filesystem is unavailable in the browser runtime.");
}

export const existsSync = unavailable;
export const readFile = unavailable;
export const readFileSync = unavailable;
export const readdir = unavailable;
export const readdirSync = unavailable;
export const stat = unavailable;
export const writeFile = unavailable;

export default {
	existsSync,
	readFile,
	readFileSync,
	readdir,
	readdirSync,
	stat,
	writeFile,
};
