import DatePicker from "react-datepicker";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import React from 'react';
import Tooltip from 'react-bootstrap/Tooltip';
import { Input } from './form-elements/input';
import { Portal } from "react-overlays";


const escapeStringRegexp = require('escape-string-regexp');
var _ = require('lodash');
var moment = require('moment');
var sessionStorage = window.sessionStorage;

export class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            search: '',

            filter_button: 0,
            filter_limit: 4,

            page: 0,
            limit: 25,
            show_limit: false,

            order: {
                fields: [],
                direction: []
            },

            container_height: 0,
            container_width: 0,

            selected: [],
            storagekey: null,

            edit: {},
            edited: {},
        };
    }

    componentDidMount() {
        this.loadSessionStorage();
        if (this.props.filters?.active) {
            if (this.props.filters?.buttons?.length <= 5) {
                this.setState({ filter_button: this.props.filters.active });
            } else {
                if (this.props.filters.active > 0) this.setState({ filter_button: this.props.filters.buttons[this.props.filters.active - 1].value });
            }
        }
        if (this.props.filters?.limit) this.setState({ filter_limit: this.props.filters.limit });
        if (this.props.show_limit) this.setState({ limit: 25, show_limit: true });
        if (this.props.limit) this.setState({ limit: parseInt(this.props.limit), show_limit: true });
        if (this.props.order) this.setState({ order: this.props.order });
        if (this.props.filters) this.setState({ filters: this.props.filters });

        this.updateSessionStorage();
        this.handleResize();
        window.addEventListener("resize", _.debounce(this.handleResize.bind(this), 250));
        document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    }
    componentDidUpdate() {
        if (this.props.savestate) {
            if (this.props.pathname) {
                var storagekey = this.props.pathname.replace(/\//g, "_");
                if (storagekey !== this.state.storagekey) {
                    this.loadSessionStorage();
                }
                this.updateSessionStorage();
            } else console.error('EM Table: page Pathname required for savestate');
        }
    }
    componentWillUnmount() {
        window.removeEventListener("resize", _.debounce(this.handleResize.bind(this), 250));
        document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    }

    /* SESSION STORAGE --------------------------------------------------------------------*/

    loadSessionStorage() {
        if (this.props.savestate) {
            if (this.props.pathname) {
                var storagekey = this.props.pathname.replace(/\//g, "_");
                this.setState({ storagekey });
                if (sessionStorage['table' + storagekey]) {
                    this.setState({ ...this.state, ...JSON.parse(sessionStorage['table' + storagekey]) });
                }
            } else console.error('EM Table: page Pathname required for savestate');
        }
    }
    updateSessionStorage() {
        if (this.props.savestate) {
            var savestate = _.clone(this.state);
            delete (savestate.selected);
            sessionStorage['table' + this.state.storagekey] = JSON.stringify(savestate);
        }
    }

    /* EDIT --------------------------------------------------------------------*/

    startEdit(index, type, field, item, callback) {
        this.setState({ edit: { index, type, field, item, callback, value: item[field] } });
    }
    stopEdit() {
        this.setState({ edit: {} });
    }
    highlightEdited(id) {
        this.setState({ edited: { id, fade: 'in' } });
        setTimeout(() => {
            this.setState({ edited: { id, fade: 'out' } });
            setTimeout(() => {
                this.setState({ edited: {} });
            }, 350);
        }, 350);
    }
    onKeyDown(event) {
        if (event.keyCode === 27) this.stopEdit();
        if (event.keyCode === 13) this.submitOnblur();
    }
    handleChange(event) {
        this.setState({ edit: { ...this.state.edit, value: event.target.value } });
    }
    handleChangeDate(date) {
        this.setState({ edit: { ...this.state.edit, value: { seconds: moment(date).format('X') } } }, () => {
            this.submitOnblur();
        });
    }
    submitOnblur() {
        if (this.state.edit.field) {
            var value = (this.state.edit.type == 'date') ? moment(this.state.edit.value.seconds, 'X').toDate() : this.state.edit.value;
            this.state.edit.callback(this.state.edit.field, this.state.edit.item, value);
            this.highlightEdited(this.state.edit.item.id);
            this.stopEdit();
        }
    }

    /* HANDLERS --------------------------------------------------------------------*/

    handleResize() {
        if (this.props.container_id) {
            var container_height = (document.getElementById(this.props.container_id)) ? document.getElementById(this.props.container_id).clientHeight : 0;
            var container_width = (document.getElementById(this.props.container_width_id))
                ? (document.getElementById(this.props.container_width_id).querySelectorAll('tbody')[0])?.clientWidth
                : (document.getElementById(this.props.container_id))
                    ? (document.getElementById(this.props.container_id).querySelectorAll('tbody')[0])?.clientWidth
                    : 0;
            this.setState({ container_height, container_width });
        }
    }
    handleLimit(event) {
        this.stopEdit();
        this.setState({ [event.target.name]: parseInt(event.target.value), page: 0 });
    }
    handleSearch(event) {
        this.stopEdit();
        this.setState({ [event.target.name]: event.target.value, page: 0 });
        if (typeof this.props.search_callback === 'function') this.props.search_callback(event.target.value);
    }
    handleClearSearch() {
        this.stopEdit();
        this.setState({ search: '' });
        if (typeof this.props.search_callback === 'function') this.props.search_callback('');
    }
    handleFilter(button, event) {
        event.preventDefault();
        this.stopEdit();
        if (this.state.filter_button === button) button = 0;
        this.setState({ filter_button: button, page: 0 });
    }
    handleFilterDropdown(event) {
        this.stopEdit();
        this.setState({ filter_button: event.target.value, page: 0 });
    }
    handlePage(page) {
        this.stopEdit();
        this.setState({ page });
    }
    handlePrevious() {
        this.stopEdit();
        if (this.state.page > 0) {
            this.setState({ page: this.state.page - 1 });
        }
    }
    handleNext(max_page) {
        this.stopEdit();
        if (this.state.page < max_page) {
            this.setState({ page: this.state.page + 1 });
        }
    }
    handleFirst() {
        this.stopEdit();
        this.setState({ page: 0 });
    }
    handleLast(max_page) {
        this.stopEdit();
        this.setState({ page: max_page });
    }
    handleButton() {
        this.stopEdit();
        if (this.props.button_callback && typeof this.props.button_callback === 'function') {
            this.props.button_callback();
        }
    }
    handleToggleMultiple(id, e) {
        e.stopPropagation();
        this.stopEdit();
        var selected = this.state.selected;
        if (selected.includes(id)) {
            _.remove(selected, (n) => { return n == id; });
        } else {
            selected.push(id);
        }
        this.setState({ selected });
    }

    /* ACTIONS --------------------------------------------------------------------*/

    formatItem(item, column) {
        if (column.type === 'timestamp') {
            if (column.format) {
                if (column.utc) return moment.utc(item[column.field], 'X').format(column.format);
                return moment(item[column.field], 'X').format(column.format);
            } else console.error('EM Table: Format required for Timestamp field');

        } else if (column.type === 'date') {
            if (column.format) {
                if (item[column.utc]) return (item[column.field]?.seconds) ? moment.utc(item[column.field].seconds, 'X').format(column.format) : '';
                return (item[column.field]?.seconds) ? moment(item[column.field].seconds, 'X').format(column.format) : '';
            } else console.error('EM Table: Format required for Date field');

        } else if (column.type === 'number') {
            if (column.format) {
                if (column.format === 'usd') {
                    return '$ ' + parseFloat(item[column.field]).toFixed(2);
                } else if (column.format === 'round0') {
                    return Math.round(parseFloat(item[column.field])).toFixed(2);
                } else if (column.format === 'round2') {
                    return (Math.round(parseFloat(item[column.field]) * 100) / 100).toFixed(2);
                } else if (column.format === 'round3') {
                    return (Math.round(parseFloat(item[column.field]) * 1000) / 1000).toFixed(3);
                } else console.error('EM Table: Unknown number format');
            } else console.error('EM Table: Format required for Number field');

        } else {
            let result = (item?.[column.field]) ? item[column.field].toString().replace(/_/g, " ") : ''; // replace _ with space 

            if (this.props.highlight_search) {
                var highlight_words = (this.props.search_query) ? this.props.search_query.split(" ") : this.state.search.split(" ");
                if (Array.isArray(highlight_words)) highlight_words.forEach((word) => {
                    if (word) result = result.replace(new RegExp(escapeStringRegexp(word), "i"), (match) => { return '<mark>' + match + '</mark>' });
                });
            }
            return (result) 
                ? ((column.prefix) ? column.prefix : '') + result + ((column.postfix) ? column.postfix : '')
                : '';
        }
    }
    columnSort(column) {
        if (!this.props.order_by) {
            var sortindex = (this.state.order) ? this.state.order.fields.indexOf(column.field) : -1;
            var direction = (sortindex > -1) ? ((this.state.order.direction[sortindex] === 'asc') ? 'desc' : 'asc') : 'asc';
            var order = {
                fields: [column.field],
                direction: [direction],
            }
            this.setState({ order });
        }
    }

    render() {

        const CalendarContainer = ({ children }) => {
            return <Portal container={ document.getElementById("root") }>{ children }</Portal>;
        };

        /* Sort ------------------------------------*/

        if (this.props.group_by) {
            var ordered_data = _.orderBy(this.props.data, [this.props.group_by[0], this.props.group_by[2]], [this.props.group_by[1], this.props.group_by[3]]);
        } else {
            var ordered_data = (this.state.order) ? _.orderBy(this.props.data, this.state.order.fields, this.state.order.direction) : this.props.data;
        }

        /* Search all Fields -----------------------*/

        var filtered_data = (this.state.search && !this.props.search_callback) ? _.filter(ordered_data, (o) => {
            var result = false;
            this.props.columns.forEach((column, index) => {

                if (Array.isArray(column.link)) {
                    var link_data_field = column.link[0];
                    var link_field = column.link[1];
                } else {
                    var link_data_field = column.link;
                    var link_field = column.link;
                }

                var record = o;
                if (link_data_field && link_field) {
                    console.info(link_data_field, o[link_data_field]);
                    record = _.find(column.data, (n) => { return n[link_field] == o[link_data_field] });
                }

                if (record && typeof record[column.field] === 'string' && record[column.field].toLowerCase().includes(this.state.search.toLowerCase())) result = true;
                if (record && typeof record[column.field] === 'number' && record[column.field].toString().startsWith(this.state.search.toLowerCase())) result = true;
            });
            return result;
        }) : ordered_data;

        /* Filtered -----------------------------------*/

        if (this.props.filters?.buttons) { // has buttons?
            if (this.props.filters?.buttons?.length <= 5) {
                if (this.state.filter_button && this.props.filters?.buttons?.[this.state.filter_button - 1]?.value) {
                    filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.props.filters.buttons[this.state.filter_button - 1].value });
                }
            } else {
                if (this.state.filter_button !== 0 && this.state.filter_button !== "0") filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.state.filter_button });
            }
        }

        /* Limit --------------------------------------*/

        var page = this.state.page;
        var display_data = (this.state.show_limit && this.state.limit > 0)
            ? filtered_data.slice(page * this.state.limit, page * this.state.limit + this.state.limit)
            : filtered_data;

        /* Pagination ---------------------------------*/

        var gap_low = false;
        var gap_high = false;
        var max_page = Math.floor(filtered_data?.length / this.props.limit);

        var pagination = [];
        if (this.state.limit > 0 && filtered_data?.length > this.state.limit) {
            for (var i = 0; i * this.state.limit < filtered_data?.length; i++) {

                if (i < this.state.page - 2) {
                    gap_low = true;
                } else if (i > this.state.page + 2) {
                    gap_high = true;
                } else {
                    pagination.push(
                        <button key={ i } type="button" className={ 'btn btn-' + ((this.state.page == i) ? 'primary' : 'default') } onClick={ this.handlePage.bind(this, i) }>{ i + 1 }</button>
                    );
                }
            }
        }

        /* Columns Headings ---------------------------------*/

        var columns = (this.props.columns?.length) ? this.props.columns.map((column, index) => {

            var sortindex = (this.state.order) ? this.state.order.fields.indexOf(column.field) : -1;
            var sort = (sortindex > -1) ? ((this.state.order.direction[sortindex] === 'asc') ? 'sort-up' : 'sort-down') : null;

            var styles = { lineHeight: 1 };
            if (column.width) styles.width = column.width.toString() + '%';

            return (
                <th key={ 'th' + index } style={ styles }>
                    <a style={ { cursor: 'pointer', whiteSpace: 'nowrap' } } onClick={ this.columnSort.bind(this, column) }>
                        { column.name.toUpperCase() }
                        { column.edit &&
                            <i className="fas fa-pencil-alt" style={ { color: '#aaaaaa', marginLeft: '7px' } }></i>
                        }
                        <i className={ 'fa fa-' + sort } style={ { color: '#aaaaaa', marginLeft: '7px' } } />
                    </a>
                </th>
            );
        }) : null;

        /* Rows ------------------------------------*/

        var groupedRows = [];
        var groupBy = null;
        var rows = [];

        if (display_data?.length) display_data.map((item, row_index) => {

            /* Group By ---------------------------------*/

            if (this.props.group_by) {
                if (item[this.props.group_by[0]] != groupBy) {
                    groupBy = item[this.props.group_by[0]];
                    rows.push(
                        <tr key={ 'heading:' + groupBy } style={ { backgroundColor: '#666666' } }>
                            <td colSpan="99" style={ { color: 'white', textTransform: 'uppercase' } }>{ groupBy }</td>
                        </tr>
                    );
                }
            }

            var inputProps = {};

            /* Click ------------------------------------*/

            if (this.props.click_callback && typeof this.props.click_callback === 'function') {
                inputProps.onClick = () => {
                    this.props.click_callback(item, row_index);
                }
            }

            if (!this.props.columns?.length) console.error('EM Table: Missing Columns Definition');
            var fields = (this.props.columns?.length) ? this.props.columns.map((column, column_index) => {

                var styles = { overflowWrap: 'anywhere' };

                /* NoWrap & Width ------------------------------------*/

                if (column.nowrap || column.checkbox) styles.whiteSpace = 'nowrap';
                if (column.width) styles.width = ((this.state.container_width - 10) * column.width / 100).toString() + 'px';

                /* Data ------------------------------------*/

                if (column.data) {

                    if (Array.isArray(column.link)) {
                        var link_data_field = column.link[0];
                        var link_field = column.link[1];
                    } else {
                        var link_data_field = column.link;
                        var link_field = column.link;
                    }

                    var items = [];
                    var linked = _.filter(column.data, { [link_field]: item[link_data_field] });

                    if (column.filter) {
                        column.filter.forEach((element, element_index) => {
                            let filtered = _.filter(linked, { [column.filter_field]: element });
                            if (filtered?.length) items = items.concat(filtered);
                        });
                    } else {
                        items = linked;
                    }

                    {/* SELECT --------------------------------------------------------------------------------------------*/ }

                    if (column.type == 'select') {

                        if (Array.isArray(column.static) && item[column.static[0]] == column.static[2]) {

                            let entry = _.find(column.data, { [link_field]: item[link_data_field] });
                            if (!entry)
                                return (<td key={ 'td' + column_index }></td>);
                            else
                                return (
                                    <td key={ 'td' + column_index }>
                                        { entry[column.field] }
                                    </td>
                                );

                        } else {

                            var select_options = column.data.map((option, select_index) => {
                                return (
                                    <option key={ 'select' + select_index } value={ option[link_field] }>{ option[column.field] }</option>
                                );
                            });

                            return (
                                <td key={ 'td' + column_index }>
                                    <select
                                        className="form-control"
                                        name={ link_data_field }
                                        onChange={ column.callback.bind(this, item[this.props.id]) }
                                        value={ (item[link_data_field]) ? item[link_data_field] : '' }
                                    >
                                        <option value="">Choose...</option>
                                        { select_options }
                                    </select>
                                </td>
                            );
                        }

                    } else if (column.type == 'datepicker') {
                        console.error('EM Table: Field of type Datepicker cannot have a Data Link');
                    } else if (column.type == 'button') {
                        console.error('EM Table: Field of type Button cannot have a Data Link');
                    } else {
                        if (!items[0]?.[column.field]) {

                            var nullfield = '';
                            if (column.nullLabel) {

                                var badgestyle = '';
                                if (column.style == 1) badgestyle = 'badge-success';
                                if (column.style == 2) badgestyle = 'badge-info';
                                if (column.style == 3) badgestyle = 'badge-warning';
                                if (column.style == 4) badgestyle = 'badge-danger';
                                if (column.style == 5) badgestyle = 'badge-default';

                                nullfield = <span className={ 'badge ' + badgestyle }>{ column.nullLabel }</span>
                            }

                            return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }>{ nullfield }</td>); // TODO check for multiple
                        } else {
                            return (<td key={ 'td' + column_index } { ...inputProps } style={ styles } dangerouslySetInnerHTML={ { __html: this.formatItem(items[0], column) } }></td>); // TODO check for multiple
                        }
                    }

                } else {

                    {/* DATE PICKER -----------------------------------------------------------------------------------------*/ }

                    if (column.type == 'datepicker') {

                        var selected = (item[item.field] !== null) ? moment(item[item.field]).toDate() : '';

                        if (Array.isArray(column.static) && item[column.static[0]] == column.static[2]) {

                            let entry = _.find(column.data, { [link_field]: item[link_data_field] })
                            return (
                                <td style={ styles }>
                                    { moment(selected).format('M-DD-YYYY') }
                                </td>
                            );

                        } else {

                            return (
                                <td style={ styles }>
                                    <div className="input-group">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text input-group-addon"><i className="far fa-calendar-alt"></i></span>
                                        </div>
                                        <DatePicker
                                            className="form-control"
                                            dateFormat="M-dd-yyyy"
                                            selected={ selected }
                                            onChange={ column.callback.bind(this, item[this.props.id]) }
                                        />
                                    </div>
                                </td>
                            );
                        }

                        {/* BUTTON ---------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'button') {
                        if (!column.callback) return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }><button className={ 'btn ' + column.button.className }>{ column.button.name }</button></td>);
                        return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }><button className={ 'btn ' + column.button.className } onClick={ column.callback.bind(this, item) }>{ column.button.name }</button></td>);

                        {/* TOGGLE ---------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'toggle') {
                        if (item[column.field] != null) {
                            let toggle_index = (item[column.field]) ? 1 : 0;
                            if (!column.callback) console.error('Toggle requires a callback');
                            return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }><button className={ 'btn ' + column.button[toggle_index].className } onClick={ column.callback.bind(this, item) }>{ column.button[toggle_index].name }</button></td>);
                        } else {
                            return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }></td>);
                        }

                        {/* JSX ---------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'jsx') {
                        return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }>{ item[column.field] }</td>);

                        {/* BADGE --------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'badge') {

                        var badgestyle = '';
                        if (item[column.field] == 1) badgestyle = 'badge-success';
                        if (item[column.field] == 2) badgestyle = 'badge-info';
                        if (item[column.field] == 3) badgestyle = 'badge-warning';
                        if (item[column.field] == 4) badgestyle = 'badge-danger';
                        if (item[column.field] == 5) badgestyle = 'badge-default';

                        return (<td key={ 'td' + column_index } style={ styles }><span className={ 'badge ' + badgestyle }>{ column.badge[item[column.field]] }</span></td>);

                        {/* LABEL --------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'label') {

                        var badgestyle = '';
                        if (column.style == 1) badgestyle = 'badge-success';
                        if (column.style == 2) badgestyle = 'badge-info';
                        if (column.style == 3) badgestyle = 'badge-warning';
                        if (column.style == 4) badgestyle = 'badge-danger';
                        if (column.style == 5) badgestyle = 'badge-default';

                        return (<td key={ 'td' + column_index } style={ styles }><span className={ 'badge ' + badgestyle }>{ item[column.field] }</span></td>);

                        {/* ACTIONS --------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'actions') {

                        var buttonClass = (this.state.selected && this.state.selected?.includes(item[column.field])) ? column.button.activeClass : column.button.className;
                        var row_results = (this.state.selected && this.state.selected?.length > 0) ? this.state.selected : item[column.field];

                        return (
                            <td key={ 'td' + column_index }>

                                <div { ...inputProps } style={ styles } className="btn-group">
                                    <button data-toggle="dropdown" className={ 'dropdown-toggle btn ' + buttonClass } aria-expanded="false" onClick={ (e) => e.stopPropagation() }>{ column.button.name }</button>
                                    <ul className="dropdown-menu" x-placement="bottom-start" style={ { position: 'absolute', top: '33px', left: '0px', willChange: 'top, left' } }>
                                        { column.button.multiple && <li><a className="dropdown-item" onClick={ this.handleToggleMultiple.bind(this, item[column.field]) }>Toggle Multiple</a></li> }
                                        { column.button.multiple && <li className="dropdown-divider"></li> }
                                        {
                                            column.button.links.map((link, link_index) => {
                                                if (link.name == 'divider') return (<li key={ 'dropdown' + link_index } className="dropdown-divider"></li>);
                                                return (
                                                    <li key={ 'dropdown' + link_index }><a className="dropdown-item" onClick={ link.callback.bind(this, row_results) }>{ link.name }</a></li>
                                                );
                                            })
                                        }
                                    </ul>
                                </div>
                            </td>
                        );

                        {/* SELECT --------------------------------------------------------------------------------------------*/ }

                    } else if (column.type == 'select') {
                        console.error('EM Table: field of type Select must have a Data Link');

                        {/* NO TYPE --------------------------------------------------------------------------------------------*/ }

                    } else {

                        if (column.edit) {

                            {/* EDIT --------------------------------------------------------------------------------------------*/ }

                            if (this.state.edit.field == column.field && this.state.edit.index == row_index) {

                                if (column.edit.type == 'text') {
                                    return (
                                        <td key={ 'td' + column_index } { ...inputProps } style={ styles }>
                                            <Input
                                                className="m-0"
                                                type="text"
                                                name={ column.field }
                                                value={ this.state.edit.value }
                                                noLabel={ true }
                                                onChange={ this.handleChange.bind(this) }
                                                onBlur={ this.submitOnblur.bind(this, column.field, item, column.edit.callback) }
                                            />
                                            <div style={ { color: '#888888', marginLeft: '10px', marginTop: '3px', fontSize: '9px' } }>
                                                ESC&nbsp;-&nbsp;Cancel | ENTER&nbsp;-&nbsp;Save
                                            </div>
                                        </td>
                                    );
                                }
                                if (column.edit.type == 'date') {

                                    if (this.state.order.fields?.includes(column.field)) {
                                        var ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
                                            <OverlayTrigger delay={ { hide: 450, show: 100 } } placement={ 'top' }
                                                overlay={ (props) => (
                                                    <Tooltip { ...props }>
                                                        Changing this value may cause this record to change its position in the list
                                                    </Tooltip>
                                                ) }
                                            >
                                                <button onClick={ onClick } ref={ ref }>{ value }</button>
                                            </OverlayTrigger>
                                        ));
                                    } else {
                                        var ExampleCustomInput = React.forwardRef(({ value, onClick }, ref) => (
                                            <button onClick={ onClick } ref={ ref }>{ value }</button>
                                        ));
                                    }

                                    return (
                                        <td key={ 'td' + column_index } { ...inputProps } style={ styles }>
                                            <DatePicker
                                                className="form-control form-control-sm m-0"
                                                dateFormat="MM-dd-yyyy"
                                                selected={ moment(this.state.edit.value.seconds, 'X').toDate() }
                                                onChange={ this.handleChangeDate.bind(this) }
                                                popperContainer={ CalendarContainer }
                                                customInput={ <ExampleCustomInput /> }
                                                startOpen={ true }
                                            />
                                        </td>
                                    );
                                }
                            } else {
                                var content = <div style={ { maxHeight: this.props.max_height, overflow: 'hidden' } }><span dangerouslySetInnerHTML={ { __html: this.formatItem(item, column) } }></span></div>
                                return (
                                    <td key={ 'td' + column_index } { ...inputProps } className={ 'edit_hover' }
                                        style={ { ...styles, cursor: 'pointer' } }
                                        onClick={ this.startEdit.bind(this, row_index, column.edit.type, column.field, item, column.edit.callback) }
                                    >
                                        { content }
                                    </td>
                                );
                            }

                            {/* NO TYPE & NO EDIT --------------------------------------------------------------------------------------------*/ }

                        } else {

                            var content;
                            if (item[column.field] == null) {

                                var nullfield = '';
                                if (column.nullLabel) {

                                    var badgestyle = '';
                                    if (column.style == 1) badgestyle = 'badge-success';
                                    if (column.style == 2) badgestyle = 'badge-info';
                                    if (column.style == 3) badgestyle = 'badge-warning';
                                    if (column.style == 4) badgestyle = 'badge-danger';
                                    if (column.style == 5) badgestyle = 'badge-default';

                                    nullfield = <span className={ 'badge ' + badgestyle }>{ column.nullLabel }</span>
                                }

                                content = <div style={ { maxHeight: this.props.max_height, overflow: 'hidden' } }>{ nullfield }</div>
                            } else {
                                content = <div style={ { maxHeight: this.props.max_height, overflow: 'hidden' } }><span dangerouslySetInnerHTML={ { __html: this.formatItem(item, column) } }></span></div>
                            }

                            return (<td key={ 'td' + column_index } { ...inputProps } style={ styles }>{ content }</td>);
                        }
                    }
                }
            }) : null;

            // var highlight = null;
            // if (this.props.highlight_search) {
            // 	this.props.highlight_search.forEach((entry, index) => {
            // 		if (item[entry.field] == entry.value) {
            // 			highlight = { border: '2px solid '+entry.border, backgroundColor: entry.color }
            // 		}
            // 	});

            // }

            var active = '';
            if (this.props.active_id && this.props.active_field) {
                if (item[this.props.active_field] == this.props.active_id) {
                    active = 'active';
                }
            }
            var edited = '';
            if (item.id == this.state.edited.id) {
                edited = 'edited-' + this.state.edited.fade;
            }
            var stripe_color = (this.props.stripe_color) ? 'stripe_color_' + item[this.props.stripe_color] : null;

            /* Table Rows TR & Delete column-------------------------------------*/

            var tr_style = { cursor: ((this.props.click_callback) ? 'pointer' : 'default') };
            if (item._accent) tr_style = { ...tr_style, ...item._accent }
            if (this.state.container_width > 0) tr_style.width = this.state.container_width;

            rows.push(
                <tr key={ 'tr' + row_index } className={ active + ' ' + edited + ' ' + stripe_color } style={ tr_style }>
                    { fields }
                    { this.props.delete &&
                        <td key={ 'delete' + row_index } style={ { cursor: 'pointer' } } onClick={ this.props.onDelete.bind(this, item) }><i className="fa fa-times"></i></td>
                    }
                </tr>
            )
        });

        /* Filter Buttons / Dropdown --------------------------*/

        var filters;
        if (this.props.filters && this.props.filters?.buttons?.length <= this.state.filter_limit) {
            filters = (this.props.filters) ? this.props.filters.buttons.map((item, index) => {
                return (
                    <label key={ 'filter' + index } className={ 'btn' + ((index == this.state.filter_button - 1) ? ' btn-primary active' : ' btn-white') } onClick={ this.handleFilter.bind(this, index + 1) }>
                        <input type="radio" name="filters" value={ this.state.filter_button } /> { item.name }
                    </label>
                )
            }) : null;
        } else {
            filters = (this.props.filters) ? this.props.filters.buttons.map((item, index) => {
                let result = (item.name) ? item.name.toString().replace(/_/g, " ") : ''; // replace _ with space 
                return (
                    <option key={ 'filter' + index } style={ { textTransform: 'capitalize' } } value={ item.value }>{ result }</option>
                )
            }) : null;
        }

        var buttonStyle = {};
        if (this.props.button_in_ibox) buttonStyle = { position: 'absolute', right: '0px', top: '-52px' };

        /* Fixed height scrollable ---------------------------*/

        var header_style = (this.state.container_height > 0 && this.props.container_margin > 0) ? { display: 'table' } : {};
        var tbody_style = (this.state.container_height > 0 && this.props.container_margin > 0) ? { display: 'block', height: (this.state.container_height - this.props.container_margin), overflowY: 'scroll' } : {};
        var tr_style = (this.state.container_width > 0) ? { display: 'table', width: this.state.container_width } : {};

        return (

            <div className="row">
                <div className="col-lg-12">

                    <form className="table-options row mb-2" autoComplete="off">
                        <button type="submit" disabled style={ { display: 'none' } } aria-hidden="true"></button>

                        { this.state.show_limit &&
                            <div className="col m-b-xs">
                                <select className="form-control-sm form-control input-s-sm inline" name="limit" value={ this.state.limit } onChange={ this.handleLimit.bind(this) }>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="0">All</option>
                                </select>
                            </div>
                        }
                        { filters &&
                            <div className="col m-b-xs">
                                { filters?.length <= this.state.filter_limit &&
                                    <div className="btn-group btn-group-toggle" data-toggle="buttons">
                                        { filters }
                                    </div>
                                }
                                { filters?.length > this.state.filter_limit &&
                                    <select className="form-control input-s-sm inline" name="limit" value={ this.state.filter_button } onChange={ this.handleFilterDropdown.bind(this) } >
                                        <option value="0">- No Category Filter -</option>
                                        { filters }
                                    </select>
                                }
                            </div>
                        }
                        { (this.props.show_search || this.props.button) &&
                            <div className="col m-b-xs">
                                <div className="input-group">
                                    <span style={ { position: 'relative', width: '100%' } }>
                                        { this.props.show_search && this.state.search &&
                                            <i className="fas fa-times-circle" style={ { position: 'absolute', color: '#bbbbbb', zIndex: 9, right: '5px', top: '5px', fontSize: '20px', cursor: 'pointer' } } onClick={ this.handleClearSearch.bind(this) }></i>
                                        }
                                        { this.props.show_search &&
                                            <input name="search" placeholder="Search" type="text" className="form-control" value={ this.state.search } onChange={ this.handleSearch.bind(this) } />
                                        }
                                    </span>
                                    { this.props.button &&
                                        <button type="button" className="btn btn-sm btn-primary ml-3" onClick={ this.handleButton.bind(this) } style={ buttonStyle }>{ this.props.button }</button>
                                    }
                                </div>
                            </div>
                        }
                    </form>

                    <div className="table-responsive-sm">
                        <table className="table table-striped table-hover em">
                            { !this.props.hide_header &&
                                <thead style={ header_style }>
                                    <tr style={ tr_style }>
                                        { columns }
                                        { this.props.delete &&
                                            <th key={ 'delete' }></th>
                                        }
                                    </tr>
                                </thead>
                            }
                            <tbody style={ tbody_style }>
                                { rows
                                    ? rows
                                    : <tr style={ { backgroundColor: 'transparent' } }><td colSpan={ this.props.columns?.length }><h2 className="text-center" style={ { marginTop: '40px' } }>No Records Found</h2></td></tr>
                                }
                            </tbody>
                        </table>

                        { this.state.show_limit &&
                            <div className="btn-group pull-right" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-default" onClick={ this.handleFirst.bind(this) }>First</button>
                                <button type="button" className="btn btn-default" onClick={ this.handlePrevious.bind(this) }>Prev</button>
                                { gap_low &&
                                    <button type="button" className="btn btn-default">...</button>
                                }
                                { pagination }
                                { gap_high &&
                                    <button type="button" className="btn btn-default">...</button>
                                }
                                <button type="button" className="btn btn-default" onClick={ this.handleNext.bind(this, max_page) }>Next</button>
                                <button type="button" className="btn btn-default" onClick={ this.handleLast.bind(this, max_page) }>Last</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
