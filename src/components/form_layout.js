import React, { Fragment } from 'react';
import { Input } from './input';
import { Select } from './select';

export class FormBuilder extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		var form_final = 

			<Fragment>
				{
					this.props.form.map((section, section_index) => {
						return (
							<div key={ 'section'+section_index } style={{ marginBottom: '20px' }}>
								{ section.section }
								<div className="form-row">
									{
										section.layout.map((field, field_index) => {

											var label = (field.label) ? field.label : field.field.replace(/_/g, ' ');
											var required = (field.valid) ? field.valid.includes('required') : false;

											var component;

											switch (field.type) {

												case 'email'	: 
												case 'date'		: 
												case 'text'		: {

													component =	<Input key={ 'field'+field_index }
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onChange={ this.props.callbacks.text } 
																	required={ required }
																	type="text" 
																	value={ (this.props.record[field.field] !== null) ? this.props.record[field.field] : '' } 
																/>
													break;
												}
												case 'select'	: {

													component =	<Select key={ 'field'+field_index }
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onChange={ this.props.callbacks.text } 
																	required={ required }
																	value={ (this.props.record[field.field] !== null) ? this.props.record[field.field] : '' } 
																>
																	{ field.options }
																</Select>
													break;
												}
											}

											return (
												<Fragment>
													{ component }
												</Fragment>
											);
										})
									}
								</div>
							</div>
						);
					})
				}
			</Fragment>

		return (

			<div>
				{ form_final }
			</div>
		);
	}
}
