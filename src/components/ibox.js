import React from 'react';
import { Spinner } from './spinner';

export function Ibox(props) {

	return (

		<div className="wrapper wrapper-content animated fadeInRight p-0 py" style={ props.style }>
			<div className="row">
				<div className="col-lg-12">
					<div className="ibox ">
						<div className="ibox-title">
							<h5>{ props.title } </h5>
							<div className="ibox-tools">
								<a className="dropdown-toggle" data-toggle="dropdown" href="/">
									<i className="fa fa-wrench"></i>
								</a>
								<ul className="dropdown-menu dropdown-user">
									<li><a href="/" className="dropdown-item">Config option 1</a>
									</li>
									<li><a href="/" className="dropdown-item">Config option 2</a>
									</li>
								</ul>
							</div>
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
