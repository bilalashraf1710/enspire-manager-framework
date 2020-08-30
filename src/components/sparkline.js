import React from 'react';

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

		$('#sparkline'+this.props.id).sparkline(this.props.line1, {
			type: 'line',
			width: '100%',
			height: this.props.height,
			chartRangeMin: min,
			chartRangeMax: max,
			lineColor: this.props.color1,
			fillColor: "transparent",
		});

		$('#sparkline'+this.props.id).sparkline(this.props.line2, {
			type: 'line',
			width: '100%',
			height: this.props.height,
			chartRangeMin: min,
			chartRangeMax: max,
			lineColor: this.props.color2,
			fillColor: "transparent",
			composite: true,
		});
	}

	render() {

		return (
			<div id={ 'sparkline'+this.props.id } style={{ width: '100%', height: this.props.height + 'px', borderTop: this.props.border, borderBottom: this.props.border, backgroundColor: this.props.bgcolor }}></div>
		);
	}
}
