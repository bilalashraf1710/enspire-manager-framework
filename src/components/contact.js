import React from 'react';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';

var _ = require('lodash');

export class Contact extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
		};
	}

	componentDidMount() {
		this.setState({ isOpen: (this.props.open || !this.props.user.activated) ? this.props.open : false });
	}

	render() {

		var typeName = _.find(this.props.contactTypes, { id: this.props.contact.contactTypeId })?.name;

		return (

			<div>
				<div onClick={ () => { this.setState({ isOpen: !this.state.isOpen }) } } style={ { cursor: 'pointer', marginBottom: '7px', paddingBottom: '1px' } }>
					{ this.state.isOpen
						? <span className="float-right px-1" style={ { fontSize: '16px' } }><i className="fas fa-angle-up"></i></span>
						: <span className="float-right px-1" style={ { fontSize: '16px' } }><i className="fas fa-angle-down"></i></span>
					}
				</div>

				<i className="fas fa-user"></i> &nbsp;<strong>{ typeName + ': ' }</strong>
				{ this.props.contact.firstName + ' ' + this.props.contact.lastName }

				{ this.state.isOpen &&
					<div>
						{ this.props.editCallback &&
							<span className="float-right position-absolute" style={ { fontSize: '16px', right: '40px' } }>
								<a onClick={ () => { this.props.editCallback(this.props.contact.id) } }>
									<i className="fas fa-pencil-alt" style={ { color: '#c4c4c4' } }></i>
								</a>
							</span>
						}
						{ this.props.contact.phone &&
							<div className="mt-1"><i className="fas fa-phone"></i> &nbsp; { this.props.contact.phone }</div>
						}
						{ this.props.contact.mobile &&
							<div className="mt-1"><i className="fas fa-mobile"></i> &nbsp; { this.props.contact.mobile }</div>
						}
						{ this.props.contact.email &&
							<div className="mt-1"><i className="fas fa-envelope"></i> &nbsp; { this.props.contact.email }</div>
						}

						{ this.props.user?.roles?.procurement?.length > 0 &&
							<div className="pl-3 mt-3">
								<p><strong className="mr-2">Portal Activation:</strong>
									{ this.props.user.roles.procurement.includes('0') &&
										<span className="label ml-2 bg-secondary text-white">Administrator</span>
									}
									{ this.props.user.roles.procurement.includes('1') &&
										<span className="label ml-2 bg-secondary text-white">Dispatcher</span>
									}
									{ this.props.user.roles.procurement.includes('2') &&
										<span className="label ml-2 bg-secondary text-white">Technician</span>
									}
									{ this.props.user.roles.procurement.includes('5') &&
										<span className="label ml-2 bg-secondary text-white">Customer</span>
									}
									{ this.props.user.roles.procurement.includes('3') &&
										<span className="label ml-2 bg-secondary text-white">Supplier</span>
									}
									{ this.props.user.roles.procurement.includes('4') &&
										<span className="label ml-2 bg-secondary text-white">Truck Driver</span>
									}
									{ this.props.user.activated
										? <span className="label ml-2" style={ { backgroundColor: 'limeGreen', color: 'white' } }>Activated</span>
										: <span className="label label-warning ml-2">Inactive</span>
									}
								</p>

								{ true && //this.props.admin &&
									<>
										{ this.props.user.activated && this.props.sendPasswordReset && this.props.sendInvite
											? <button className="btn btn-default btn-sm float-right" type="button" onClick={ this.props.sendPasswordReset.bind(this, this.props.user) }>Send Password Reset Email
                                                { this.props.sendPending &&
													<span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>
												}
											</button>
											: <div className="float-right text-right">
												<button className="btn btn-primary btn-sm btn-outline mb-2" type="button" onClick={ this.props.sendInvite.bind(this, this.props.user) }>Send Invitation Email
													{ this.props.sendPending &&
														<span className="spinner-border spinner-border-sm ml-2" role="status" aria-hidden="true"></span>
													}
												</button>
												<br/>
												Trouble receiving email?
												<CopyToClipboard text={ encodeURI('https://manage.mobiletrack.systems/procurement/#/' + this.props.handle + '/register_user/' + this.props.contact.firstName + '/' + this.props.contact.lastName + '/' + this.props.contact.email) } onCopy={ () => window.toastr.success('The Registration link has been successfully copied to your clipboard.', 'Link Copied!') }>
													<button className="btn btn-secondary btn-xs btn-outline ml-2" type="button">Copy Link</button>
												</CopyToClipboard>
											</div>
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
						}
						<div style={{ clear: 'both' }} />

						<hr />
					</div>
				}
			</div>
		);
	}
}
