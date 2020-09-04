/*-----------------------------------------------*/
/* AUTHENTICATION
/*-----------------------------------------------*/

export function verifyHandle(handle, firebase, callback) {

	return dispatch => {

		firebase.firestore().collection('companies').doc(handle).get().then((doc) => {
			if (typeof callback === "function") callback(doc.exists);
		}).catch((error) => {
			process_error(error, 'Get Company: ' + error.message);
		});
	}
}
export function login(email, password, firebase, callback) {

	return dispatch => {

		firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
			process_error(error, 'Login: ' + error.message);
			if (typeof callback === "function") callback();
		});
	}
}
export function logout(firebase, callback) {

	return dispatch => {

		firebase.auth().signOut().then(() => {
			if (typeof callback === "function") callback();
		}).catch((error) => {
			process_error(error, 'Logout: ' + error.message);
		});
	}
}
export function passwordReset(email, firebase, callback) {

	return dispatch => {

		firebase.auth().sendPasswordResetEmail(email).then(() => {
			if (typeof callback === "function") callback();
		}).catch((error) => {
			process_error(error, 'Password Reset: ' + error.message);
		});
	}
}
export function getCompany(handle, firebase, callback) {

	return dispatch => {

		dispatch({ type: 'COMPANY_PENDING' });

		firebase.firestore().collection('companies').doc(handle).get().then((doc) => {
			var results = { ...doc.data(), id: doc.id };

			dispatch({ type: 'COMPANY_FULFILLED', data: results });
			if (typeof callback === "function") callback();

		}).catch((error) => {
			process_error(error, 'Get Company: ' + error.message);
		});
	}
}
export function validateLogin(handle, user, firebase, callback) {

	return dispatch => {

		dispatch({ type: 'COMPANY_PENDING' });
		dispatch({ type: 'USERS_PENDING' });

		Promise.all([
			firebase.firestore().collection('companies').doc(handle).get(),
			firebase.firestore().collection('companies/' + handle + '/users').get(),
		]).then((query) => {

			var docCompany = { ...query[0].data(), id: query[0].id };

			var users = {};
			query[1].forEach((doc) => {
				users[doc.id] = doc.data();
			});

			dispatch({ type: 'COMPANY_FULFILLED', data: docCompany });
			dispatch({ type: 'USERS_FULFILLED', data: users });


			if (users[user.email]?.activated) {
				callback('success');
			} else {
				if (users[user.email]) {
					firebase.firestore().collection('companies/' + handle + '/users').doc(user.email).update({ activated: true }).then(() => {
						window.toastr.info('User Validated with ' + docCompany.name, 'VALIDATED!');
						if (typeof callback === "function") callback('success');
					}).catch((error) => {
						process_error(error, 'Validation Update: ' + error.message);
					});
				} else {
					if (typeof callback === "function") callback('not_found');
				}
			}

		}).catch((error) => {
			process_error(error, 'Validate Login: ' + error.message);
		});
	}
}
function process_error(error, message) {

	if (error.toString().includes('code 401')) {
		window.toastr.warning(error, 'UNAUTHORIZED!');
	} else {
		window.toastr.error(error, message);
	}
}
// export function validateUser(handle, user, callback) {

// 	return dispatch => {

// 		if (docUsers.activated?.includes(user.uid)) {
// 			callback('success');
// 		} else {
// 			if (docUsers.invited?.includes(user.email)) {
// 				firebase.firestore().collection('companies/' + handle + '/users').doc(handle).update({ activated: firebase.firebase.firestore().FieldValue.arrayUnion(user.uid) }).then(() => {
// 					window.toastr.info('User Validated with ' + docCompany.name, 'VALIDATED!');
// 					callback('success');
// 				}).catch((error) => {
// 					process_error(error, 'Validation Update: ' + error.message);
// 				});
// 			} else {
// 				callback('not_found');
// 			}
// 		}
// 	}
// }