const Swal = require('sweetalert2')

export function ModalAlert(options) {

    Swal.fire({
		title: options.title,
		text: options.text,
        icon:options.icon, // success, error, warning, info, question
		showCancelButton: (options.show_cancel) ? true : false,
		confirmButtonColor: (options.confirm_color) ? options.confirm_color : "#DD6B55",
        cancelButtonColor: '#dddddd',
		confirmButtonText: (options.confirm_text) ? options.confirm_text : "Okay",
    }).then((result) => {
        if (result.isConfirmed) {
            if (typeof options.callback_success === 'function') options.callback_success();
        } else {
            if (typeof options.callback_cancel === 'function') options.callback_cancel();
        }
    });

	return null;
}
