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

	var color = (props.color) ? { backgroundColor: props.color } : {};

	return (

		<div className="sk-spinner sk-spinner-wave" style={{ ...style, ...props.style  }}>
			<div className="sk-rect1" style={ color }></div>
			<div className="sk-rect2" style={ color }></div>
			<div className="sk-rect3" style={ color }></div>
			<div className="sk-rect4" style={ color }></div>
			<div className="sk-rect5" style={ color }></div>
		</div>
	);
}
