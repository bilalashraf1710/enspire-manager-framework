import * as actions_authentication from './authentication-actions';
import React from 'react';

export class UserNotFound extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	logOut(event) {
		event.preventDefault();
		this.props.dispatch(actions_authentication.logout(this.props.firebase));
	}

	render() {

		return (

			<div id="wrapper" className="gray-bg" style={ { paddingBottom: '300px' } }>

				<div className="middle-box text-center loginscreen animated fadeInDown">
					<div>
						{ this.props.company.company
							? <div style={ { margin: '20px 0' } }>
								<img src={ this.props.company.company.logo } width="100%" alt={ this.props.company.company.name + ' Logo' } />
								<h3>{ this.props.company.company.name }</h3>
							</div>
							: <div style={ { margin: '20px 0' } }>
								<img src={ 'images/logo.png' } width="100%" alt="Mobile Track Logo" />
							</div>
						}

						<form style={ { marginTop: '40px' } } onSubmit={ this.logOut.bind(this) }>
							<h2>{ this.props.match.params.email }</h2>
							<p>This email address has not yet been setup with the <strong><span className="text-capitalize">{ this.props.match.params.handle }</span></strong> account.  Please contact your system Administrator.</p>
							<br />
							<button type="submit" className="btn btn-primary block full-width m-b">Try Again</button>
						</form>

					</div>
				</div>

			</div>
		);
	}
};
