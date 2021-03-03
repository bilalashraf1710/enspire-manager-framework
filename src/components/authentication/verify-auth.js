import * as actions_authentication from './authentication-actions';
import React from 'react';
import { NotAuthorized } from './not-authorized';

export class VerifyAuth extends React.Component {

	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount() {
	}

	hasRoles(userRoles, roles) {
		var result = false;
		if (userRoles && Array.isArray(userRoles)) roles.forEach((role) => {
			if (userRoles.includes(role)) result = true;
		});
		return result;
	}

	render() {

		return (
			<>

				{ this.hasRoles(this.props.users?.user?.roles?.[this.props.app], this.props.roles)

					? 	<>{ this.props.children }</>
					:	<>
							{ this.props.users?.user?.roles?.[this.props.app] &&
								<NotAuthorized  firebase={ this.props.firebase } { ...this.props } />
							}
						</>
				}
			</>
		);
	}
};
