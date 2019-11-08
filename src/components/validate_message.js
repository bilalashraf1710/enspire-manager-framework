export function ValidateMessage(error) {

	var error_message;

	// VALIDATION TYPES
	if (error.type == 'required') {
		error_message = "Field Required";

	} else if (error.type == 'numeric') {
		error_message = "Number Expected";
	
	} else if (error.type == 'email') {
		error_message = "Email Expected";
	}

	return error_message;
}
