import React, { Fragment } from 'react';
import { Input } from './input';
import { Select } from './select';
import { Checkbox } from './checkbox';
import { Textarea } from './textarea';
import { Dropzone } from './dropzone';


export default function FormBuilderComps(props) {

	var label;
	if  (!Array.isArray(props.field.field)) label = (props.field.label) ? props.field.label : props.field.field.replace(/_/g, ' ');
	var required = (props.field.valid) ? props.field.valid.includes('required') : false;

	var component;

	switch (props.field.type) {

		case 'email'	: 
		case 'date'		: 
		case 'text'		: {

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				prepend={ props.field.prepend }
				append={ props.field.append }
				onChange={ props.props.callbacks.text } 
				required={ required }
				type="text" 
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
			/>
			break;
		}
		case 'select'	: {

			component =	<Select
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.text } 
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
			>
				{ props.field.options }
			</Select>
			break;
		}
		case 'textarea' : {
			
			component = <Textarea 
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.text } 
				required={ required }
				rows={ (props.field.rows) ? fild.rows : '4' }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
			/>
			break;
		}
		case 'checkbox' : {

			component = <Checkbox
				checked={ (props.props.record[props.field.field]) ? (props.props.record[props.field.field] == 1) : false } 
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onClick={ props.props.callbacks.checkbox.bind(this, props.field.field) } 
				required={ required }
			/>
			break;
		}
		case 'checkboxes' : {

			var checkboxes = [];

			props.field.field.map((checkbox, checkbox_index) => {

				label = (props.field.label) ? props.field.label[checkbox_index] : checkbox.replace(/_/g, ' ');

				checkboxes.push(

					<Checkbox
						checked={ (props.props.record[checkbox]) ? (props.props.record[checkbox] == 1) : false } 
						// className={ props.field.grid } 
						form_error={ props.props.form_error } 
						label={ label } 
						name={ checkbox } 
						onClick={ props.props.callbacks.checkbox.bind(this, checkbox) } 
						required={ required }
					/>
				);

			});
			component = <span className={ 'form-group '+props.field.grid }>
							{ checkboxes }
						</span>
			break;
		}
		case 'dropzone' : {
			
			component = <Dropzone
				className={ props.field.grid }
				label={ props.field.label }
				field={ props.field.field }
				bin={ props.field.dropzone.bin } 
				directory={ props.field.dropzone.directory } 
				filename={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
				multiple={ false }
				onChange={ props.props.callbacks.dropzone.bind(this) } 
				maxHeight={ props.field.dropzone.height }
			/>
			break;
		}
	}

	return (
		<Fragment>
			{ component }
		</Fragment>
	);
}
