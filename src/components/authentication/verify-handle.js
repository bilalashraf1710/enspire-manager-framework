import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';

export class VerifyHandle extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			handle: '',
			verifying: false,
		};
	}

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	submitForm(event) {
		event.preventDefault();
		if (this.state.handle.length > 0) {
			this.setState({ verifying: true });
			this.props.dispatch(actions_authentication.verifyHandle(this.state.handle, this.props.firebase, (handleDoc) => {
				this.setState({ verifying: false });
				if (handleDoc.exists) {
					this.props.history.push('/' + this.state.handle);
				} else {
					window.toastr.error('This company handle cannot be found.  Please check for errors and try again.', 'Not Found');
				}
			}));
		}
	}

	render() {

		return (

			<div id="wrapper" className="gray-bg" style={ { paddingBottom: '300px' } }>

				<div className="middle-box text-center loginscreen animated fadeInDown">
					<div>
						<div style={ { margin: '20px 0' } }>
							<img src={ 'images/logo.png' } width="100%" alt="Mobile Track Logo" />
						</div>

						<form className="register-company" style={ { marginTop: '40px' } } onSubmit={ this.submitForm.bind(this) }>
							<div className="form-group">
								<input type="text" name="handle" className="form-control" placeholder="Company Handle" value={ this.state.handle } onChange={ this.handleChange.bind(this) } />
							</div>
							{ !this.state.verifying
								? <button type="submit" className="btn btn-primary block full-width m-b">Submit</button>
								: <div style={ { margin: '15px 0' } }><Spinner /></div>
							}

							<a onClick={ () => { this.props.history.push('/') } }>Register my Company (Coming Soon)</a>

						</form>
					</div>
				</div>
			</div>
		);
	}
};
