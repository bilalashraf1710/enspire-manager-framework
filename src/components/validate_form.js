export function ValidateForm(record, form_builder_layout) {

	var form_error = [];

	form_builder_layout.forEach((section, section_index) => {
		section.layout.forEach((field, field_index) => {
			validate(field, record, form_error);
		});
	});

	function validate(field, record) {

		/* Required -----------------------------------------*/
		 if (field.valid && field.valid.includes('required') && !record[field.field]) {
			form_error.push({ field: field.field, type: 'required' });
		 }

		/* Additional Validations here ----------------------*/
		/* ... */
		// console.log(form_error);
	}

	return form_error;
}
