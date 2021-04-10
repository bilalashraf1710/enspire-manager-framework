import React from 'react';

export function Agile(props) {

	var color_class;
	switch (props.color_number) {
		case 0: color_class = 'muted-element'; break;
		case 1: color_class = 'primary-element'; break;
		case 2: color_class = 'success-element'; break;
		case 3: color_class = 'info-element'; break;
		case 4: color_class = 'warning-element'; break;
		case 5: color_class = 'danger-element'; break;
	}

	var links = (props.links) ? props.links.map((link, index) => {

		if (link.divider) return (
			<li className="dropdown-divider"></li>
		)

		return (
			<li key={ index }><a className="dropdown-item" href={ link.href } onClick={ (typeof link.callback === "function") ? () => { link.callback(props.id) } : null }>{ link.title }</a></li>
		);
	}) : null;

	let style = (typeof props.onClick === "function") ? { cursor: 'pointer' } : null;
	
	return (

		<li className={ 'agile ui-sortable-handle animated fadeInDown ' + color_class } onClick={ (typeof props.callback === "function") ? () => { props.onClick(props.id) } : null }>

			<div className="btn-group float-right">
				<button data-toggle="dropdown" className="dropdown-toggle btn btn-white" aria-expanded="false" style={{ padding: '0px 10px', marginTop: '-2px', border: 'none' }}></button>
				<ul className="dropdown-menu dropdown-menu-right" x-placement="bottom-start" style={ { position: 'absolute', top: '33px', right: '0px', willChange: 'top, right' } }>
					{ links }
				</ul>
			</div>
			{ props.title }
			<div className="agile-detail" style={{ fontSize: '11px' }}>
				{ props.detail } {/*<i className="far fa-clock"></i> 12.10.2015 */}
			</div>
		</li>

	);
}
