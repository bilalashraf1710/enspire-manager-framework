import React from 'react';
import Modal from 'react-bootstrap4-modal';
import { Spinner } from './spinner';

export class ModalForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			expand: (this.props.expand) ? true : false,
		};
	}

	handleExpand() {
		this.setState({ expand: !this.state.expand }, () => {
			if (typeof this.props.onExpand === 'function') this.props.onExpand(this.state.expand);
		});
	}
	handleSubmit() {
		if (typeof this.props.submitFormHandler === 'function') this.props.submitFormHandler();
	}
	handleDelete() {
		if (typeof this.props.delete_button_callback === 'function') this.props.delete_button_callback();
	}

	render() {

        var height = (this.props.full_height) ? { height: '80vh' } : { maxHeight: '80vh', minHeight: '300px' };

		var cancel_callback = (this.props.cancel_button_callback) ? this.props.cancel_button_callback : this.props.history.goBack;

		return (
			<Modal dialogClassName="modal-md" visible={ (this.props.visible === undefined) ? true : this.props.visible } className={ "animated fadeInDown " + (this.state.expand ? "expand-modal" : "shrink-modal") }>
				<div className="modal-header">
					<h3 className="modal-title">{ this.props.modal_header }</h3>
					{ this.props.expandable &&
						<div className="expand-icon-position expand-icon-style">
							<i className="fas fa-expand-alt" onClick={ this.handleExpand.bind(this) }></i>
						</div>
					}
					<div className="close-icon-position close-icon-style">
						<i className="fas fa-times" onClick={ () => cancel_callback() }></i>
					</div>
				</div>
				<div className={ 'modal-footer ' + ((this.props.no_fade) ? ' no-fade' : '') + ((this.props.show_spinner) ? ' ibox-content sk-loading' : '') }>
					{ this.props.show_spinner &&
						<Spinner />
					}
					<div className="container-fluid">
						<div className="row">
							<div className={ 'col-' + ((this.state.expand) ? 10 : 9) } style={ { ...height, overflowY: 'scroll' } }>
								{ this.props.children }
							</div>
							<div className={ 'py-3 d-flex flex-column col-' + ((this.state.expand) ? 2 : 3) } style={ { backgroundColor: '#eeeeee' } }>
								{ this.props.right_column }
								<p className="mb-auto">&nbsp;</p>
								{ this.props.delete_button_callback &&
									<button className="btn btn-warning btn-sm btn-block mb-2" type="button" onClick={ this.handleDelete.bind(this) }>{ (this.props.delete_button_title) ? this.props.delete_button_title.toUpperCase() : 'DELETE' }</button>
								}
								<button className="btn btn-white btn-sm btn-block" type="button" onClick={ () => cancel_callback() }>{ this.props.cancel_button_title.toUpperCase() }</button>
								<button className="btn btn-primary btn-sm btn-block" type="button" onClick={ this.handleSubmit.bind(this) }>{ (this.props.save_button_title) ? this.props.save_button_title.toUpperCase() : 'SAVE CHANGES' }</button>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}
