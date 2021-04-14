import React from 'react';

var _ = require('lodash');

export class Contact extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	componentDidMount() {
		this.setState({ isOpen: (this.props.open) ? this.props.open : false });
	}

	render() {

		var typeName = _.find(this.props.contactTypes, { id: this.props.contact.contactTypeId })?.name;
		
		return (

			<div onClick={ () => { this.setState({ isOpen: !this.state.isOpen }) }} style={{ cursor: 'pointer', marginBottom: '7px', paddingBottom: '1px' }}>

				{ this.state.isOpen
					? 	<span className="float-right" style={{ fontSize: '16px' }}><i className="fas fa-angle-up mr-2"></i></span>
					: 	<span className="float-right" style={{ fontSize: '16px' }}><i className="fas fa-angle-down mr-2"></i></span>
				}
				
				<i className="fas fa-user"></i> &nbsp;<strong>{ typeName + ': ' }</strong>
					{ this.props.contact.firstName + ' ' + this.props.contact.lastName } {/*  + ((this.props.contact.phone) ? ', ' + this.props.contact.phone: '') } */}
				
				{ this.state.isOpen && 
					<div>
						{ this.props.contact.phone &&
							<div className="mt-1"><i className="fas fa-phone"></i> &nbsp; { this.props.contact.phone }</div>
						}
						{ this.props.show_edit && this.props.editCallback &&
							<span className="float-right" style={ { fontSize: '16px' } }>
								<a onClick={ () => { this.props.editCallback(this.props.contact.contactId) } }>
									<i className="fas fa-edit mr-2" style={ { color: '#c4c4c4' } }></i>
								</a>
							</span>
						}
						{ this.props.contact.mobile &&
							<div className="mt-1"><i className="fas fa-mobile"></i> &nbsp; { this.props.contact.mobile }</div>
						}
						{ this.props.contact.email &&
							<div className="mt-1"><i className="fas fa-envelope"></i> &nbsp; { this.props.contact.email }</div>
						}
						<hr />
					</div>
				}
			</div>
		);
	}
}
