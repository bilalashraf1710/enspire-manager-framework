import React from 'react';
import { Avatar } from './avatar';

export function UserProfile(props) {

	var user = props.user;
	var email = props.email.split('@');

	var roles = [];

	if (user?.roles) {
		user.roles.forEach((roleId) => {
			let role = _.find(props.userRoles, (o) => { return o.id == roleId });
			roles.push(role.name);
		});
	}

	return (

		<div className="mt-4 text-center" style={ { width: '220px', color: '#a7b1c2' } }>
			{ user && 
				<>
					<Avatar className="mx-auto" size={ 90 } image={ user.photoUrl } border='4px solid white' />

					<a data-toggle="dropdown" className="dropdown-toggle no-caret" href="#">
						<h3 style={ { color: 'white', marginTop: '20px' } }>{ user.firstName + ' ' + user.lastName } <b className="caret"></b></h3>
					</a>
					<ul className="dropdown-menu animated fadeInRight m-t-xs" style={ { marginLeft: 'auto', marginRight: 'auto', left: '15px', right: '15px' } }>
						<li><a className="dropdown-item" href="#">Profile</a></li>
						<li><a className="dropdown-item" href="#">Contacts</a></li>
						<li><a className="dropdown-item" href="#">Mailbox</a></li>
						<li className="dropdown-divider"></li>
						<li><a className="dropdown-item" href="#">Logout</a></li>
					</ul>

					<p>{ email[0] }<br />{ '@' + email[1] }</p>
					<p>{ roles.join(', ') }</p>
				</>
			}
		</div>
	);
}
