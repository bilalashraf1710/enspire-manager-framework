import React from 'react';
import { Spinner } from './spinner';

var $ = window.$;

export class Graph extends React.Component {

	constructor(props) {
		super(props);
	}
	componentDidMount() {
		this.renderGraph();
	}
	componentDidUpdate() {
		this.renderGraph();
	}
	renderGraph() {
		var options = {
			series: {
				bars: {
					show: true,
				},
				splines: {
					show: true,
					tension: 0.4,
					lineWidth: 0,
					fill: 0.3,
				},
				points: {
					radius: 5,
					show: true,
				},
				shadowSize: 2,
			},
			bars: {
				align: 'center',
				barWidth: .5,
			},
			grid: {
				hoverable: true,
				clickable: true,
				tickColor: "#d5d5d5",
				borderWidth: 1,
				color: '#d5d5d5',
			},
			colors: this.props.colors,
			xaxis: {
				mode: "time",
				timeBase: "milliseconds",
				timeformat: "%b'%y",
			},
			yaxis: {
				min: 0,
				ticks: 4,
				tickFormatter: (y) => {
					if (this.props.units == 'dollars') return '$ ' + y.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
					if (this.props.units == 'hours') return y.toString() + ' hrs';
					return y.toString();
				}
			},
			tooltip: {
				show: true,
			}
		}

		if (this.props.data.length > 0) $.plot($('#graph' + this.props.id), this.props.data, options);
	}
	
	render() {


		return (
			<div id={ 'graph' + this.props.id } style={ { width: '100%', height: this.props.height + 'px', marginTop: '5px' } }>
				<div style={ { paddingTop: (this.props.height / 2 - 3) + 'px' } }>
					<Spinner />
				</div>
			</div>
		);
	}
}
