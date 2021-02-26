import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';

export class Register extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            first_name: '',
            last_name: '',
			email: '',
			password: '',
            verify_password: '',
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
        const email = this.state.email;
        const password = this.state.password;
        const handle = this.state.handle;

        if (this.state.password !== this.state.verify_password || this.state.password === '' || this.state.verify_password === '') {
            document.getElementById('password').style = "border: 1px solid red";
            document.getElementById('verify-password').style = "border: 1px solid red";
            window.toastr.error('Password do not match');
        }
        else if(this.state.password === this.state.verify_password && this.state.password !== '' && this.state.verify_password !== '') {
            this.setState({ authorizing: true });
            this.props.dispatch(actions_authentication.register(email, password, handle.id, this.props.firebase, () => {
                this.setState({ authorizing: false });
            }));
        }
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

						<form style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
                            <div className="form-group">
								<input type="text" name="first_name" className="form-control" placeholder="First Name" value={ this.state.first_name } onChange={ this.handleChange.bind(this) } />
							</div>
                            <div className="form-group">
								<input type="text" name="last_name" className="form-control" placeholder="Last Name" value={ this.state.last_name } onChange={ this.handleChange.bind(this) } />
							</div>
                            <div className="form-group">
								<input type="text" name="email" className="form-control" placeholder="Email Address" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
							</div>
							<div className="form-group">
								<input type="password" id="password" name="password" className="form-control" placeholder="Password" value={ this.state.password } onChange={ this.handleChange.bind(this) } autoComplete="off" />
							</div>
                            <div className="form-group">
								<input type="password" id="verify-password" name="verify_password" className="form-control" placeholder="Verify Password" value={ this.state.verify_password } onChange={ this.handleChange.bind(this) } autoComplete="off" />
							</div>
							{ !this.state.authorizing
								? <button type="submit" className="btn btn-primary block full-width m-b" disabled={ this.state.handle_pending }>REGISTER NEW USER</button>
								: <div style={ { margin: '15px 0' } }><Spinner /></div>
                            }
						</form>
					</div>
				</div>

			</div>
		);
	}
};