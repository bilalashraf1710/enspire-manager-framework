import React from 'react';
import { ValidateMessage } from './validate_message';
import DatePicker from "react-datepicker";

var _ = require('lodash');
var moment = require('moment'); 

export class Input extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			error_message: null,
		};
		this.field_ref = React.createRef();
	}

	componentDidUpdate() {
		if (this.props.form_error !== undefined) {

			var error = _.find(this.props.form_error, { field: this.props.name })

			if (error && !this.state.error) {

				var error_message = ValidateMessage(error);

				if (this.props.form_error[0].field === this.props.name) {
					if (this.field_ref.current) this.field_ref.current.focus();
					window.toastr.error('Please update your value for <em>'+this.props.label+'</em>', error_message);
				}
				
				this.setState({ error: true, error_message });

			} else if (!error && this.state.error) {
				this.setState({ error: false, error_message: null });
			}
		}
	}

	render() {

		// input CANNOT have both value and defaultValue
		var inputProps = {};
		if (this.props.defaultValue) inputProps.defaultValue = this.props.defaultValue;
		else if (this.props.value !== undefined) inputProps.value = this.props.value;

		var selected = (this.props.type === 'date' && this.props.defaultValue !== null) ? moment(this.props.defaultValue).toDate() : '';

		return (

			<div className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				
				{ this.props.label !== undefined &&
					<label>{ this.props.label + ((this.props.required)?' *':'') }</label> 
				}
				
				<div className={ 'input-group ' + ((this.props.type === 'date') ? 'date '+this.props.name : '') }>
					{ this.props.prepend &&
						<div className="input-group-prepend">
							<span className="input-group-text input-group-addon">{ this.props.prepend }</span>
						</div>
					}
					{ this.props.type !== 'date'
						?	<input 
								autoComplete="off" 
								className="form-control" 
								name={ this.props.name } 
								onChange={ this.props.onChange.bind(this) } 
								placeholder={ this.props.placeholder } 
								readOnly={ this.props.readOnly }
								ref={ this.field_ref } 
								type="text"
								{ ...inputProps }
							/>
						:	<DatePicker
								className="form-control" 
								dateFormat="yyyy-MM-dd"
								selected={ selected }
								onChange={ this.props.onChange.bind(this, this.props.name) }
							/>
					}
					{ this.props.append &&
						<div className="input-group-append">
							<span className="input-group-text input-group-addon">{ this.props.append }</span>
						</div>
					}
					{ this.state.error_message &&
						<div className="invalid-feedback" style={{ display: 'block' }}>
							{ this.state.error_message }
						</div>
					}
				</div>
			</div>
		);
	}
}
