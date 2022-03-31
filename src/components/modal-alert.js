const Swal = require('sweetalert2')

export function ModalAlert(options) {

    Swal.fire({
		title: options.title,
		text: options.text,
        icon:options.icon, // success, error, warning, info, question

        input: (options.input) ? options.input : null,
        inputLabel: (options.label) ? options.label : null,
        inputValue: (options.value) ? options.value : null,
        inputValidator: (options.validator) ? options.validator : null,

		showConfirmButton: (options.show_confirm == false) ? false : true,
        confirmButtonColor: (options.confirm_color) ? options.confirm_color : "#3085d6 ",
		confirmButtonText: (options.confirm_text) ? options.confirm_text : "Okay",

		showDenyButton: (options.show_deny) ? true : false,
        denyButtonColor: (options.deny_color) ? options.deny_color : "#dd6b55",
		denyButtonText: (options.deny_text) ? options.deny_text : "No, Thanks",
        
		showCancelButton: (options.show_cancel) ? true : false,
        cancelButtonColor: (options.cancel_color) ? options.cancel_color : "#dddddd",
		cancelButtonText: (options.cancel_text) ? options.cancel_text : "Cancel",

    }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
            if (typeof options.callback_success === 'function') options.callback_success();
        } else if (result.isDenied) {
            if (typeof options.callback_denied === 'function') options.callback_denied();
        } else {
            if (typeof options.callback_cancel === 'function') options.callback_cancel();
        }
    });

	return null;
}
