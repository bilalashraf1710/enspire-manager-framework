import React from 'react';
import { Spinner } from './spinner';

export function Ibox(props) {

	return (

		<div className={ 'animated fadeInRight p-0 py ' + props.className } style={ props.style }>
			<div className="row">
				<div className="col-lg-12">
					<div className="ibox ">
						<div className="ibox-title">
							<h5>{ props.title } </h5>
						</div>
						<div className={ 'ibox-content' + ((props.show_spinner) ? ' sk-loading' : '') }>

							<Spinner />

							{ props.children }

						</div>
					</div>
				</div>
			</div>
		</div>

	);
}
