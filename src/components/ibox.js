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
					<h5>{ props.title }
						{ typeof props.icon_callback === "function" &&
							<a onClick={ props.icon_callback }>
								<i className={ props.icon + ' pull-right' } style={{ color: '#c4c4c4' }} onClick={ props.icon_callback }></i>
							</a>
						}
					</h5>
				</div>
				<div className={ 'ibox-content' + ((props.no_fade) ? ' no-fade' : '') + ((props.show_spinner) ? ' sk-loading' : '') } style={ styleContent }>
					
					<Spinner />

					<div className="px-2">
						{ props.children }
					</div>

				</div>
			</div>
		</div>

	);
}
