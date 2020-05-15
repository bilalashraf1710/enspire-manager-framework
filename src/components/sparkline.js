import React from 'react';

var moment = require('moment'); 

export class Sparkline extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};
		this.field_ref = React.createRef();
	}
	toSparkline(start_date, end_date, graph_line) {

		var result = [];
		var curr_date = moment(start_date);

		if (Array.isArray(graph_line)) {
			if (graph_line.length > 0) {

				while (curr_date.format('YYYY-MM-DD') < end_date) {

					var next = _.find(graph_line, (o) => { return moment(o, 'x').month() === curr_date.month() });

					if (next) {
						result.push(next[1]);
					} else {
						result.push(0);
					}
					curr_date = curr_date.add(1, 'month');
				}
			}
		}
		return result;
	}
	loadGraph() {

		var start_date = moment().subtract(1, 'year').format('YYYY-MM-DD');
		var end_date = moment().format('YYYY-MM-DD');

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

		$('#sparkline'+this.props.id).sparkline(this.toSparkline(start_date, end_date, this.props.line1), {
			type: 'line',
			width: '100%',
			height: '50',
			chartRangeMin: min,
			chartRangeMax: max,
			lineColor: '#1ab394',
			fillColor: "transparent",
		});

		$('#sparkline'+this.props.id).sparkline(this.toSparkline(start_date, end_date, this.props.line2), {
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
			<div id={ 'sparkline'+this.props.id } style={{ width: '100%', height: '50px', borderTop: '1px solid #eeeeee', borderBottom: '1px solid #eeeeee' }}></div>
		);
	}
}
