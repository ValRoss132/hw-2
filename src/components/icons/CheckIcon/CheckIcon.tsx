import * as React from 'react';
import { IconProps } from '../Icon';

import Icon from '../Icon';

const CheckIcon: React.FC<IconProps> = ({
	width = '24',
	height = '24',
	...props
}) => {
	return (
		<Icon width={width} height={height} {...props}>
			<path
				d="M4 11.6129L9.87755 18L20 7"
				fill="none"
				stroke="current"
				stroke-width="2"
			/>
		</Icon>
	);
};

export default CheckIcon;
