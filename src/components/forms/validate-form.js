import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';

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

    return form_error;

	function validate(field, record) {

        var value = null;

		if (field.type != 'skip') {

            /* Required -----------------------------------------*/
            if (field.valid && field.valid.includes('required') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (typeof value == 'string') value = value.trim();
                if (!value) form_error.push({ field: field.field, type: 'required' });
            }

            /* Empty -----------------------------------------*/
            if (field.valid && field.valid.includes('empty') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (typeof value == 'string') value = value.trim();
                if (value) form_error.push({ field: field.field, type: 'empty' });
            }

            /* numeric -----------------------------------------*/
            if (field.valid && field.valid.includes('numeric') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (value && isNaN(value)) {
                    form_error.push({ field: field.field, type: 'numeric' });
                }
            }

            /* email -----------------------------------------*/
            if (field.valid && field.valid.includes('email') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (value && !isEmail(value)) {
                    form_error.push({ field: field.field, type: 'email' });
                }
            }

            /* phone -----------------------------------------*/
            if (field.valid && field.valid.includes('phone') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (value && !isMobilePhone(value)) {
                    form_error.push({ field: field.field, type: 'phone' });
                }
            }

            /* leading_zeros -----------------------------------------*/
            if (field.valid && field.valid.includes('leading_zeros') && !field.disabled) {
                value = (typeof record[field.field] == 'string') ? record[field.field].trim() : record[field.field];
                if (field.type == 'text' || field.type == 'textarea') {
                    if (value.toString().startsWith('0')) {
                        form_error.push({ field: field.field, type: 'leading_zeros' });
                    }
                } else {
                    console.error('EM Validation: leading_zeros validation applies only to text or textarea fields');
                }
            }
            
            /* Additional Validations here ----------------------*/
            /* ... */
            // console.log(form_error);
        }
	}

}
