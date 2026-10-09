import { useState, type CSSProperties } from "react"
import { cx } from "@/shared/lib"
import { Button } from "../Button"
import styles from "./ExpandableText.module.css"

export type ExpandableTextProps = {
	id: string
	text: string
	maxChars?: number
	maxLines?: number
	className?: string
}

export function ExpandableText({
	id,
	text,
	maxChars = 160,
	maxLines = 2,
	className,
}: ExpandableTextProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const isLong = text.length > maxChars || text.split("\n").length > maxLines
	const isClamped = isLong && !isExpanded
	const clampStyle: CSSProperties | undefined = isClamped
		? { WebkitLineClamp: maxLines, lineClamp: maxLines }
		: undefined

	return (
		<div className={styles.wrapper}>
			<p
				id={id}
				className={cx(
					styles.text,
					isClamped && styles.clamped,
					className,
				)}
				style={clampStyle}
			>
				{text}
			</p>
			{isLong && (
				<Button
					variant="subtle"
					size="sm"
					className={styles.toggle}
					aria-expanded={isExpanded}
					aria-controls={id}
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? "Свернуть" : "Показать полностью"}
				</Button>
			)}
		</div>
	)
}
