import React from 'react';

export class Textarea extends React.Component {

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

			console.log(error);

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

			<div className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }><label>{ this.props.label }</label> 
				<textarea 
					autoComplete="off" 
					className="form-control" 
					name={ this.props.name } 
					onChange={ this.props.onChange.bind(this) } 
					placeholder={ this.props.placeholder } 
					ref={ this.field_ref } 
					rows={ this.props.rows }
					value={ this.props.value } 
				/>
				{ this.state.error_message &&
					<div className="invalid-feedback" style={{ display: 'block' }}>
						{ this.state.error_message }
					</div>
				}
			</div>
		);
	}
}
