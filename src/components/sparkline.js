import React from 'react';

var moment = require('moment'); 

export class Sparkline extends React.Component {

	constructor(props) {
		super(props);
	}
	loadGraph() {

		var max = 0;
		var min = 0;

		var max1 = _.maxBy(this.props.line1, (o) => { return o[1] });
		var max2 = _.maxBy(this.props.line2, (o) => { return o[1] });
		var min1 = _.minBy(this.props.line1, (o) => { return o[1] });
		var min2 = _.minBy(this.props.line2, (o) => { return o[1] });


		max = (max1) ? max1 : ((max2) ? max2 : 0);		
		min = (min1) ? min1 : ((min2) ? min2 : 0);

		if (max2) if (max2 > max) max = max2;
		if (min2) if (min2 < min) min = min2;

		$('#sparkline'+this.props.key).sparkline(this.props.line1, {
			type: 'line',
			width: '100%',
			height: '50',
			chartRangeMin: min,
			chartRangeMax: max,
			lineColor: '#1ab394',
			fillColor: "transparent",
		});

		$('#sparkline'+this.props.key).sparkline(this.props.line2, {
			type: 'line',
			width: '100%',
			height: '50',
			chartRangeMin: min,
			chartRangeMax: max,
			lineColor: '#BBBBBB',
			fillColor: "transparent",
			composite: true,
		});
	}

	render() {

		return (
			<div id={ 'sparkline'+this.props.key } style={{ width: '100%', height: '50px', borderTop: '1px solid #eeeeee', borderBottom: '1px solid #eeeeee' }}></div>
		);
	}
}
