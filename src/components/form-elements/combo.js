import React from 'react';
import { ValidateMessage } from './validate-message';
import _ from 'lodash';

export class Combo extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			error_message: null,
		};
		this.field_ref = React.createRef();
	}

	componentDidMount() {

	}
	componentDidUpdate() {
		if (this.props.form_error !== undefined) {

			var error = _.find(this.props.form_error, { field: this.props.name })

			if (error && !this.state.error) {

				var error_message = ValidateMessage(error);

				if (this.props.form_error[0].field === this.props.name) {
					this.field_ref.current.focus();
					window.toastr.error('Please update your value for <em>'+this.props.label+'</em>', error_message);
				}
				
				this.setState({ error: true, error_message });

			} else if (!error && this.state.error) {
				this.setState({ error: false, error_message: null });
			}
		}
	}

	render() {

		return (

			<div className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				{ this.props.label !== undefined &&
					<label>{ this.props.label + ((this.props.required)?' *':'') }</label> 
				}
				<div className="input-group">
					{ this.props.position == 'start' &&
						<div className="input-group-append">
							<button className={ 'btn ' + this.props.buttonClass } type="button" id="button-addon2" onClick={ this.props.onClick.bind(this, this.props.name) }>{ this.props.buttonText }</button>
						</div>
					}
					<input 
						autoComplete="off" 
						className="form-control form-control-sm" 
						name={ this.props.name } 
						onChange={ this.props.onChange.bind(this) } 
						placeholder={ this.props.placeholder } 
						ref={ this.field_ref } 
						type="text"
						value={ this.props.value } 
						disabled={ this.props.disabled }
					/>
					{ this.props.position == 'end' &&
						<div className="input-group-append">
							<button className={ 'btn ' + this.props.buttonClass } type="button" id="button-addon2" onClick={ this.props.onClick.bind(this, this.props.name) }>{ this.props.buttonText }</button>
						</div>
					}
				</div>
				{ this.state.error_message &&
					<div className="invalid-feedback" style={{ display: 'block' }}>
						{ this.state.error_message }
					</div>
				}
			</div>
		);
	}
}
