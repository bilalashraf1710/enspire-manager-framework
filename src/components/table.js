import React from 'react';
import ReactDOM from 'react-dom';
import DatePicker from "react-datepicker";

var _ = require('lodash');
var moment = require('moment'); 
var sessionStorage = window.sessionStorage;

export class Table extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			search: '',
			filter_button: 0,
			page: 0,
			limit: 0,
			show_limit: false,
			order: {
				fields: [],
				direction: []
			},
			storagekey: null,
		};
	}

	componentDidMount() {
		this.loadSessionStorage();
		if (_.get(this.props, 'filters.active', null)) {
			if (this.props.filters.buttons.length <= 5) {
				this.setState({ filter_button: this.props.filters.active });
			} else {
				if (this.props.filters.active > 0) this.setState({ filter_button: this.props.filters.buttons[this.props.filters.active - 1].value });
			}
		}
		if (this.props.limit) {
			this.setState({ limit: parseInt(this.props.limit), show_limit: true });
		}
		if (this.props.order) this.setState({ order: this.props.order });
		if (this.props.filters) this.setState({ filters: this.props.filters });

		this.updateSessionStorage();
	}
	componentDidUpdate() {
		var storagekey = this.props.history.location.pathname.replace (/\//g, "_");
		if (storagekey !== this.state.storagekey) {
			this.loadSessionStorage();
		}
		// this.updateTableFields();
		this.updateSessionStorage();
	}
	loadSessionStorage() {
		if (this.props.savestate) {
			var storagekey = this.props.history.location.pathname.replace (/\//g, "_");
			this.setState({ storagekey });
			if (sessionStorage['table'+storagekey]) {
				this.setState(JSON.parse(sessionStorage['table'+storagekey]));
			}
		}
	}
	updateSessionStorage() {
		if (this.props.savestate) {
			sessionStorage['table'+this.state.storagekey] = JSON.stringify(this.state);
		}
	}

	/* HANDLERS --------------------------------------------------------------------*/

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value, page: 0 });
	}
	handleFilter(button) {
		if (this.state.filter_button === button) button = 0;
		this.setState({ filter_button: button });
	}
	handleFilterDropdown(event) {
		this.setState({ filter_button: event.target.value });
	}
	handlePage(page) {
		this.setState({ page });
	}
	handlePrevious() {
		if (this.state.page > 0) {
			this.setState({ page: this.state.page - 1 });
		}
	}
	handleNext(max_page) {
		if (this.state.page < max_page) {
			this.setState({ page: this.state.page + 1 });
		}
	}
	handleFirst() {
		this.setState({ page: 0 });
	}
	handleLast(max_page) {
		this.setState({ page: max_page });
	}
	handleNewButton() {
		var new_append = (this.props.new_append) ? this.props.new_append : '';
		this.props.history.push(this.props.click_url+'/0'+new_append);
	}

	/* ACTIONS --------------------------------------------------------------------*/

	formatItem(item, column) {
		if (column.type === 'date') {
			if (column.format) {
				return moment(item[column.field]).format(column.format);
			} else console.error('EM Table: Format required for Date field');

		} else if (column.type === 'number') {
			if (column.format) {
				if (column.format === 'usd') {
					return '$ '+parseFloat(item[column.field]).toFixed(2);
				} else console.error('EM Table: Unknown number format'); 
			} else console.error('EM Table: Format required for Number field');
		} else if (column.badge !== null && Array.isArray(column.badge)) {
			var badgestyle = '';
			if (item[column.field] == 1) badgestyle = 'badge-info';
			if (item[column.field] == 2) badgestyle = 'badge-success';
			if (item[column.field] == 3) badgestyle = 'badge-warning';
			if (item[column.field] == 4) badgestyle = 'badge-danger';

			return <span className={ 'badge ' + badgestyle }>{ column.badge[item[column.field]] }</span>
		} else {
			return ((column.prefix) ? column.prefix : '') + item[column.field] + ((column.postfix) ? column.postfix : '');
		}
	}
	columnSort(column) {
		var sortindex = (this.state.order) ? this.state.order.fields.indexOf(column.field) : -1;
		var direction = (sortindex > -1) ? ((this.state.order.direction[sortindex] === 'asc') ? 'desc' : 'asc' ) : 'asc';
		var order = {
			fields: [ column.field ],
			direction: [ direction ],
		}
		this.setState({ order });
	}

	render() {

		var click_append = (this.props.click_append) ? this.props.click_append : '';

		/* Sort ------------------------------------*/

		var ordered_data = (this.state.order) ? _.orderBy(this.props.data, this.state.order.fields, this.state.order.direction) : this.props.data;

		/* Search all Fields -----------------------*/

		var filtered_data = (this.state.search) ? _.filter(ordered_data, (o) => {
			var result = false;
			this.props.columns.forEach((k, index) => {
				if (typeof o[k.field] === 'string' && o[k.field].toLowerCase().includes(this.state.search.toLowerCase())) result = true;
				if (typeof o[k.field] === 'number' && o[k.field].toString().startsWith(this.state.search.toLowerCase())) result = true;
			});
			return result;
		}) : ordered_data;

		/* Filtered --------------------------------*/

		if (_.get(this.props.filters, 'buttons', null)) { // has buttons?
			if (this.props.filters.buttons.length <= 5 ) {
				if (this.state.filter_button && _.get(this.props.filters, 'buttons.'+(this.state.filter_button-1)+'.value', null) !== null) {
					filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.props.filters.buttons[this.state.filter_button-1].value });
				}
			} else {
				if (this.state.filter_button !== 0 && this.state.filter_button !== "0") filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.state.filter_button }); 
			}
		}

		// if (this.state.filter_button && _.get(this.props.filters, 'buttons.'+(this.state.filter_button-1)+'.value', null) !== null) {
		// 	if (this.props.filters.buttons.length <= 5 ) {
		// 		filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.props.filters.buttons[this.state.filter_button-1].value }); 
		// 	} else {
		// 		console.error(this.state.filter_button);
		// 		filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.state.filter_button }); 
		// 	}
		// }

		/* Display ---------------------------------*/

		var page = this.state.page;
		var display_data = (this.state.limit > 0)
			? filtered_data.slice(page * this.state.limit, page * this.state.limit + this.state.limit)
			: filtered_data;

		/* Columns ---------------------------------*/

		var columns = (this.props.columns.length) ? this.props.columns.map((column, index) => {
			var sortindex = (this.state.order) ? this.state.order.fields.indexOf(column.field) : -1;
			var sort = (sortindex > -1) ? ((this.state.order.direction[sortindex] === 'asc') ? 'sort-up' : 'sort-down' ) : null;
			return ( 
				<th key={ 'th'+index } style={{ whiteSpace: 'nowrap' }}><a style={{ cursor: 'pointer' }} onClick={ this.columnSort.bind(this, column) }>
					{ column.name.toUpperCase() }<i className={ 'fa fa-'+sort } style={{ color: '#aaaaaa', marginLeft: '7px' }} />
				</a></th>
			);
		}) : null;

		/* Pagination ---------------------------------*/

		var gap_low = false;
		var gap_high = false;
		var max_page = Math.round(filtered_data.length / this.props.limit);

		var pagination = [];
		if (this.state.limit > 0 && filtered_data.length > this.state.limit) {
			for (var i=0; i * this.props.limit < filtered_data.length; i++) {

				if (i < this.state.page - 2) {
					gap_low = true;
				} else if (i > this.state.page + 2) {
					gap_high = true;
				} else {
					pagination.push(
						<button key={ i } type="button" className={ 'btn btn-'+((this.state.page == i)?'primary':'default') } onClick={ this.handlePage.bind(this, i) }>{ i + 1 }</button>
					);
				}
			}
		}

		/* Rows ------------------------------------*/

		var rows = (display_data.length) ? display_data.map((item, row_index) => {

			var inputProps = {};
			if (this.props.click) {
				inputProps.onClick = () => {
					if (typeof this.props.click_callback === 'function') {
						this.props.click_callback(item[this.props.id]);
					} else {
						let hyperlink = this.props.click_url+'/'+item[this.props.id]+click_append;
						this.props.history.push(hyperlink);
					}
				}
			}

			var fields = (this.props.columns.length) ? this.props.columns.map((column, column_index) => {

				var styles = {};
				if (column.nowrap) {
					styles.whiteSpace = 'nowrap';
				}

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

					if (column.filter){
						column.filter.forEach((element, element_index) => {
							let filtered = _.filter(linked, { [column.filter_field]: element });
							if (filtered.length) items = items.concat(filtered);
						});
					} else {
						items = linked;
					}

					if (column.type == 'select') {

						if (Array.isArray(column.static) && item[column.static[0]] == column.static[2]) {

							let entry = _.find(column.data, { [link_field]: item[link_data_field] });
							if (!entry) 
								return (<td key={ 'td'+column_index }></td>);
							else
								return (
								<td key={ 'td'+column_index }>
									{ entry[column.field] }
								</td>
							);

						} else {

							var select_options = column.data.map((option, select_index) => {
								return (
									<option key={ 'select'+select_index } value={ option[link_field] }>{ option[column.field] }</option>
								);
							});

							return (
								<td key={ 'td'+column_index }>
									<select 
										className="form-control" 
										name={ link_data_field } 
										onChange={ this.props.select_callback.bind(this, item[this.props.id]) } 
										value={ (item[link_data_field]) ? item[link_data_field] : ''  }
									>
										<option value="">Choose...</option>
										{ select_options }
									</select>
								</td>
							);
						}

					} else {
						return ( <td key={ 'td'+column_index } { ...inputProps } style={ styles }>{ (items.length) ? this.formatItem(items[0], column) : '' }</td> ); // TODO check for multiple
					}

				} else {

					if (column.type == 'datepicker') {

						var selected = (item[item.field] !== null) ? moment(item[item.field]).toDate() : '';

						if (Array.isArray(column.static) && item[column.static[0]] == column.static[2]) {

							let entry = _.find(column.data, { [link_field]: item[link_data_field] })
							return (
								<td>
									{ moment(selected).format('M-DD-YYYY') }
								</td>
							);

						} else {

							return (
								<td width="200">
									<div className="input-group">
										<div className="input-group-prepend">
											<span className="input-group-text input-group-addon"><i className="far fa-calendar-alt"></i></span>
										</div>
										<DatePicker
											className="form-control" 
											dateFormat="M-dd-yyyy"
											selected={ selected }
											onChange={ this.props.datepicker_callback.bind(this, item[this.props.id]) } 
										/>
									</div>
								</td>
							);
						}
						
					} else {
						return ( <td key={ 'td'+column_index } { ...inputProps } style={ styles }>{ this.formatItem(item, column) }</td> );
					}
				}
			}) : null;

			var highlight = null;
			if (this.props.highlight) {
				this.props.highlight.forEach((entry, index) => {
					if (item[entry.field] == entry.value) {
						highlight = { border: '2px solid '+entry.border, backgroundColor: entry.color }
					}
				});
				
			}

			return <tr key={ 'tr'+row_index } style={{ cursor: ((this.props.click) ? 'pointer' : 'default'), ...highlight }}>
				{ fields }
				{ this.props.delete &&
					<td key={ 'delete'+row_index } style={{ cursor: 'pointer' }} onClick={ this.props.onDelete.bind(this, item) }><i className="fa fa-times"></i></td>
				}
			</tr>

		}) : null;

		/* Filter Buttons / Dropdown --------------------------*/

		var filters;
		if (this.props.filters && this.props.filters.buttons.length <= 5) {
			filters = (this.props.filters) ? this.props.filters.buttons.map((item, index) => {
				return (
					<label key={ 'filter'+index } className={'btn btn-sm' + ((index == this.state.filter_button - 1) ? ' btn-primary active' : ' btn-white')} onClick={this.handleFilter.bind(this, index + 1)}>
						<input type="radio" name="filters" value={this.state.filter_button} /> {item.name}
					</label>
				)
			}) : null;
		} else {
			filters = (this.props.filters) ? this.props.filters.buttons.map((item, index) => {
				return (
					<option key={'filter' + index} value={ item.value }>{ item.name }</option>
				)
			}) : null;
		}

		return (

			<div className="row">
				<div className="col-lg-12">

					<form className="row" autoComplete="off">

						<div className="col-sm-3 col-md-2 m-b-xs">
							{ this.state.show_limit &&
								<select className="form-control-sm form-control input-s-sm inline" name="limit" value={ this.state.limit } onChange={ this.handleChange.bind(this) }>
									<option value="10">10</option>
									<option value="25">25</option>
									<option value="50">50</option>
									<option value="100">100</option>
									<option value="0">All</option>
								</select>
							}
						</div>

						<div className="col-sm-5 m-b-xs">
							{ filters && filters.length <= 5
								?	<div className="btn-group btn-group-toggle" data-toggle="buttons">
										{ filters }
									</div>
								:	<select className="form-control-sm form-control input-s-sm inline" name="limit" value={ this.state.filter_button } onChange={ this.handleFilterDropdown.bind(this) }>
										<option value="0">- Category Filter -</option>
										{ filters  }
									</select>
							}
						</div>

						<div className="col-sm-4 col-md-5 m-b-xs">
							{ (this.props.search || this.props.new) && 
								<div className="input-group" style={{ position: 'relative' }}>
									{ this.props.search && this.state.search &&
										<i className="fas fa-times-circle" style={{ position: 'absolute', color: '#bbbbbb', zIndex: 9, right: '140px', top: '5px', fontSize: '20px', cursor: 'pointer' }} onClick={ () => { this.setState({ search: '' }); } }></i>
									}
									{ this.props.search && 
										<input name="search" placeholder="Search" type="text" className="form-control form-control-sm" value={ this.state.search } onChange={ this.handleChange.bind(this) }/>
									}
									{ this.props.new && 
										<button type="button" className="btn btn-sm btn-primary ml-3" onClick={ this.handleNewButton.bind(this) }>{ this.props.new }</button>
									}
									{ this.props.button }
								</div>
							}
						</div>
					</form>

					<div className="table-responsive-sm">
						<table className="table table-striped table-hover em">
							<thead>
								<tr>
									{ columns }
									{ this.props.delete &&
										<th key={ 'delete' }></th>
									}
								</tr>
							</thead>
							<tbody>
								{ rows
									?	rows
									: 	<tr style={{ backgroundColor: 'transparent' }}><td colSpan={ this.props.columns.length }><h2 className="text-center" style={{ marginTop: '40px' }}>No Records Found</h2></td></tr>
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
