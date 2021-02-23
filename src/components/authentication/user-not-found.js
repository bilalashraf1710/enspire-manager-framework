import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';

export class UserNotFound extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
		this.setState({ loading: true });
		this.props.dispatch(actions_authentication.verifyHandle(this.props.match.params.handle, this.props.firebase, (handleDoc) => {
			this.setState({ loading: false });
			if (handleDoc.exists) {
				this.setState({ handle: { ...handleDoc.data(), id: handleDoc.id } });
			} else {
				window.toastr.error('This company handle cannot be found.  Please check for errors and try again.', 'Not Found');
			}
		}));
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
						{ this.state.loading
							?	<div style={ { margin: '60px 0' } }>
									<Spinner />
								</div>
							: 	<>
									{ this.state.handle
										? <div style={ { margin: '20px 0' } }>
											<img src={ this.state.handle.logoUrl } width="100%" alt={ this.state.handle.companyName + ' Logo' } />
											<h3>{ this.state.handle.companyName }</h3>
										</div>
										: <div style={ { margin: '20px 0' } }>
											<img src={ 'images/logo.png' } width="100%" alt="Mobile Track Logo" />
										</div>
									}
								</>
						}

						<form style={ { marginTop: '40px' } } onSubmit={ this.logOut.bind(this) }>
							<h2>{ this.props.match.params.email }</h2>
							<p>This <strong>Email Address</strong> has not yet been setup, or an appropriate <strong>Role</strong> has not been assigned with the <strong><span className="text-capitalize">{ this.props.match.params.handle }</span></strong> account.  Please contact your system Administrator.</p>
							<br />
							<button type="submit" className="btn btn-primary block full-width m-b">LOG OUT & TRY AGAIN</button>
						</form>

					</div>
				</div>

			</div>
		);
	}
};
