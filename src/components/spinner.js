import React from 'react';

export function Spinner(props) {

	var style = (props.center) ? {
		display: 'block',
		position: 'absolute',
		top: '40%',
		left: 0,
		right: 0,
		zIndex: 2000,
	} : {};

	return (

		<div className="sk-spinner sk-spinner-wave" style={ style }>
			<div className="sk-rect1"></div>
			<div className="sk-rect2"></div>
			<div className="sk-rect3"></div>
			<div className="sk-rect4"></div>
			<div className="sk-rect5"></div>
		</div>
	);
}
