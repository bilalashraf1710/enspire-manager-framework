import React from 'react';

var _ = require('lodash');

export class Input extends React.Component {

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
			var error_message;

			if (error && !this.state.error) {

				if (this.props.form_error[0].field === this.props.name) this.field_ref.current.focus();
				
				// VALIDATION TYPES
				if (error.type == 'required') {
					error_message = "Field Required";
					if (this.props.form_error[0].field === this.props.name) window.toastr.error('Please enter a value for <em>'+this.props.label+'</em>', 'Field Required!');
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
				<label>{ this.props.label + ((this.props.required)?' *':'') }</label> 
				<div className={ 'input-group ' + this.props.classInputGroup }>
					{ this.props.prepend &&
						<div className="input-group-prepend">
							<span className="input-group-text input-group-addon">{ this.props.prepend }</span>
						</div>
					}
					<input 
						autoComplete="off" 
						className="form-control" 
						defaultValue={ this.props.defaultValue }
						name={ this.props.name } 
						onChange={ this.props.onChange.bind(this) } 
						placeholder={ this.props.placeholder } 
						ref={ this.field_ref } 
						type="text" 
						value={ this.props.value } 
					/>
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
