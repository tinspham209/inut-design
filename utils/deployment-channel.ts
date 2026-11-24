export type DeploymentChannel = "development" | "preview" | "production" | "test";

type DeploymentEnvironment = Partial<
	Pick<NodeJS.ProcessEnv, "DEPLOYMENT_CHANNEL" | "NODE_ENV">
>;

export function getDeploymentChannel(
	environment: DeploymentEnvironment = process.env
): DeploymentChannel {
	const explicit = environment.DEPLOYMENT_CHANNEL?.trim().toLowerCase();
	if (explicit === "development" || explicit === "preview" || explicit === "production" || explicit === "test") {
		return explicit;
	}
	if (environment.NODE_ENV === "test") return "test";
	if (environment.NODE_ENV === "production") return "production";
	return "development";
}
