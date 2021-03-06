import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';
import { Base64 } from 'js-base64';

export class Login extends React.Component {

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
		var user = this.props.firebase.auth().currentUser;
		if (user) {
			this.props.history.push(this.props.landing);
		} else if (this.props.match.params.handle !== 'default' && !this.state.handle?.id) {
			this.setState({ loading: true });
			this.props.dispatch(actions_authentication.verifyHandle(this.props.match.params.handle, this.props.firebase, (handleDoc) => {
				this.setState({ loading: false });
				if (handleDoc.exists) {
					this.setState({ handle: { ...handleDoc.data(), id: handleDoc.id }});
					if (this.props.match.params.base64) {
						let auth64 = Base64.decode(this.props.match.params.base64);
						let auth = auth64.split('|');
						this.setState({ email: auth[0], password: auth[1] }, () => {
							this.submitForm();
						});
					}
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
		if (event) event.preventDefault();
		this.setState({ authorizing: true });
		this.props.dispatch(actions_authentication.login(this.state.email, this.state.password, this.props.firebase, () => {
			this.setState({ authorizing: false });
		}));
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

						<form className="login-form" style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
							<div className="form-group">
								<input type="text" name="email" className="form-control" placeholder="Email Address" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
							</div>
							<div className="form-group">
								<input type="password" name="password" className="form-control" placeholder="Password" value={ this.state.password } onChange={ this.handleChange.bind(this) } autoComplete="off" />
							</div>
							{ !this.state.authorizing
								? <button type="submit" className="btn btn-primary block full-width m-b mt-4" disabled={ this.state.handle_pending }>LOGIN</button>
								: <div style={ { margin: '15px 0' } }><Spinner /></div>
							}
							
							<a onClick={ () => { this.props.history.push('/' + this.props.match.params.handle + '/register_user'); }}>Register a New User</a> &nbsp; | &nbsp;
							<a onClick={ () => { this.props.history.push('/' + this.props.match.params.handle + '/password_reset'); } }>Forgot password?</a>

						</form>
					</div>
				</div>

			</div>
		);
	}
};
