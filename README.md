# CHANGELOG

Version | Description of Changes
--------|-----------------------
3.0.8 | Mapbox & updated UserProfile
3.0.6 | Format *timestamp* for timestamp fields, and *date* for date fields including a "seconds" key.
3.0.4 | Update *show_search*, *highlight_search*, and *search_query*. Addition of *_accent* object for CSS accent of a data row.
3.0.3 | Updated of Company fields - *logoUrl*, *companyName*
3.0.2 | **Table**, deprecation of *id* prop, *click_callback*  returns *item* entire record. **Table** record with *_highlight* field wrappes value with *\<mark>* tags. **Table** addition of *search* and *search_callback* props.  **Avatar** street numbers prefixed above text.  **Ibox** addition of *mini* prop for smaller footprint.

# MODAL ALERT

### Example

```
ModalAlert({
	title: "Are you sure?",
	text: "The Part will be Deleted!",
	type: "warning",
	callback_success: () => {
		this.props.dispatch(actions_crud.deleteCRUD('maintenance', 'asset_part', item));
	},
});
```

## MODAL ALERT OPTIONS

option | Type | Description
-----|------|------------
**title: \*** | (string) | Title for popup modal alert
**type: \*** | (string) | success, info, warning, error
**text: \*** | (string) | The modal message
**callback_success** | (function) | callback when modal is confirmed
**callback_cancel** | (function) | optional callback when modal is canceled
**confirmButtonText** | (string) | Text for confirm button
**confirmButtonColor** | (string) | Color for confirm button is hex.
**cancelButtonText** | (string) | Text for cancel button
**showCancelButton** | (boolean) | whether or not to display a cancel button

# MODAL FORM

### Example

```
<ModalForm {...this.props}
	modal_header="Customer Form"
	cancel_button_title="Cancel"
	save_button_title="Save Details"
	submitFormHandler={ this.submitForm.bind(this, form_layout) }
	history={ this.props.history }
>
	...
</ModalForm>

```

## MODAL ALERT OPTIONS

option | Type | Description
-----|------|------------
**history** | (function) | Route History object
**modal_header: \*** | (string) | Title for popup modal
**cancel_button_title: \*** | (string) | Label for Cancel button
**save_button_title: \*** | (string) | Label for Save button
**submitFormHandler** | (function) | callback when modal is saved


# TABLES

## TABLE PROPS

Prop | Type | Description
-----|------|------------
**columns: \*** |(object array) | Column Object (See Column Object below)
**data: \*** | (object) | Data from which table data is drawn. A field with name *_accent* can contain CSS key/value pairs for accenting a particular row.
**active_id:** | (string) | id for active_field in which to set class active for the row 
**active_field:** | (string) | field in which to check for active_id
**button:** | (string) | Label for button
**button_callback:** | (function) | A callback function to be called when Button is clicked.
**button_in_ibox:** | (boolean) | If the table is rendered in an iBox, this will position the button up into the iBox header
**click_callback:** | (function) | A callback function with _item_ entire record parameter to be called when a Row is clicked.
**container_id:** | (string) | dom id for container for fixed height vertical table scrolling 
**container_margin:** | (int) | vertical margin in pixels for determining column height
**delete:** | (boolean) | Enable row delete
**filters:** | (object) | Filter Object (See Filter Object below)
**hide_header:** | (boolean) | Hide table header
**highlight_search** | (boolean) | Enclose search results with *\<mark>* tags.
**limit:** | (numeric) | Initial setting for the record limit dropdown
**on_delete:** | (function) | function to which *id* is sent upon delete
**order:** | (object) | Order Object (See Order Object below)
**pathname:** | (string) | Current page pathname required for savestate
**savestate:** | (boolean) | State state across screen instances
**savestate:** | (boolean) | State state across screen instances
**search_query** | (string) | External search query for high-lighting. Internal search query is used if not defined.
**show_limit:** | (boolean) | Show limit dropdown
**show_search:** | (boolean) | Render a search field

### COLUMN OBJECT

Parameters | Type | Description
-----------|------|------------
**field: \*** | (string) | The field name within the *data* block (or linked data block)
**name: \*** | (string) | The name to represent the column in the header
**button:** | (object) | Button Object used with Types _button_ and _action_ (See Button Object below)
**callback:** | (function) | Function to be called by Types _datepicker_ and _button._
**data:** | (object) | Additional dataset for linking
**format:** | (string) | Format based on Type e.g. ``{ type: 'date', format: 'MMMM Do, YYYY' }`` or ``{ type: 'number', format: 'usd' }``
**link:** | (string \|\| array) | Field on which to link another data set. If array, the first is the field for the additional data set, the second is the original dataset.  _Field_ above referrs to linked dataset.
**max:** | (bool) | Sets column width to 100%, other columns take minimal space
**nowarp:** | (bool) | Ensure the column does not wrap
**postfix:** | (string) | String to append to column value
**prefix:** | (string) | String to prepend to column value
**type:** | (string) | One of the following: _date, timestamp, number, select, datepicker, button, actions._ _Action_ requires the use of _button_ below to define button actions.  _Select_ requires the use of a linked dataset for the selection options.
**width:** | (int) | fixed column width in percent

### ORDER OBJECT

Parameter | Type | Description
----------|------|------------
**direction:** | (string array) | Direction for sort, 'asc' or 'desc'
**fields:** | (string array) | Fields for which to order on

### FILTER OBJECT

Parameter | Type | Description
----------|------|------------
**active:** | (int) | Index (starting with 1) of button initially active
**buttons:** | (object array) | Array of buttons with key/value pair `name` and `value`
**field:** | (string)| Field on which to filter 
**limit:** | (int) | Maximum number of filters to be displayed as buttons before converting to drop-down.

### BUTTON OBJECT

Parameter | Type | Description
----------|------|------------
**activeClass:** | (string) Classname for active button
**className:** | (string) Classname for button
**links:** | (object array) | For _action_ button, array of key/value pair: `name` and `callback`
**multiple:** | (boolean) | enable multiple selection mode in _Action._
**name:** | (string) Label to appear on button

### EXAMPLE:

```
<Table
    id={ 'email' }
    data={ this.props.callLog.call_log }
    search={ true }
    show_limit={ false }
    columns={[
      { name: 'Date/Time', field: 'datetime', type: 'date', format: 'MMMM Do, YYYY', width: 50 },
      { name: 'User', field: 'user', width: 50 },
      {
        name: 'Action',
        field: 'work_order_id',
        type: 'actions',
        multiple: true,
        button: {
          name: 'Action',
          className: 'btn-outline-secondary',
          activeClass: 'btn-success',
          links: [
            { name: 'Print Work Order', callback: this.printWorkOrder.bind(this) },
          ]
        },
      },
    ]}
    click_callback={ (email) => {
        ...
    }}
    button={ '+ Call' }
    button_in_ibox={ true }
    button_callback={ () => {
        ...
    }}
    container_id={ 'column1' }
    container_margin={ 270 }
/>
```

# IBOX

## IBOX PROPS

Prop | Type | Description
-----|------|------------
**title: \*** | (string) | Title for the iBox
**show_spinner:** | (bool) | Whether or not to show loading Spinner
**mini** | (bool) | display iBox as a small sized iBox
**children** | (jsx) | displays children in content of iBox

# FORM LAYOUT

## THEORY OF OPERATION

In addition to the Form componet, there should be a _form_layout_ file containing the _field default_ object and the _form layout_ array.

In addition to the Enspire-Manager-Framework components, the form component must import the field definition object, and the form_layout which can be contained in the same file.

```
import { FormBuilder, ValidateForm } from 'enspire-manager-framework';
import { work_order_fields, work_order_request_form_layout } from './work_order_request_form_layout';
```

State should be made for the ultimate form object, as well as helpful states for _populated_, _changed_, and _form_error_.  Upon mounting, default field definitions can be set from the _field_definition_ object.  If there is an existing record, a routine should be called to populate the form:

```
class WorkOrderForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			changed: false,
			populated: false,
			form_error: null,
			work_order: {},
		};
	}

	/* Lifecycles --------------------------*/

	componentDidMount() {
		var work_order;
		work_order = work_order_fields();
		this.setState({ work_order }, () => {
			...
			this.populateForm();
		});
  }
```

The form itself is build by the library's _FormBuilder_ component which accepts the _form_layout_ definition, the current record, the _form_error_ object, and callback functions for each type of field: 

```
<FormBuilder 
  callbacks={{
    text: this.handleChange.bind(this),
    select: this.handleChange.bind(this),
    date: this.handleDate.bind(this),
    dropzone: this.handleUpload.bind(this),
  }}
  form_error={ this.state.form_error }
  form={ form_layout }
  record={ this.state.work_order }
/>

<button className="btn btn-success" type="button" onClick={ this.submitForm.bind(this, form_layout) }>Save</button>
```

A button that submits the form passes the _form_layout_ object to to a function to validate the form using the _ValidateForm_ component.  This function returns a _form_error_ array that can be evaluated or added to with additional validations. 

```
submitForm(work_order_form_layout) {
  var form_error = ValidateForm(this.state.work_order, work_order_form_layout);
  this.setState({ form_error });
  ...
  (save form data)
}
```
Callback functions should handle form data and clear _form_error_ entries for that particular field.

```
handleChange(event) {
  var form_error = _.filter(this.state.form_error, (o) => { return o.field !== event.target.name; });
  this.setState({ form_error, work_order: { ...this.state.work_order, [event.target.name]: event.target.value }, changed: true });
}
handleDate(field, date) {
  var form_error = _.filter(this.state.form_error, (o) => { return o.field !== field; });
  var schedule = (date) ? moment(date).format('YYYY-MM-DD') : null;
  this.setState({ form_error, work_order: { ...this.state.work_order, [field]: schedule }, change: true });
}
handleUpload(field, filename) {
  this.setState({ work_order: { ...this.state.work_order, [field]: filename }});
}
```

## FORM LAYOUT PROPS

The _form_layout_ is an array of form blocks containing the following:

Prop | Type | Description
-----|------|------------
**column_class:** |(string) | Class name to apply to this form block e.g. _col-sm-7_
**body: \*** | (object array) | An array of objects with two keys:  _section_ and _layout_.

### Body Object Array

Prop | Type | Description
-----|------|------------
**section:** | (jsx) | JSX components acting as a section description
**layout: \*** | (object array) | An array of single _form field definitions_.

### Layout Object Array

Prop | Type | Description
-----|------|------------
**grid: \*** | (string) | classname for grid size e.g. _col-lg-6_
**label: \*** | (string) | Field label
**field: \*** | (string) | Field name
**type: \*** | (string) | Field type, one of _text_ or _email_, _textarea_, _select_, _date_, _checkbox_, _checkboxes_, or _dropzone_. 
**options:** | (jsx) | List of JSX \<option> tags surrounded by \<Fragment>
**dropzone:** | (object) | Dropzone object
**valid:** | (string array) | List of validations to check for, including _required_, _numeric_, _email_, & _leading_zeros_ (warning that leading zeros cannot be preserved)
**readOnly:** | (boolean) | Should field be rendered Read-Only?

### Dropzone Object

Prop | Type | Description
-----|------|------------
**bin: \*** | (string) | AWS bin name
**directory: \*** | (string) | Pathname for AWS storage
**className:** | (string) | Class name for dropzone (margins perhaps)
**height:** | (string) | height string for dropzone & image e.g. '350px'
**multiple:** | boolean | Accept multiple documents for upload


### SAMPLE FIELD DEFAULTS AND FORM LAYOUT

```
import React, { Fragment } from 'react';

export function work_order_fields() {

  // these should be default values

	return (

		{
			asset_id: '',
			description: '',
			downtime: '',
			frequency: '',
			status: 'Open',
			suggestions: '',
			type: 'Request',
			urgency: 0,
		}
	)
}
export function work_order_scheduled_form_layout(Checklist, work_order, handleChecklist) {

	return (

		[{
			column_class: 'col-sm-7',
			body: [{
				section:
					<Fragment>
						<h3 className="m-t-none m-b">Work Order Description</h3>
					</Fragment>,
				layout: [{
					grid: 'col-lg-6',
					label: 'Frequency',
					field: 'frequency',
					type: 'select',
					valid: [ 'required' ],
					options:
						<Fragment>			
							<option value="">Choose...</option>
							<option value="Daily">Daily</option>
							<option value="Weekly">Weekly</option>
							<option value="Bi-Weekly">Bi-Weekly (every 2 weeks)</option>
							<option value="Monthly">Monthly</option>
							<option value="Bi-Monthly">Bi-Monthly (every 2 months)</option>
							<option value="Quarterly">Quarterly</option>
							<option value="Semi-Annually">Semi-Annually</option>
							<option value="Annually">Annually</option>
						</Fragment>,
				}, {
					grid: 'col-lg-6',
					label: 'Starting Date',
					field: 'schedule',
					type: 'date',
					valid: [ 'required' ],
				}, {
					grid: 'col-lg-12',
					label: 'Description of Maintenance',
					field: 'description',
					type: 'textarea',
					valid: [ 'required' ],
				}, {
					grid: 'col-lg-6',
					label: 'Requesting User',
					field: 'username',
					type: 'text',
					readOnly: true,
				}, {
					grid: 'col-lg-6',
					label: 'Status',
					field: 'status',
					type: 'select',
					valid: [ 'required' ],
					options:
						<Fragment>			
							<option value="Open">Open</option>
							<option value="Complete">Complete</option>
						</Fragment>,
				}]
			}]
		}, {
			column_class: 'col-md-5',
			body: [{
				section:
					<Fragment>
						<h3 className="m-t-none m-b">Checklist</h3>
						...
					</Fragment>,
				layout: [{
					grid: 'col-lg-12',
					label: 'Issue Photo',
					field: 'filename',
					type: 'dropzone',
					dropzone: {
						bin: 'ottawaforestproducts-uploads',
						className: 'mb-3',
						directory: 'ottawa_maintenance_work_orders',
						height: '350px',
						multiple: false,
					}
				}]
			}]
		}]
	)
};
```
