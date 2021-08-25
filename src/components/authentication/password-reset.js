import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';

export class PasswordReset extends React.Component {

	constructor(props) {
		super(props);
		this.state = { 
			email: '',
			password: '',
			loading: false,
			authorizing: false,
			handle: {},
		};
	}
	componentDidMount() {
		if (this.props.match.params.handle !== 'default' && !this.props.company.company?.id) {
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
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	submitForm(event) {
		event.preventDefault();
		this.setState({ authorizing: true });
		this.props.dispatch(actions_authentication.passwordReset(this.state.email, this.props.firebase,() => {
			this.setState({ authorizing: false });
			this.props.history.goBack();
		}));
	}

	render() {

		return (

			<div id="wrapper" className="gray-bg" style={{ paddingBottom: '300px' }}>

				<div className="middle-box text-center loginscreen animated fadeInDown">
					<div>
					{ this.state.loading
						?	<div style={{ margin: '60px 0' }}>
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
						
						
						<p>If you have an existing login with our system and cannot remember your password, please enter your Email address below.</p>
						<p>A link for changing your password will be sent.</p>
						
						<form className="reset-form" style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
							<div className="form-group">
								<input type="text" name="email" className="form-control" placeholder="Email Address" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
							</div>
							{ !this.state.authorizing
								? <button type="submit" className="btn btn-primary block full-width m-b" disabled={ this.props.company.company_pending }>Send Password Reset</button>
								: <div style={{ margin: '15px 0' }}><Spinner /></div>
							}
						</form>
					</div>
				</div>

			</div>
		);
	}
};

