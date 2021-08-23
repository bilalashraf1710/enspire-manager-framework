import React from 'react';
import { Spinner } from './spinner';

export function Widget(props) {

	var cursor = (props.onClick) ? 'pointer' : 'auto';
	var color_class;
	switch (props.color_number) {
		case 0: color_class = 'bg-muted'; break;
		case 1: color_class = 'bg-primary'; break;
		case 2: color_class = 'bg-success'; break;
		case 3: color_class = 'bg-info'; break;
		case 4: color_class = 'bg-warning'; break;
		case 5: color_class = 'bg-danger'; break;
		case 6: color_class = 'bg-dark'; break;
		case 7: color_class = 'bg-light'; break;
		case 8: color_class = 'bg-white'; break;
	}

	var spinnerColor = (props.spinnerColor) ? props.spinnerColor : '';

	return (

		<div className={ props.grid }>
			{ props.type == 2
				? <div className={ 'widget style1 animated fadeInRight ' + props.className + ' ' + color_class } style={ { cursor: cursor, minHeight: '100px' } } onClick={ props.onClick }>
					{ props.fetching
						? <Spinner center color={ spinnerColor } />
						: <div className="row">
							<div className="col-4">
								<i className={ props.icon }></i>
							</div>
							<div className="col-8 text-right">
								<span>{ props.text }</span>
								<h2 className="font-bold">{ props.title }</h2>
							</div>
						</div>
					}
				</div>
				: <div className={ 'widget p-lg text-center animated fadeInRight ' + props.className + ' ' + color_class } style={ { cursor: cursor, minHeight: '100px' } } onClick={ props.onClick }>
					{ props.fetching
						? <Spinner center color={ spinnerColor } />
						: <div>
							<i className={ props.icon }></i>
							<h1 className="m-xs">{ props.title }</h1>
							<h3 className="font-bold no-margins">{ props.text }</h3>
						</div>
					}
				</div>
			}
		</div>
	);
}
