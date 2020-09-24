import React from 'react';

export function Chip(props) {

	return (

		<span className="chip label ml-2">
			{ (typeof props.onClick === 'function')
				? 	<a role="button" onClick={ () => { props.callback }}>{ props.label }</a>
				: 	props.label
			}

			{ props.dismissable &&
				<a role="button" onClick={ () => { props.onDismiss(props.label) } }><i className="fas fa-times-circle"></i></a>
			}
		</span>
	);
}
