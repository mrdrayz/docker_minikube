import type { ReactNode } from "react"
import { cx } from "@/shared/lib"
import styles from "./Lozenge.module.css"

export type LozengeTone =
	| "neutral"
	| "primary"
	| "success"
	| "warning"
	| "danger"

export type LozengeProps = {
	tone?: LozengeTone
	children: ReactNode
	className?: string
}

export function Lozenge({
	tone = "neutral",
	children,
	className,
}: LozengeProps) {
	return (
		<span className={cx(styles.lozenge, styles[tone], className)}>
			{children}
		</span>
	)
}
