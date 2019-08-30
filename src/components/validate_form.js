export function ValidateForm(validations, setFormError) {

	var form_error = [];

	validations.forEach((validation, index) => {

		if (!validation.value) {
			form_error.push({ field: validation.field, type: 'required' });
		}
	});

	return form_error;
}
