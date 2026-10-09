import type { ComponentPropsWithoutRef } from "react"
import { Link, type LinkProps } from "react-router"
import { cx } from "@/shared/lib"
import styles from "./Button.module.css"

export type ButtonVariant =
	| "primary"
	| "secondary"
	| "subtle"
	| "danger"
	| "dangerSubtle"
export type ButtonSize = "sm" | "md"

type ButtonStyleProps = {
	variant?: ButtonVariant
	size?: ButtonSize
}

function getButtonClassName(
	{ variant = "secondary", size = "md" }: ButtonStyleProps,
	className?: string,
) {
	return cx(styles.button, styles[variant], styles[size], className)
}

export type ButtonProps = ComponentPropsWithoutRef<"button"> & ButtonStyleProps

export function Button({
	variant,
	size,
	type = "button",
	className,
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={getButtonClassName({ variant, size }, className)}
			{...props}
		/>
	)
}

export type LinkButtonProps = LinkProps & ButtonStyleProps

export function LinkButton({
	variant,
	size,
	className,
	...props
}: LinkButtonProps) {
	return (
		<Link
			className={getButtonClassName({ variant, size }, className)}
			{...props}
		/>
	)
}
