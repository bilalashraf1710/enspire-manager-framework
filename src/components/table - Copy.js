import React from 'react';

var _ = require('lodash');
var moment = require('moment'); 

export class Table extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			search: '',
			filter_button: 0,
			page: 0,
		};
	}

	componentDidMount() {
		if (_.get(this.props, 'filters.active', null)) {
			this.setState({ filter_button: this.props.filters.active });
		}
	}
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
		var ordered_data = (this.props.order) ? _.orderBy(this.props.data, this.props.order.fields, this.props.order.direction) : this.props.data;

		/* Search all Fields -----------------------*/
		var filtered_data = (this.state.search) ? _.filter(ordered_data, (o) => {
			var result = false;
			Object.keys(o).forEach((k, index) => {
				if (o[k] && o[k].toLowerCase().includes(this.state.search.toLowerCase())) result = true;
			});
			return result;
		}) : ordered_data;

		/* Filtered --------------------------------*/
		if (this.state.filter_button && this.props.filters.buttons[this.state.filter_button-1].value !== null) {
			filtered_data = _.filter(filtered_data, { [this.props.filters.field]: this.props.filters.buttons[this.state.filter_button-1].value }); 
		}

		/* Display ---------------------------------*/
		var limit = parseInt(this.props.limit);
		var page = this.state.page;
		var display_data = (this.props.limit && parseInt(this.props.limit) > 0)
			? filtered_data.slice(page * limit, page * limit + limit)
			: filtered_data;

		/* Columns ---------------------------------*/
		var columns = (this.props.columns.length) ? this.props.columns.map((column, index) => {
			return ( <th key={ index }>{ column.name }</th> );
		}) : null;

		/* Pagination ---------------------------------*/
		var gap_low = false;
		var gap_high = false;
		var max_page;
		var pagination = [];
		for (var i=0; i * parseInt(this.props.limit) < filtered_data.length; i++) {

			if (i < this.state.page - 3) {
				gap_low = true;
			} else if (i > this.state.page + 3) {
				gap_high = true;
			} else {
				pagination.push(
					<button key={ i } type="button" className={ 'btn btn-'+((this.state.page == i)?'primary':'default') } onClick={ this.handlePage.bind(this, i) }>{ i + 1 }</button>
				);
			}
			max_page = i;
		}

		/* Rows ------------------------------------*/
		var rows = (display_data.length) ? display_data.map((item, index) => {

			var inputProps = {};
			if (this.props.click) {
				var link = this.props.click_url+'/'+item[this.props.id]+click_append;
				inputProps.onClick = () => this.props.history.push(link);
			}

			var fields = (this.props.columns.length) ? this.props.columns.map((column, i) => {
				if (column.data) {
					var items = [];
					var linked = _.filter(column.data, { [column.link]: item[column.link] });

					if (column.filter){
						column.filter.forEach((element, index) => {
							let filtered = _.filter(linked, { [column.filter_field]: element });
							if (filtered.length) items = items.concat(filtered);
						});
					} else {
						items = linked;
					}

					return ( <td key={ i } { ...inputProps }>{ (items.length) ? this.formatItem(items[0], column) : '' }</td> ); // TODO check for multiple
				} else {
					return ( <td key={ i } { ...inputProps }>{ this.formatItem(item, column) }</td> );
				}
			}) : null;

			return <tr key={ index } style={{ cursor: ((this.props.click) ? 'pointer' : 'default') }}>
				{ fields }
				{ this.props.delete &&
					<td key={ 'delete' } style={{ cursor: 'pointer' }} onClick={ this.props.onDelete.bind(this, item) }><i className="fa fa-times"></i></td>
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

						<div className="col-sm-3 m-b-xs">
							{ this.props.limit && 
								<select className="form-control-sm form-control input-s-sm inline" defaultValue={ this.props.limit }>
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

						<div className="col-sm-4 m-b-xs">
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
						
						{ this.props.limit &&
							<div class="btn-group pull-right" role="group" aria-label="Basic example">
								<button type="button" class="btn btn-default" onClick={ this.handlePrevious.bind(this) }>Previous</button>
								{ gap_low &&
									<button type="button" class="btn btn-default">...</button>
								}
								{ pagination }
								{ gap_high &&
									<button type="button" class="btn btn-default">...</button>
								}
								<button type="button" class="btn btn-default" onClick={ this.handleNext.bind(this, max_page) }>Next</button>
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}
