export function ModalAlert(options) {

	window.swal({
		title: options.title,
		text: options.text,
		type: options.type,
		showCancelButton: (options.show_cancel !== undefined) ? options.show_cancel : true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: (options.confirm_text !== undefined) ? options.confirm_text : "Yes, delete it!",
		closeOnConfirm: true,
	}, () => {
		if (typeof options.callback === 'function') options.callback();
	});

	return null;
}
