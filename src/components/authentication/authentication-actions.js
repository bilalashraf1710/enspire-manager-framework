/*-----------------------------------------------*/
/* AUTHENTICATION
/*-----------------------------------------------*/

export function verifyHandle(handle, firebase, callback) {

	return dispatch => {

		firebase.firestore().collection('companies').doc(handle).get().then((doc) => {
			if (typeof callback === "function") callback(doc);
		}).catch((error) => {
			process_error(error, 'Verify Handle: ' + error.message);
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

		firebase.firestore().collection(handle).doc('company').get().then((doc) => {
			var results = { ...doc.data(), id: doc.id };

			dispatch({ type: 'COMPANY_FULFILLED', data: results });
			if (typeof callback === "function") callback();

		}).catch((error) => {
			process_error(error, 'Get Company: ' + error.message);
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
