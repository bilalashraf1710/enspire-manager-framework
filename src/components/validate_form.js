import isEmail from 'validator/lib/isEmail';
import isNumeric from 'validator/lib/isNumeric';

export function ValidateForm(record, form_builder_layout) {

	var form_error = [];

	if (form_builder_layout[0].body) {

		form_builder_layout.forEach((column, section_index) => {
			column.body.forEach((section, section_index) => {
				section.layout.forEach((field, field_index) => {
					validate(field, record, form_error);
				});
			});
		});

	} else if (form_builder_layout[0].block) {

		form_builder_layout.forEach((block, block_index) => {
			block.block.forEach((column, section_index) => {
				column.body.forEach((section, section_index) => {
					section.layout.forEach((field, field_index) => {
						validate(field, record, form_error);
					});
				});
			});
		});
	}

	function validate(field, record) {

		var value = null;
		if (record[field.field]) {
			value = (isNaN(record[field.field])) ? record[field.field].trim() : parseInt(record[field.field]);
		}

		/* Required -----------------------------------------*/
		if (field.valid && field.valid.includes('required')) {
			if (record[field.field]) {
				if (!value) form_error.push({ field: field.field, type: 'required' });
			} else {
				form_error.push({ field: field.field, type: 'required' });
			}
		}

		/* numeric -----------------------------------------*/
		if (field.valid && field.valid.includes('numeric') && value && isNaN(value)) {
			form_error.push({ field: field.field, type: 'numeric' });
		}

		/* email -----------------------------------------*/
		if (field.valid && field.valid.includes('email') && value && !isEmail(value)) {
			form_error.push({ field: field.field, type: 'email' });
		}

		/* Additional Validations here ----------------------*/
		/* ... */
		// console.log(form_error);
	}

	return form_error;
}
