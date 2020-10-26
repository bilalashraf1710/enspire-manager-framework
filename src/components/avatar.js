import React from 'react';
import { Spinner } from './spinner';

export function Avatar(props) {

	var address = '';
	var initials = '';

	if (props.name && !props.image) {
		var name_array = props.name.split(' ');
		var i = 0;
		var x = 0;
		if (Number.isInteger(parseInt(name_array[0]))) {
			address = name_array[0];
			i++;
			x = 1;
		}
		if (name_array.length == (2 + x)) {
			initials = name_array[i].charAt(0) + name_array[i + 1].charAt(0);
		} else if (name_array.length >= (3 + x)) {
			initials = name_array[i].charAt(0) + name_array[i + 1].charAt(0) + name_array[i + 2].charAt(0);
		} else {
			initials = props.name.substring(i, 3);
		}
	}

	return (

		<div className={ 'rounded-circle circle-border ' + ((props.className) ? props.className : '') }
			style={ { 
				width: props.size + 'px', 
				height: props.size + 'px', 
				display: 'flex', 
				flexDirection: 'column',
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
			{ address &&
				<div style={{ fontSize: '14px', marginBottom: '-14px' }}>{ address }</div>
			}
			<div className="text-uppercase">{ props.element ? props.element : initials }</div>
		</div>

	);
}
