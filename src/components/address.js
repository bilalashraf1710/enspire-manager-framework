import React from 'react';

export class Address extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		return (

			<div className="mb-2">
				{ this.props.editCallback &&
					<span className="float-right" style={ { fontSize: '16px' } }>
						<a onClick={ () => { this.props.editCallback(this.props.address.id) } }>
							<i className="fas fa-pencil-alt" style={ { color: '#c4c4c4' } }></i>
						</a>
					</span>
				}
				{ this.props.address.addressName &&
					<div style={ { fontWeight: 'bold' } }>{ this.props.address.addressName }</div>
				}
				{ (this.props.address.addressLine1 || this.props.address.addressLine2 || this.props.address.city || this.props.address.state || this.props.address.zip) &&
					<div>
						{ this.props.address.addressLine1 &&
							<span>{ this.props.address.addressLine1 } </span>
						}
						{ this.props.address.addressLine2 &&
							<span>{ this.props.address.addressLine2 } </span>
						}
						{ this.props.address.city &&
							<span>{ this.props.address.city } </span>
						}
						{ (this.props.address.state || this.props.address.zip) &&
							<span>, </span>
						}
						{ this.props.address.state &&
							<span>{ this.props.address.state } </span>
						}
						{ this.props.address.zip &&
							<span>{ this.props.address.zip } </span>
						}
					</div>
				}
			</div>

		);
	}
}
