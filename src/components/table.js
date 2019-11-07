import React from 'react';
import ReactDOM from 'react-dom';

var _ = require('lodash');
var moment = require('moment'); 

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
			}
		};
	}

	componentDidMount() {
		if (_.get(this.props, 'filters.active', null)) {
			this.setState({ filter_button: this.props.filters.active });
		}
		if (this.props.limit) this.setState({ limit: parseInt(this.props.limit), show_limit: true });
		if (this.props.order) this.setState({ order: this.props.order });
		this.updateTableFields();
	}
	componentDidUpdate() {
		// this.updateTableFields();
	}
	updateTableFields() {
		if (this.props.columnDefs) {
			var rows = document.querySelectorAll('tbody tr');
			if (rows.length) {
				rows.forEach((row, index_row) => {
					var tds = row.querySelectorAll('td');
					if (tds.length) {
						tds.forEach((td, index_td) => {
							this.props.columnDefs.forEach((columnDef) => {
								if (index_td == columnDef.targets) {
									columnDef.createdCell(td, td.innerHTML, index_td);
								}
							});
						});
					}
				});
			}
		}
	}

	/* HANDLERS --------------------------------------------------------------------*/

	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	handleFilter(button) {
		this.setState({ filter_button: button });
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
	columnSort(column) {
		var sortindex = (this.state.order) ? this.state.order.fields.indexOf(column.field) : -1;
		var direction = (sortindex > -1) ? ((this.state.order.direction[sortindex] === 'asc') ? 'desc' : 'asc' ) : 'asc';
		var order = {
			fields: [ column.field ],
			direction: [ direction ],
		}
		this.setState({ order });
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

		} else {
			return item[column.field];
		}
	}

	render() {

		var click_append = (this.props.click_append) ? this.props.click_append : '';

		/* Sort ------------------------------------*/

		var ordered_data = (this.state.order) ? _.orderBy(this.props.data, this.state.order.fields, this.state.order.direction) : this.props.data;

		/* Search all Fields -----------------------*/

		var filtered_data = (this.state.search) ? _.filter(ordered_data, (o) => {
			var result = false;
			Object.keys(o).forEach((k, index) => {
				if (typeof o[k] === 'string' && o[k].toLowerCase().includes(this.state.search.toLowerCase())) result = true;
			});
			return result;
		}) : ordered_data;

		/* Filtered --------------------------------*/

		if (this.state.filter_button && this.props.filters.buttons[this.state.filter_button-1].value !== null) {
			filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.props.filters.buttons[this.state.filter_button-1].value }); 
		}

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
					{ column.name }<i className={ 'fa fa-'+sort } style={{ color: '#aaaaaa', marginLeft: '7px' }} />
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
				var link = this.props.click_url+'/'+item[this.props.id]+click_append;
				inputProps.onClick = () => this.props.history.push(link);
			}

			var fields = (this.props.columns.length) ? this.props.columns.map((column, column_index) => {
				if (column.data) {
					var items = [];
					var linked = _.filter(column.data, { [column.link]: item[column.link] });

					if (column.filter){
						column.filter.forEach((element, element_index) => {
							let filtered = _.filter(linked, { [column.filter_field]: element });
							if (filtered.length) items = items.concat(filtered);
						});
					} else {
						items = linked;
					}

					return ( <td key={ 'td'+column_index } { ...inputProps }>{ (items.length) ? this.formatItem(items[0], column) : '' }</td> ); // TODO check for multiple
				} else {
					return ( <td key={ 'td'+column_index } { ...inputProps }>{ this.formatItem(item, column) }</td> );
				}
			}) : null;

			return <tr key={ 'tr'+row_index } style={{ cursor: ((this.props.click) ? 'pointer' : 'default') }}>
				{ fields }
				{ this.props.delete &&
					<td key={ 'delete'+row_index } style={{ cursor: 'pointer' }} onClick={ this.props.onDelete.bind(this, item) }><i className="fa fa-times"></i></td>
				}
			</tr>

		}) : null;

		/* Filter Buttons --------------------------*/

		var filters = (this.props.filters) ? this.props.filters.buttons.map((item, index) => {
			return (
				<label key={ index } className={ 'btn btn-sm' + ((index == this.state.filter_button - 1) ? ' btn-success active' : ' btn-white') } onClick={ this.handleFilter.bind(this, index + 1) }>
					<input type="radio" name="filters" value={ this.state.filter_button } /> { item.name }
				</label>
			)
		}) : null;


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
							{ filters &&
								<div className="btn-group btn-group-toggle" data-toggle="buttons">
									{ filters }
								</div>
							}
						</div>

						<div className="col-sm-4 col-md-5 m-b-xs">
							{ (this.props.search || this.props.new) && 
								<div className="input-group">
									{ this.props.search && 
										<input name="search" placeholder="Search" type="text" className="form-control form-control-sm" value={ this.state.search } onChange={ this.handleChange.bind(this) }/>
									}
									{ this.props.new && 
										<button type="button" className="btn btn-sm btn-primary ml-3" onClick={ () => { this.props.history.push(this.props.click_url+'/0'+click_append) } }>{ this.props.new }</button>
									}
								</div>
							}
						</div>
					</form>

					<div className="table-responsive">
						<table className="table table-striped table-hover" >
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
