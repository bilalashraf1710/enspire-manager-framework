import React, { Fragment } from 'react';
import { Input } from './input';
import { Select } from './select';
import { Checkbox } from './checkbox';
import { Textarea } from './textarea';


export class FormBuilder extends React.Component {
	// FILENAME MUST NOT BE "FORM_BUILDER" FOR SOME UNKNOWN REASON

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

											var label;
											if  (!Array.isArray(field.field)) label = (field.label) ? field.label : field.field.replace(/_/g, ' ');
											var required = (field.valid) ? field.valid.includes('required') : false;

											var component;

											switch (field.type) {

												case 'email'	: 
												case 'date'		: 
												case 'text'		: {

													component =	<Input key={ 'input'+section_index+field_index }
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onChange={ this.props.callbacks.text } 
																	required={ required }
																	type="text" 
																	value={ (this.props.record[field.field]) ? this.props.record[field.field] : '' } 
																/>
													break;
												}
												case 'select'	: {

													component =	<Select key={ 'select'+section_index+field_index }
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onChange={ this.props.callbacks.text } 
																	required={ required }
																	value={ (this.props.record[field.field]) ? this.props.record[field.field] : '' } 
																>
																	{ field.options }
																</Select>
													break;
												}
												case 'textarea' : {
													
													component = <Textarea 
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onChange={ this.props.callbacks.text } 
																	required={ required }
																	rows={ (field.rows) ? fild.rows : '4' }
																	value={ (this.props.record[field.field]) ? this.props.record[field.field] : '' } 
																/>
													break;
												}
												case 'checkbox' : {

													component = <Checkbox key={ 'checkbox'+section_index+field_index }
																	checked={ (this.props.record[field.field]) ? (this.props.record[field.field] == 1) : false } 
																	className={ field.grid } 
																	form_error={ this.props.form_error } 
																	label={ label } 
																	name={ field.field } 
																	onClick={ this.props.callbacks.checkbox.bind(this, field.field) } 
																	required={ required }
																/>
													break;
												}
												case 'checkboxes' : {

													var checkboxes = [];

													field.field.map((checkbox, checkbox_index) => {

														label = (field.label) ? field.label[checkbox_index] : checkbox.replace(/_/g, ' ');

														checkboxes.push(

															<Checkbox key={ 'checkboxes'+section_index+field_index+checkbox_index }
																checked={ (this.props.record[checkbox]) ? (this.props.record[checkbox] == 1) : false } 
																// className={ field.grid } 
																form_error={ this.props.form_error } 
																label={ label } 
																name={ checkbox } 
																onClick={ this.props.callbacks.checkbox.bind(this, checkbox) } 
																required={ required }
															/>
														);

													});
													component = <span className={ 'form-group '+field.grid }>
																	{ checkboxes }
																</span>
													break;
												}
											}

											return (
												<Fragment key={ 'field'+field_index }>
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
