import React from 'react';

export function CloseX(props) {

	return (

		<div className={ 'animated fadeIn ' + props.className } style={{ position: 'absolute', right: '10px', marginTop: '5px', cursor: 'pointer', zIndex: '100', ...props.style }} onClick={ props.onClick.bind(this) }>
			<i className="fas fa-times" style={{ fontSize: '38px', color: '#bbbbbb' }}></i>
		</div>
	);
}
