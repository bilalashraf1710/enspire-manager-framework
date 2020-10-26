import React, { useState } from 'react';

export class Contact extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	render() {

		return (

			<div onClick={ () => { this.setState({ isOpen: !this.state.isOpen }) }} style={{ cursor: 'pointer' }}>

				{ this.state.isOpen
					? 	<span className="float-right"><i className="fas fa-angle-down"></i></span>
					: 	<span className="float-right"><i className="fas fa-angle-up"></i></span>
				}
				
				<i className="fas fa-user"></i> &nbsp; { this.props.contact.firstName + ' ' + this.props.contact.lastName } {/*  + ((this.props.contact.phone) ? ', ' + this.props.contact.phone: '') } */}
				
				{ this.state.isOpen && 
					<div>
						{ this.props.contact.phone &&
							<div className="mt-1"><i className="fas fa-phone"></i> &nbsp; { this.props.contact.phone }</div>
						}
						{ this.props.contact.mobile &&
							<div className="mt-1"><i className="fas fa-mobile"></i> &nbsp; { this.props.contact.mobile }</div>
						}
						{ this.props.contact.email &&
							<div className="mt-1"><i className="fas fa-envelope"></i> &nbsp; { this.props.contact.email }</div>
						}
					</div>
				}
			</div>
		);
	}
}
