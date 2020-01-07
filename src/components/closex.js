import React from 'react';

export function CloseX(props) {

	return (

		<div style={{ position: 'absolute', right: '40px', cursor: 'pointer', ...props.style }} onClick={ props.onClick.bind(this) }>
			<i className="fas fa-times" style={{ fontSize: '48px', color: '#bbbbbb' }}></i>
		</div>
	);
}
