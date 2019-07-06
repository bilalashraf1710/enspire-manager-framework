import React from 'react';

var _ = require('lodash');
var moment = require('moment'); 

export class Table extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			search: '',
			filter_button: 0,
		};
	}

	componentDidMount() {
		if (_.get(this.props.options, 'filters.active', null)) {
			this.setState({ filter_button: this.props.options.filters.active });
		}
	}
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
	}
	handleFilter(button) {
		this.setState({ filter_button: button });
	}
	formatItem(item, column) {
		if (column.date_format) {
			return moment(item[column.field]).format(column.date_format);
		} else {
			return item[column.field];
		}
	}

	render() {

		/* Sort ------------------------------------*/

		var ordered_data = (this.props.options.order) ? _.orderBy(this.props.options.data, this.props.options.order.fields, this.props.options.order.direction) : this.props.options.data;

		/* Search all Fields -----------------------*/
	
		var filtered_data = (this.state.search) ? _.filter(ordered_data, (o) => {
			var result = false;
			Object.keys(o).forEach((k, index) => {
				if (o[k] && o[k].toLowerCase().includes(this.state.search.toLowerCase())) result = true;
			});
			return result;
		}) : ordered_data;

		if (this.state.filter_button && this.props.options.filters.buttons[this.state.filter_button-1].value !== null) {
			filtered_data = _.filter(filtered_data, { [this.props.options.filters.field]: this.props.options.filters.buttons[this.state.filter_button-1].value }); 
		}

		/* Columns ---------------------------------*/

		var columns = (this.props.options.columns.length) ? this.props.options.columns.map((column, index) => {
			return ( <th key={ index }>{ column.name }</th> );
		}) : null;

		/* Rows ------------------------------------*/

		var rows = (filtered_data.length) ? filtered_data.map((item, index) => {
			var fields = (this.props.options.columns.length) ? this.props.options.columns.map((column, i) => {
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

					return ( <td key={ i }>{ (items.length) ? this.formatItem(items[0], column) : '' }</td> ); // TODO check for multiple
				} else {
					return ( <td key={ i }>{ this.formatItem(item, column) }</td> );
				}
			}) : null;
			return <tr key={ index } style={{ cursor: 'pointer' }} onClick={ () => this.props.history.push(this.props.options.click_url+item[this.props.options.click_id]) }>{ fields }</tr>
		}) : null;

		/* Filter Buttons --------------------------*/

		var filters = (this.props.options.filters) ? this.props.options.filters.buttons.map((item, index) => {
			return (
				<label key={ index } className={ 'btn btn-sm' + ((index == this.state.filter_button - 1) ? ' btn-success active' : ' btn-white') } onClick={ this.handleFilter.bind(this, index + 1) }>
					<input type="radio" name="filters" value={ this.state.filter_button } /> { item.name }
				</label>
			)
		}) : null;


		return (

			<div className="wrapper wrapper-content animated fadeInRight pt-0">
				<div className="row">
					<div className="col-lg-12">

						<form className="row" autoComplete="off">

							<div className="col-sm-3 m-b-xs">
								{ this.props.options.limit && 
									<select className="form-control-sm form-control input-s-sm inline" defaultValue={ this.props.options.limit }>
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
								{ this.props.options.search && 
									<div className="input-group">
										<input name="search" placeholder="Search" type="text" className="form-control form-control-sm" value={ this.state.search } onChange={ this.handleChange.bind(this) }/>
										<button type="button" className="btn btn-sm btn-primary ml-3" onClick={ () => { this.props.history.push(this.props.options.click_url+'0') } }>{ '+ New '+this.props.options.item }</button>
									</div>
								}
							</div>
						</form>

						<div className="table-responsive">
							<table className="table table-striped table-hover" >
								<thead>
									<tr>
										{ columns }
									</tr>
								</thead>
								<tbody>
								
									{ rows
										?	rows
										: 	<tr style={{ backgroundColor: 'transparent' }}><td colSpan={ this.props.options.columns.length }><h2 className="text-center" style={{ marginTop: '40px' }}>No Records Found</h2></td></tr>
									}

								</tbody>
							</table>
						</div>

					</div>
				</div>
			</div>
		);
	}
}
