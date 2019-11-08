import React from 'react';
import { ValidateMessage } from './validate_message';

export class Select extends React.Component {

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
				<label>{ this.props.label + ((this.props.required)?' *':'') }</label> 
				<select 
					className="form-control" 
					name={ this.props.name } 
					onChange={ this.props.onChange.bind(this) } 
					ref={ this.field_ref } 
					value={ this.props.value } 
				>
					{ this.props.children }
				</select>
				{ this.state.error_message &&
					<div className="invalid-feedback" style={{ display: 'block' }}>
						{ this.state.error_message }
					</div>
				}
			</div>
		);
	}
}
