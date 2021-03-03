import * as actions_authentication from './authentication-actions';
import React from 'react';
import { Spinner } from '../spinner';

export class NotAuthorized extends React.Component {

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

						<form style={ { marginTop: '40px' } } onSubmit={ () => { this.props.history.goBack(); }}>
							<h2 className="display-4">Not Authorized</h2>
							<p>You are not authorized to view this page.</p>
							<br />
							<button type="submit" className="btn btn-primary block full-width m-b">BACK TO PREVIOUS</button>
						</form>

					</div>
				</div>

			</div>
		);
	}
};
