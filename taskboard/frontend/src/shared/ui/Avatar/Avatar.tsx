import { cx, getAccentColor } from "@/shared/lib"
import styles from "./Avatar.module.css"

export type AvatarProps = {
	name: string
	seed: number
	size?: "sm" | "md" | "lg"
	className?: string
}

export function Avatar({ name, seed, size = "md", className }: AvatarProps) {
	const { solid } = getAccentColor(seed)
	const initial = name.trim().charAt(0).toLocaleUpperCase("ru") || "?"

	return (
		<span
			className={cx(styles.avatar, styles[size], className)}
			style={{ background: solid }}
			aria-hidden="true"
		>
			{initial}
		</span>
	)
}
