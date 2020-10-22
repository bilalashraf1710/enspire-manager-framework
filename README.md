# enspire-manager-framework

## TABLE

### TABLE PROP

Prop | Type | Description
-----|------|------------
**data: \*** | (object) | Data from which table data is drawn.  If a _\_highlight_ field is included, occurances of that text will be marked with <mark> tags.
**columns: \*** |(object array) | Column Object (See Column Object below)
**order:** | (object) | Order Object (See Order Object below)
**filters:** | (object) | Filter Object (See Filter Object below)
**savestate:** | (boolean) | State state across screen instances
**pathname:** | (string) | Current page pathname required for savestate
**show_limit:** | (boolean) | Show limit dropdown
**limit:** | (numeric) | Initial setting for the record limit dropdown
**search:** | (boolean) | Render a search field
**savestate:** | (boolean) | State state across screen instances
**hide_header:** | (boolean) | Hide table header
**click_callback:** | (function) | A callback function with _item_ entire record parameter to be called when a Row is clicked.
**button:** | (string) | Label for button
**button_in_ibox:** | (boolean) | If the table is rendered in an iBox, this will position the button up into the iBox header
**button_callback:** | (function) A callback function to be called when Button is clicked.
**delete:** | (boolean) | Enable row delete
**on_delete:** | (function) | function to which *id* is sent upon delete
**container_id:** | (string) | dom id for container for fixed height vertical table scrolling 
**container_margin:** | (int) | vertical margin in pixels for determining column height

#### COLUMN OBJECT

Parameters | Type | Description
-----------|------|------------
**name: \*** | (string) | The name to represent the column in the header
**field: \*** | (string) | The field name within the *data* block (or linked data block)
**prefix:** | (string) | String to prepend to column value
**postfix:** | (string) | String to append to column value
**width:** | (int) | fixed column width in percent
**nowarp:** | (bool) | Ensure the column does not wrap
**max:** | (bool) | Sets column width to 100%, other columns take minimal space
**link:** | (string \|\| array) | Field on which to link another data set. If array, the first is the field for the additional data set, the second is the original dataset.  _Field_ above referrs to linked dataset.
**data:** | (object) | Additional dataset for linking
**type:** | (string) | One of the following: _date, number, select, datepicker, button, actions._ _Action_ requires the use of _button_ below to define button actions.  _Select_ requires the use of a linked dataset for the selection options.
**format:** | (string) | Format based on Type e.g. ``{ type: 'date', format: 'MMMM Do, YYYY' }`` or ``{ type: 'number', format: 'usd' }``
**button:** | (object) | Button Object used with Types _button_ and _action_ (See Button Object below)
**callback:** | (function) | Function to be called by Types _datepicker_ and _button._

#### ORDER OBJECT

Parameter | Type | Description
----------|------|------------
**fields:** | (string array) | Fields for which to order on
**direction:** | (string array) | Direction for sort, 'asc' or 'desc'

#### FILTER OBJECT

Parameter | Type | Description
----------|------|------------
**field:** | (string)| Field on which to filter 
**active:** | (int) | Index (starting with 1) of button initially active
**limit:** | (int) | Maximum number of filters to be displayed as buttons before converting to drop-down.
**buttons:** | (object array) | Array of buttons with key/value pair `name` and `value`

#### BUTTON OBJECT

Parameter | Type | Description
----------|------|------------
**name:** | (string) Label to appear on button
**className:** | (string) Classname for button
**activeClass:** | (string) Classname for active button
**links:** | (object array) | For _action_ button, array of key/value pair: `name` and `callback`
**multiple:** | (boolean) | enable multiple selection mode in _Action._

#### EXAMPLE:

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

## Ibox

### Ibox PROP

Prop | Type | Description
-----|------|------------
**title: \*** | (string) | Title for the iBox
**show_spinner:** | (bool) | Whether or not to show loading Spinner
**mini** | (bool) | display iBox as a small sized iBox
**children** | (jsx) | displays children in content of iBox


