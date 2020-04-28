import React from 'react';

export function CloseX(props) {

	return (

		<div style={{ position: 'absolute', right: '40px', cursor: 'pointer', zIndex: '100', ...props.style }} onClick={ props.onClick.bind(this) }>
			<i className="fas fa-times" style={{ fontSize: '38px', color: '#bbbbbb' }}></i>
		</div>
	);
}
