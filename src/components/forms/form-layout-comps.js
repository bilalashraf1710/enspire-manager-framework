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

	switch (props.field.type) {

		case 'number'	:
		case 'text'		: {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component =	<Input
				append={ props.field.append }
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				label={ label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onBlur={ props.props.callbacks.blur } 
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				prepend={ props.field.prepend }
				readOnly={ props.field.readOnly }
				required={ required }
				type="text" 
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
			/>
			break;
		}
		case 'email'	: {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component =	<Input
				append={ props.field.append }
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				label={ label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				prepend={ props.field.prepend }
				readOnly={ props.field.readOnly }
				required={ required }
				type="email" 
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' }
                onBlur={ props.props.callbacks.blur } 
			/>
			break;
		}
		case 'typeahead'		: {

			if (typeof props.props.callbacks?.typeahead !== 'function') console.error('Missing Callback for TypeAhead');

			component =	<Input
				allowNew={ props.field.allow_new }
				append={ props.field.append }
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				fields={ props.field.fields }
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				id={ props.field.id }
				label={ label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onChange={ props.props.callbacks.typeahead } 
				placeholder={ props.field.placeholder }
				prepend={ props.field.prepend }
				readOnly={ props.field.readOnly }
				required={ required }
				sort={ props.field.sort }
				table={ props.field.table }
				target={ props.field.target }
				type="typeahead" 
                appId={ props.field.appId }
			/>
			break;
		}
		case 'date'		: {

			if (typeof props.props.callbacks?.date !== 'function') console.error('Missing Callback for Date');

			component =	<Input
				append={ props.field.append }
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				label={ label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onChange={ props.props.callbacks.date } 
				prepend={ <i className="far fa-calendar-alt"></i> }
				required={ required }
				selected={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : null }
				selectsEnd={ props.field.selectsEnd }
				selectsStart={ props.field.selectsStart }
				type="date" 
                dateFormat={ props.field.dateFormat }
                readOnly={ props.field.readOnly }
                showTimeSelect={ props.field.showTimeSelect }
                timeFormat={ props.field.timeFormat }
			/>
			break;
		}
		case 'select' : {

			if (typeof props.props.callbacks?.select !== 'function') console.error('Missing Callback for Select');
			
			component =	<Select
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				label={ label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onChange={ props.props.callbacks.select } 
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
			>
				{ props.field.options }
			</Select>
			break;
		}
		case 'multiselect' : {
			
			if (typeof props.props.callbacks?.multiselect !== 'function') console.error('Missing Callback for MultiSelect');

			component =	<MultiSelect
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.multiselect } 
				options={ props.field.options }
				required={ required }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : [] } 
			>
				{/* { props.field.options } */}
			</MultiSelect>
			break;
		}
		case 'textarea' : {

			if (typeof props.props.callbacks?.text !== 'function') console.error('Missing Callback for Text');

			component = <Textarea 
				className={ props.field.grid } 
				disabled={ props.field.disabled }
				form_error={ props.props.form_error } 
				label={ label } 
				name={ props.field.field } 
				onChange={ props.props.callbacks.text } 
				placeholder={ props.field.placeholder }
				required={ required }
				rows={ (props.field.rows) ? props.field.rows : '4' }
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
                onBlur={ props.props.callbacks.blur } 
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

			if (typeof props.props.callbacks?.color !== 'function') console.error('Missing Callback for Color');

			component = <Colorbox
				className={ props.field.grid } 
				form_error={ props.props.form_error } 
				hideLabel={ props.field.hideLabel }
				label={ props.field.label } 
				name={ props.field.field }
				noLabel={ props.field.noLabel }
				onChange={ props.props.callbacks.color.bind(this) } 
				value={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : [] }
			/>
			break;
		}
		case 'dropzone' : {

			if (typeof props.props.callbacks?.dropzone !== 'function') console.error('Missing Callback for DropZone');

			component = <Dropzone
				bin={ props.field.dropzone.bin } 
				className={ props.field.grid }
				directory={ props.field.dropzone.directory } 
				field={ props.field.field }
				filename={ props.field.dropzone.filename }
				image={ (props.props.record[props.field.field]) ? props.props.record[props.field.field] : '' } 
				label={ props.field.label }
				maxHeight={ props.field.dropzone.height }
				multiple={ false }
				onChange={ props.props.callbacks.dropzone.bind(this) } 
				readOnly={ props.field.readOnly }
				storage={ props.field.dropzone.storage }
				storageRef={ props.field.dropzone.storageRef }
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
		case 'skip' : {
			
			component = <span></span>
			break;
		}
	}

	return (
		<Fragment>
			{ component }
		</Fragment>
	);
}
