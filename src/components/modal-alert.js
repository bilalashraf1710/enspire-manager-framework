export function ModalAlert(options) {

	window.swal({
		title: options.title,
		text: options.text,
		type: options.type,
		showCancelButton: (options.show_cancel !== undefined) ? options.show_cancel : true,
		confirmButtonColor: (options.confirm_color !== undefined) ? options.confirm_color : "#DD6B55",
		confirmButtonText: (options.confirm_text !== undefined) ? options.confirm_text : "Yes, delete it!",
		cancelButtonText: (options.cancel_text !== undefined) ? options.cancel_text : "Cancel",
		closeOnConfirm: true,
	}, (result) => {
		if (result) {
			if (typeof options.callback_success === 'function') options.callback_success();
		} else {
			if (typeof options.callback_cancel === 'function') options.callback_cancel();
		}
	});

	return null;
}
