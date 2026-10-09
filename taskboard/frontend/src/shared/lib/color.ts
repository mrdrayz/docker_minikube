export type AccentColor = {
	solid: string
	soft: string
}

const ACCENT_COLORS: readonly AccentColor[] = [
	{ solid: "#5544d8", soft: "#e4e0fb" },
	{ solid: "#00a3bf", soft: "#d6f4f9" },
	{ solid: "#e5780b", soft: "#fdebd3" },
	{ solid: "#2f9e6e", soft: "#d9f2e6" },
	{ solid: "#d6416b", soft: "#fbe1e8" },
	{ solid: "#8a5cd1", soft: "#ece2fa" },
	{ solid: "#c49a00", soft: "#fbf1cc" },
]

export function getAccentColor(seed: number): AccentColor {
	const index = Math.abs(seed) % ACCENT_COLORS.length
	return ACCENT_COLORS[index] ?? ACCENT_COLORS[0]!
}
