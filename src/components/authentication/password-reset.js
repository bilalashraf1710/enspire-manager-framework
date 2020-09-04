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
		};
	}
	componentDidMount() {
		if (this.props.match.params.handle !== 'default' && !this.props.auth.company?.id) {
			this.setState({ loading: true });
			this.props.dispatch(actions_authentication.getCompany(this.props.match.params.handle, this.props.firebase, () => {
				this.setState({ loading: false });
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
								{ this.props.auth.company
									? 	<div style={{ margin: '20px 0' }}>
											<img src={this.props.auth.company.logo} width="100%" alt={this.props.auth.company.name + ' Logo'} />
											<h3>{this.props.auth.company.name}</h3>
										</div>
									: 	<div style={{ margin: '20px 0' }}>
											<img src={'images/logo.png'} width="100%" alt="Mobile Track Logo" />
										</div>
								}
							</>
					}	
						
						
						<p>If you have an existing login with our system and cannot remember your password, please enter your Email address below.</p>
						<p>An option for changing your password will be sent.</p>
						
						<form style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
							<div className="form-group">
								<input type="text" name="email" className="form-control" placeholder="Email Address" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
							</div>
							{ !this.state.authorizing
								? <button type="submit" className="btn btn-primary block full-width m-b" disabled={ this.props.auth.company_pending }>Send Password Reset</button>
								: <div style={{ margin: '15px 0' }}><Spinner /></div>
							}
						</form>
					</div>
				</div>

			</div>
		);
	}
};

