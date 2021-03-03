import React, { Fragment } from 'react';
import { Input } from '../form-elements/input';
import { Select } from '../form-elements/select';
import { MultiSelect } from '../form-elements/multiselect';
import { Checkbox } from '../form-elements/checkbox';
import { Textarea } from '../form-elements/textarea';
import { Dropzone } from '../form-elements/dropzone';


export default function FormBuilderComps(props) {

	var label;
	if  (props.field.field && !Array.isArray(props.field.field)) label = (props.field.label) ? props.field.label : props.field.field.replace(/_/g, ' ');
	var required = (props.field.valid) ? props.field.valid.includes('required') : false;

	var component;

	switch (props.field.type) {

		case 'email'	: 
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
				readOnly={ props.field.readOnly }
				type="text" 
				disabled={ props.field.disabled }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
			/>
			break;
		}
		case 'date'		: {

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				prepend={ <i className="far fa-calendar-alt"></i> }
				append={ props.field.append }
				onChange={ props.props.callbacks.date } 
				required={ required }
				type="date" 
				defaultValue={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : null }
			/>
			break;
		}
		case 'select' : {

			component =	<Select
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.select } 
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
				disabled={ props.field.disabled }
			>
				{ props.field.options }
			</Select>
			break;
		}
		case 'multiselect' : {

			component =	<MultiSelect
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				// options={ props.field.options }
				onChange={ props.props.callbacks.multiselect } 
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : [] } 
				disabled={ props.field.disabled }
			>
				{ props.field.options }
			</MultiSelect>
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
				disabled={ props.field.disabled }
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
				storage={ props.field.dropzone.storage }
				storageRef={ props.field.dropzone.storageRef }
				bin={ props.field.dropzone.bin } 
				directory={ props.field.dropzone.directory } 
				filename={ props.field.dropzone.filename }
				image={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
				multiple={ false }
				onChange={ props.props.callbacks.dropzone.bind(this) } 
				maxHeight={ props.field.dropzone.height }
			/>
			break;
		}
		case 'empty' : {
			
			component = <span className={ props.field.grid }></span>
			break;
		}
	}

	return (
		<Fragment>
			{ component }
		</Fragment>
	);
}
