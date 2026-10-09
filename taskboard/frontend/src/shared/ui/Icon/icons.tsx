import type { SVGProps } from "react"

export type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function BaseIcon({ size = 16, children, ...props }: IconProps) {
	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
			{...props}
		>
			{children}
		</svg>
	)
}

export function SearchIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<circle cx="11" cy="11" r="7" />
			<path d="m20 20-3.5-3.5" />
		</BaseIcon>
	)
}

export function PlusIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<path d="M12 5v14M5 12h14" />
		</BaseIcon>
	)
}

export function CloseIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<path d="M18 6 6 18M6 6l12 12" />
		</BaseIcon>
	)
}

export function BoardIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<rect x="3" y="4" width="18" height="16" rx="2" />
			<path d="M9 4v16M15 4v16" />
		</BaseIcon>
	)
}

export function SettingsIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<circle cx="12" cy="12" r="3" />
			<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
		</BaseIcon>
	)
}

export function ChevronRightIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<path d="m9 18 6-6-6-6" />
		</BaseIcon>
	)
}

export function ArrowLeftIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<path d="M19 12H5M12 19l-7-7 7-7" />
		</BaseIcon>
	)
}

export function ArrowRightIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<path d="M5 12h14M12 5l7 7-7 7" />
		</BaseIcon>
	)
}

export function CalendarIcon(props: IconProps) {
	return (
		<BaseIcon {...props}>
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M16 3v4M8 3v4M3 11h18" />
		</BaseIcon>
	)
}

export function LogoIcon(props: IconProps) {
	return (
		<svg
			width={props.size ?? 24}
			height={props.size ?? 24}
			viewBox="0 0 24 24"
			aria-hidden="true"
			focusable="false"
		>
			<rect
				x="2"
				y="2"
				width="20"
				height="20"
				rx="5"
				fill="currentColor"
			/>
			<path
				d="M7 8h4M7 12h7M7 16h5"
				stroke="#fff"
				strokeWidth={2}
				strokeLinecap="round"
			/>
		</svg>
	)
}
