import React from 'react';
import { ValidateMessage } from './validate_message';

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

			<span className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				<label className="checkbox-inline i-checks text-left" onClick={ (this.props.onClick) ? this.props.onClick.bind(this) : null } style={{ cursor: 'pointer' }}>
					<div className={ 'icheckbox_square-green '+((this.props.checked) ? 'checked':'') } style={{ position: 'relative' }}>
						<ins className="iCheck-helper" style={{ position: 'absolute', top: '0%', left: '0%', display: 'block', width: '100%', height: '100%', margin: '0px', padding: '0px', background: 'rgb(255, 255, 255)', border: '0px', opacity: 0 }} />
					</div>
					<span style={{ padding: '0 25px 0 8px' }}>{ this.props.label }</span> 
					{ this.state.error_message &&
						<span className="invalid-feedback" style={{ display: 'block' }}>
							{ this.state.error_message }
						</span>
					}
				</label>
			</span>
		);
	}
}
