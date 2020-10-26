import React from 'react';
import { Spinner } from './spinner';

export function Ibox(props) {

	var styleIbox = (props.mini) ? { marginBottom: '12px' } : {};
	var styleTitle = (props.mini) ? { padding: '10px', minHeight: 'auto', maxHeight: '34px' } : {};
	var styleContent = (props.mini) ? { padding: '10px' } : {};
	
	return (

		<div className={ 'animated fadeInRight p-0 py ' + props.className } style={ props.style }>
			<div className="ibox" style={ styleIbox }>
				<div className="ibox-title" style={ styleTitle }>
					<h5>{ props.title } </h5>
				</div>
				<div className={ 'ibox-content' + ((props.no_fade) ? ' no-fade' : '') + ((props.show_spinner) ? ' sk-loading' : '') } style={ styleContent }>

					<Spinner />

					{ props.children }

				</div>
			</div>
		</div>

	);
}
