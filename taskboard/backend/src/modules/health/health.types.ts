export type HealthDependencies = {
	pingDatabase: () => Promise<unknown>
	isShuttingDown: () => boolean
}
