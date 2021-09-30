import React, { Fragment } from 'react';
import { Input } from '../form-elements/input';
import { Select } from '../form-elements/select';
import { MultiSelect } from '../form-elements/multiselect';
import { Checkbox } from '../form-elements/checkbox';
import { Colorbox } from '../form-elements/colorbox';
import { Textarea } from '../form-elements/textarea';
import { Dropzone } from '../form-elements/dropzone';


export default function FormBuilderComps(props) {

	var label;
	if  (props.field.field && !Array.isArray(props.field.field)) label = props.field.label;
	var required = (props.field.valid) ? props.field.valid.includes('required') : false;

	var component;

	console.info(props.field.type);

	switch (props.field.type) {

		case 'number'	:
		case 'text'		: {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
				name={ props.field.field }
				prepend={ props.field.prepend }
				append={ props.field.append }
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				required={ required }
				readOnly={ props.field.readOnly }
				type="text" 
				disabled={ props.field.disabled }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
			/>
			break;
		}
		case 'email'	: {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
				name={ props.field.field }
				prepend={ props.field.prepend }
				append={ props.field.append }
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				required={ required }
				readOnly={ props.field.readOnly }
				type="email" 
				disabled={ props.field.disabled }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
			/>
			break;
		}
		case 'typeahead'		: {

			if (typeof props.props.callbacks?.typeahead !== 'function') console.error('Missing Callback for TypeAhead');

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
				name={ props.field.field }
				allowNew={ props.field.allow_new }
				prepend={ props.field.prepend }
				append={ props.field.append }
				onChange={ props.props.callbacks.typeahead } 
				placeholder={ props.field.placeholder }
				required={ required }
				readOnly={ props.field.readOnly }
				table={ props.field.table }
				fields={ props.field.fields }
				sort={ props.field.sort }
				target={ props.field.target }
				id={ props.field.id }
				type="typeahead" 
				disabled={ props.field.disabled }
			/>
			break;
		}
		case 'date'		: {

			if (typeof props.props.callbacks?.date !== 'function') console.error('Missing Callback for Date');

			component =	<Input
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
				name={ props.field.field }
				prepend={ <i className="far fa-calendar-alt"></i> }
				append={ props.field.append }
				onChange={ props.props.callbacks.date } 
				required={ required }
				type="date" 
				selected={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : null }
			/>
			break;
		}
		case 'select' : {

			if (typeof props.props.callbacks?.select !== 'function') console.error('Missing Callback for Select');
			
			component =	<Select
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
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
			
			if (typeof props.props.callbacks?.multiselect !== 'function') console.error('Missing Callback for MultiSelect');

			component =	<MultiSelect
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				options={ props.field.options }
				onChange={ props.props.callbacks.multiselect } 
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : [] } 
				disabled={ props.field.disabled }
			>
				{/* { props.field.options } */}
			</MultiSelect>
			break;
		}
		case 'textarea' : {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component = <Textarea 
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				required={ required }
				rows={ (props.field.rows) ? fild.rows : '4' }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
				disabled={ props.field.disabled }
			/>
			break;
		}
		case 'checkbox' : {

			if (typeof props.props.callbacks?.checkbox !== 'function') console.error('Missing Callback for Checkbox');

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
			
			if (typeof props.props.callbacks?.checkbox !== 'function') console.error('Missing Callback for Checkbox');
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
		case 'colorbox' : {

			console.info('Got 1');
			
			if (typeof props.props.callbacks?.color !== 'function') console.error('Missing Callback for Color');

			component = <Colorbox
			className={ props.field.grid } 
				form_error={ props.props.form_error } 
				label={ label } 
				hideLabel={ props.field.hideLabel }
				noLabel={ props.field.noLabel }
				name={ props.field.field }
				onChange={ props.props.callbacks.color.bind(this, props.field.field) } 
				required={ required }
				value={ this.state.mainStatusType.color }
			/>
			console.info('Got 2');
			break;
		}
		case 'dropzone' : {

			if (typeof props.props.callbacks?.dropzone !== 'function') console.error('Missing Callback for DropZone');

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
				readOnly={ props.field.readOnly }
			/>
			break;
		}
		case 'plaintext': {

			component = <h3 className={ props.field.grid + ((props.field.label) ? ' mt-4' : '') }>{ props.field.text }</h3>
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
