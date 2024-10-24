import * as React from 'react';

import '../../../styles/variables.css';

import './icon.css';

export type IconProps = React.SVGAttributes<SVGElement> & {
	className?: string;
	color?: 'primary' | 'secondary' | 'accent';
};

const Icon: React.FC<React.PropsWithChildren<IconProps>> = ({
	className,
	color,
	children,
	width,
	height,
	...props
}) => {
	return (
		<div>
			<svg
				className={`icon ${className} ${color}`}
				{...props}
				width={width}
				height={height}
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				{children}
			</svg>
		</div>
	);
};

export default Icon;
