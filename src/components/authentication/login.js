import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';


export class Login extends React.Component {

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
		var user = this.props.firebase.auth().currentUser;
		if (user) {
			this.props.history.push(this.props.landing);
		} else if (this.props.match.params.handle !== 'default' && !this.props.company.company?.id) {
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
							? <div style={ { margin: '60px 0' } }>
								<Spinner />
							</div>
							: <>
								{ this.props.company.company
									? <div style={ { margin: '20px 0' } }>
										<img src={ this.props.company.company.logoUrl } width="100%" alt={ this.props.company.company.companyName + ' Logo' } />
										<h3>{ this.props.company.company.companyName }</h3>
									</div>
									: <div style={ { margin: '20px 0' } }>
										<img src={ 'images/logo.png' } width="100%" alt="Mobile Track Logo" />
									</div>
								}
							</>
						}

						<form style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
							<div className="form-group">
								<input type="text" name="email" className="form-control" placeholder="Email Address" value={ this.state.email } onChange={ this.handleChange.bind(this) } />
							</div>
							<div className="form-group">
								<input type="password" name="password" className="form-control" placeholder="Password" value={ this.state.password } onChange={ this.handleChange.bind(this) } autoComplete="off" />
							</div>
							{ !this.state.authorizing
								? <button type="submit" className="btn btn-primary block full-width m-b" disabled={ this.props.company.company_pending }>Login</button>
								: <div style={ { margin: '15px 0' } }><Spinner /></div>
							}

							<a onClick={ () => { this.props.history.push('/' + this.props.match.params.handle + '/password_reset'); } }>Forgot password?</a>

						</form>
					</div>
				</div>

			</div>
		);
	}
};
