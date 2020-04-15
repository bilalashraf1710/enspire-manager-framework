import React from 'react';

export function Widget(props) {

	var cursor = (props.onClick) ? 'pointer' : 'auto'; 
	var color_class;
	switch (props.color_number) {
		case 0 : color_class = 'white-bg'; break;
		case 1 : color_class = 'navy-bg'; break;
		case 2 : color_class = 'lazur-bg'; break;
		case 3 : color_class = 'yellow-bg'; break;
		case 3 : color_class = 'red-bg'; break;
	}

	return (

		<div className={ props.grid }>
			{ props.type == 2
				?	<div className={ 'widget style1 '+props.className+' '+color_class } style={{ cursor }} onClick={ props.onClick }>
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
				:	<div className={ 'widget p-lg text-center '+props.className+' '+color_class} style={{ cursor }} onClick={ props.onClick }>
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
