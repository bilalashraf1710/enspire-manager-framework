import React from 'react';
import { Spinner } from './spinner';

export function Avatar(props) {

	var initials = '';

	if (props.name && !props.image) {
		var name_array = props.name.split(' ');
		if (name_array.length == 2) {
			initials = name_array[0].charAt(0) + name_array[1].charAt(0);
		} else if (name_array.length >= 3) {
			initials = name_array[0].charAt(0) + name_array[1].charAt(0) + name_array[2].charAt(0);
		} else {
			initials = props.name.substring(0, 3);
		}
	}

	return (

		<div className={ 'rounded-circle circle-border ' + ((props.className) ? props.className : '') }
			style={ { 
				width: props.size + 'px', 
				height: props.size + 'px', 
				display: 'flex', 
				alignItems: 'center', 
				justifyContent: 'center', 
				fontSize: (props.fontSize) ? props.fontSize + 'px' : '38px',
				color: props.color,
				backgroundColor: (props.bgColor) ? props.bgColor : 'none',
				backgroundImage: (props.image) ? 'url(' + props.image + ')' : 'none',
				backgroundSize: 'cover',
				backgroundPosition: 'center center',
				border: props.border, 
			} }>
			<span className="text-uppercase">{ props.element ? props.element : initials }</span>
		</div>

	);
}
