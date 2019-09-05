import React from 'react';

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

	componentDidMount() {
		$('.input-group.date.'+this.props.name).datepicker({
			todayBtn: "linked",
			keyboardNavigation: false,
			forceParse: false,
			calendarWeeks: true,
			autoclose: true,
			format: 'yyyy-mm-dd',
			defaultViewDate: this.props.defaultValue,
		}).on('changeDate', (event) => {
			var e = {
				target: { 
					name: this.props.name,
					value: moment(event.date).format('YYYY-MM-DD'), 
				},
			};
			this.props.onChange(e);
			// this.setState({ ...this.state, permit: { ...this.state.permit, [event.target.lastChild.name]: moment(event.date).format('YYYY-MM-DD') } });
		});
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

		// input CANNOT have both value and defaultValue
		var inputProps = {};
		if (this.props.defaultValue) inputProps.defaultValue = this.props.defaultValue;
		else if (this.props.value !== undefined) inputProps.value = this.props.value;

		return (

			<div className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				<label>{ this.props.label + ((this.props.required)?' *':'') }</label> 
					<div className={ 'input-group ' + ((this.props.type === 'date') ? 'date '+this.props.name : '') }>
					{ this.props.prepend &&
						<div className="input-group-prepend">
							<span className="input-group-text input-group-addon">{ this.props.prepend }</span>
						</div>
					}
					<input 
						autoComplete="off" 
						className="form-control" 
						name={ this.props.name } 
						onChange={ this.props.onChange.bind(this) } 
						placeholder={ this.props.placeholder } 
						ref={ this.field_ref } 
						type="text" 
						{ ...inputProps }
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
