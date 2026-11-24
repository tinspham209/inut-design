function sharpUnavailable(): never {
	throw new Error("Native sharp is unavailable in the Cloudflare Worker runtime.");
}

export default sharpUnavailable;
