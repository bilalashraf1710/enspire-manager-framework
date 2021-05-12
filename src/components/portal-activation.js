import React from 'react';

var moment = require('moment');

export class PortalActivation extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	componentDidMount() {
	}

	render() {

		return (

			<div>
				<p><strong className="mr-2">Portal Activation Status:</strong></p>

				<p><strong className="mr-2">Current Status:</strong>
					{ this.props.user.activated
						? <span className="label ml-2" style={ { backgroundColor: 'limeGreen', color: 'white' } }>Activated</span>
						: <span className="label label-default ml-2">Inactive</span>
					}
				</p>

				{ this.props.admin &&
					<>
						{ this.props.user.activated && this.props.sendPasswordReset && this.props.sendInvite
							? <button className="btn btn-default btn-sm float-right" type="button" onClick={ this.props.sendPasswordReset.bind(this, this.props.user) }>Send Password Reset Email
								{ this.props.sendPending &&
									<span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>
								}
							</button>
							: <button className="btn btn-primary btn-sm float-right" type="button" onClick={ this.props.sendInvite.bind(this, this.props.user) }>Send Invitation Email
								{ this.props.sendPending &&
									<span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>
								}
							</button>
						}

						{ this.props.user.invitationSent &&
							<p><strong className="mr-2">Invitation Sent:</strong> { moment(this.props.user.invitationSent.seconds, 'X').format('MMM Do YYYY,  h:mm a') }</p>
						}
						{ this.props.user.activated &&
							<p><strong className="mr-2">Activated:</strong> { moment(this.props.user.activatedDate.seconds, 'X').format('MMM Do YYYY,  h:mm a') }</p>
						}
					</>
				}
			</div>

		);
	}
}
