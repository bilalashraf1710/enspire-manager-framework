import React from 'react';
import axios from 'axios';
import { Spinner } from './spinner';

const access_token = 'pk.eyJ1IjoiYmxha2Vjb2RleiIsImEiOiJja2twemEyZ3ozMXZtMnVudzh6ajRkdG5wIn0.ZJ6dJHj6rJbOrDiBUuY2MA';

export class Mapbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			mapReady: false,
			mapURL: null,
			ar: 3,
		};
	}
	componentDidMount() {
		this.componentDidUpdate();
		if (this.props.aspect_ratio) this.setState({ ar: this.props.aspect_ratio });
	}
	componentDidUpdate(prevProps) {
		if (this.props.map_address !== prevProps?.map_address) {
			this.setState({ mapReady: false }, () => {
				this.getMapCoordinates();
			});
		}
	}
	getMapCoordinates() {
		const url_endpoint = 'geocoding/v5/mapbox.places/' + encodeURIComponent(this.props.map_address) + '.json';

		axios({
			url: url_endpoint,
			method: 'get',
			baseURL: 'https://api.mapbox.com/',
			params: {
				access_token: access_token
			}
		}).then(response => {
			if (response.data?.features[0]?.center) {
				let coordinates = response.data.features[0].center;
				const STATIC_IMAGE_URL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-l-embassy+f74e4e(${coordinates[0]},${coordinates[1]})/${coordinates[0]},${coordinates[1]},12/600x${(600 / this.state.ar)}?access_token=${access_token}`;

				this.setState({ mapURL: STATIC_IMAGE_URL, mapReady: true });
			} else {
				this.setState({ mapURL: 'images/map-not-found.png', mapReady: true });
			}
		});
	}

	render() {

		return (

			<div>
				{
					this.state.mapReady && (
						<div className={ 'mapbox animated fadeInRight ' + this.props.className }>
							<a href={ 'https://maps.google.com/maps/place/' + this.props.map_address } target="_blank">
								<img src={ this.state.mapURL } style={{ width: '100%' }} />
							</a>
						</div>
					)
				}
				{
					!this.state.mapReady && (
						<Spinner center />
					)
				}
			</div>
		);
	}
};
