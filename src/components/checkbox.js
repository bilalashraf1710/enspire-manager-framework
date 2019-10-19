import React from 'react';

export class Checkbox extends React.Component {

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

			<span className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				<label className="checkbox-inline i-checks" onClick={ (this.props.onClick) ? this.props.onClick.bind(this) : null } style={{ cursor: 'pointer' }}>
					<div className={ 'icheckbox_square-green '+((this.props.checked) ? 'checked':'') } style={{ position: 'relative' }}>
						<ins className="iCheck-helper" style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: 0 }} />
					</div>
					<span style={{ padding: '0 25px 0 8px' }}>{ this.props.label }</span> 
				</label>
				{ this.state.error_message &&
					<div className="invalid-feedback" style={{ display: 'block' }}>
						{ this.state.error_message }
					</div>
				}
			</span>
		);
	}
}
