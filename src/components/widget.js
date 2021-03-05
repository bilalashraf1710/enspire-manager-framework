import React from 'react';

export function Widget(props) {

	var cursor = (props.onClick) ? 'pointer' : 'auto'; 
	var color_class;
	switch (props.color_number) {
		case 0 : color_class = 'bg-muted'; break;
		case 1 : color_class = 'bg-primary'; break;
		case 2 : color_class = 'bg-success'; break;
		case 3 : color_class = 'bg-info'; break;
		case 4 : color_class = 'bg-warning'; break;
		case 5 : color_class = 'bg-danger'; break;
	}

	return (

		<div className={ props.grid }>
			{ props.type == 2
				?	<div className={ 'widget style1 animated fadeInRight '+props.className+' '+color_class } style={{ cursor }} onClick={ props.onClick }>
						<div className="row">
							<div className="col-4">
								<i className={ props.icon }></i>
							</div>
							<div className="col-8 text-right">
								<span>{ props.text }</span>
								<h2 className="font-bold">{ props.title }</h2>
							</div>
						</div>
					</div>
				:	<div className={ 'widget p-lg text-center animated fadeInRight '+props.className+' '+color_class} style={{ cursor }} onClick={ props.onClick }>
						<div className="m-b-md">
							<i className={ props.icon }></i>
							<h1 className="m-xs">{ props.title }</h1>
							<h3 className="font-bold no-margins">{ props.text }</h3>
						</div>
					</div>
			}
		</div>
	);
}
