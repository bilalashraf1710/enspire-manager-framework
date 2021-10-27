import React from 'react';
import Modal from 'react-bootstrap4-modal';
import { Spinner } from './spinner';

export class ModalForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			expand: false,
		};
	}

	render() {

		var cancel_callback = (this.props.cancel_button_callback) ? this.props.cancel_button_callback : this.props.history.goBack;

		return (
			<Modal dialogClassName="modal-md" visible={ (this.props.visible === undefined) ? true : this.props.visible } className={ "animated fadeInDown " + (this.state.expand ? "expand-modal" : "shrink-modal") }>
				<div className="modal-header">
					<h3 className="modal-title">{ this.props.modal_header }</h3>
					<div className="expand-icon-position expand-icon-style">
						<i className="fas fa-expand-alt" onClick={ () => this.setState({ expand: !this.state.expand }) }></i>
					</div>
					<div className="close-icon-position close-icon-style">
						<i className="fas fa-times" onClick={ () => cancel_callback() }></i>
					</div>
				</div>
				<div className={ 'modal-footer ' + ((this.props.no_fade) ? ' no-fade' : '') + ((this.props.show_spinner) ? ' ibox-content sk-loading' : '') }>
					{ this.props.show_spinner &&
						<Spinner />
					}
					<div className="container">
						<div className="row">
							<div className="col-9">
								{ this.props.children }
							</div>
							<div className="col-3 py-3 d-flex flex-column" style={ { backgroundColor: '#eeeeee' } }>
								{ this.props.right_column }
								<p className="mb-auto">&nbsp;</p>
								{ this.props.delete_button_callback &&
									<button className="btn btn-warning btn-sm btn-block mb-2" type="button" onClick={ () => this.props.delete_button_callback() }>{ (this.props.delete_button_title) ? this.props.delete_button_title.toUpperCase() : 'DELETE' }</button>
								}
								<button className="btn btn-white btn-sm btn-block" type="button" onClick={ () => cancel_callback() }>{ this.props.cancel_button_title.toUpperCase() }</button>
								<button className="btn btn-primary btn-lg btn-block" type="button" onClick={ () => this.props.submitFormHandler() }>{ (this.props.save_button_title) ? this.props.save_button_title.toUpperCase() : 'SAVE CHANGES' }</button>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		);
	}
}
