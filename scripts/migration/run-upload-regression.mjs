import { mkdir, writeFile } from "node:fs/promises";
import { register } from "node:module";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { loadUploadFixtures } from "./api-fixtures/uploads/upload-fixtures.mjs";

register("./scripts/typescript-loader.mjs", pathToFileURL("./"));
const {
	decodeBase64Image,
	sanitizeKeychainFilename,
	validateKeychainImage,
	validatePersistedKeychainImage,
} = await import("@/utils/keychain/imageValidation");

const fixtures = await loadUploadFixtures();
const results = [];
let persistenceAttempts = 0;
for (const fixture of fixtures) {
	let valid = false;
	let result = null;
	try {
		const bytes = decodeBase64Image(fixture.data);
		result = validateKeychainImage(bytes, fixture.contentType);
		valid = true;
	} catch {
		// Expected invalid fixtures are recorded below.
	}
	const shouldPass = fixture.name.startsWith("valid-");
	if (valid && shouldPass) {
		persistenceAttempts += 1;
		result = {
			...result,
			filename: sanitizeKeychainFilename("../../fixture.exe", fixture.contentType),
		};
	}
	results.push({
		name: fixture.name,
		expected: shouldPass ? "accepted-before-mock-write" : "rejected-before-write",
		status: valid ? "accepted" : "rejected",
		metadata: valid
			? {
					format: result.format,
					width: result.width,
					height: result.height,
					byteLength: result.byteLength,
				}
			: null,
		persistenceAttempted: Boolean(valid && shouldPass),
		pass: valid === shouldPass,
	});
}

let persistenceFailureBeforeWrite = false;
try {
	validatePersistedKeychainImage({
		image: { _type: "image", asset: { _type: "reference", _ref: "" } },
		url: "javascript:invalid",
	});
} catch {
	persistenceFailureBeforeWrite = true;
}
results.push({
	name: "invalid-persistence-result",
	expected: "rejected",
	status: persistenceFailureBeforeWrite ? "rejected" : "accepted",
	pass: persistenceFailureBeforeWrite,
	persistenceAttempted: false,
});

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	limits: {
		encodedBodyBytes: 14 * 1024 * 1024,
		decodedImageBytes: 10 * 1024 * 1024,
		maxDimension: 2048,
		maxPixels: 2048 * 2048,
	},
	mockPersistenceAttempts: persistenceAttempts,
	realPersistenceAttempts: 0,
	results,
	status:
		persistenceAttempts === 3 && results.every((result) => result.pass) ? "pass" : "fail",
};
const outputPath = path.join(process.cwd(), "artifacts/migration/runtime/uploads/regression.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
if (report.status !== "pass") {
	console.error(`Upload regression failed. See ${path.relative(process.cwd(), outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Upload regression passed ${results.length} validation and persistence-shape fixtures.`);
}
