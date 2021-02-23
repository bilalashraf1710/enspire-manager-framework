import React from 'react';
import Modal from 'react-bootstrap4-modal';

export class ModalForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			expand: false,
		};
	}

	render() {

		return (
			<Modal dialogClassName="modal-md" visible={ true } className={ "animated fadeInDown " + (this.state.expand ? "expand-modal" : "shrink-modal") }>
				<div className="modal-header">
					<h3 className="modal-title">{ this.props.modal_header }</h3>
					<div className="expand-icon-position expand-icon-style">
						<i className="fas fa-expand-alt" onClick={ () => this.setState({ expand: !this.state.expand }) }></i>
					</div>
					<div className="close-icon-position close-icon-style">
						<i className="fas fa-times" onClick={ () => this.props.history.goBack() }></i>
					</div>
				</div>
				<div className="modal-body">
					{ this.props.children }
				</div>
				<div className="modal-footer">
					<button className="btn btn-white btn-sm" type="button" onClick={ () => this.props.history.goBack() }>{ this.props.cancel_button_title }</button>
					<button className="btn btn-primary btn-sm" type="button" onClick={ () => this.props.submitFormHandler() }>{ this.props.save_button_title }</button>
				</div>
			</Modal>
		);
	}
}
