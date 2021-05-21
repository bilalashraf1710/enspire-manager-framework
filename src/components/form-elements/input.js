import DatePicker from "react-datepicker";
import React, { Fragment } from 'react';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { ValidateMessage } from './validate-message';
import { elasticSearch } from '../elastic-search';

var _ = require('lodash');
var moment = require('moment'); 

export class Input extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			error: false,
			error_message: null,
			search: '',
			options: [],
			isLoading: false,
		};
		this.field_ref = React.createRef();
	}

	componentDidUpdate() {
		if (this.props.form_error !== undefined) {

			var error = _.find(this.props.form_error, { field: this.props.name })

			if (error && !this.state.error) {

				var error_message = ValidateMessage(error);
				if (this.props.form_error[0].field === this.props.name) {
					if (this.field_ref.current) this.field_ref.current.focus();
					window.toastr.error('Please update your value for <em>'+this.props.label+'</em>', error_message);
				}
				this.setState({ error: true, error_message });

			} else if (!error && this.state.error) {
				this.setState({ error: false, error_message: null });
			}
		}
	}
	async handleSearch(search) {

		var config = {
			table: this.props.table,
			fields: this.props.fields,
			sort: this.props.sort,
		}
		var hits = await elasticSearch(search, config);
		const options = hits.map((hit) => {
			return { target: hit.displayName, id: hit.id }
		})

		this.setState({ options, search, isLoading: false });
		return false; // prevent <Enter> key from reloading
	}


	render() {

		var inputProps = {};
		if (this.props.selectsStart) inputProps.selectsStart = this.props.selectsStart;
		if (this.props.selectsEnd) inputProps.selectsEnd = this.props.selectsEnd;
		if (this.props.startDate) inputProps.startDate = this.props.startDate;
		if (this.props.endDate) inputProps.endDate = this.props.endDate;
		if (this.props.minDate) inputProps.minDate = this.props.minDate;
		if (this.props.name) inputProps.name = this.props.name;
		if (this.props.selected) inputProps.selected = this.props.selected;
		if (this.props.defaultValue) inputProps.defaultValue = this.props.defaultValue;
		else if (this.props.value !== undefined) inputProps.value = this.props.value;
		
		return (

			<div className={ 'form-group '+this.props.className+' '+((this.state.error)?'has-error':'') }>
				
				{ this.props.label &&
					<label style={{ whiteSpace: 'nowrap', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ this.props.label + ((this.props.required)?' *':'') }</label> 
				}
				
				<div className={ 'input-group input-group-sm ' + ((this.props.type === 'date') ? 'date '+this.props.name : '') }>
					{ this.props.prepend &&
						<div className="input-group-prepend">
							<span className="input-group-text input-group-addon">{ this.props.prepend }</span>
						</div>
					}
					{ this.props.type == 'text' &&
						<input 
							autoComplete="off" 
							className="form-control form-control-sm" 
							name={ this.props.name } 
							onChange={ this.props.onChange.bind(this) } 
							placeholder={ this.props.placeholder } 
							readOnly={ this.props.readOnly }
							ref={ this.field_ref } 
							type="text"
							disabled={ this.props.disabled }
							{ ...inputProps }
						/>
					}
					{ this.props.type == 'typeahead' &&
						<AsyncTypeahead
							id="async-lookahead"
							style={ { width: (this.props.allowNew) ? '88%' : '100%' } }
							allowNew={ this.props.allowNew }
							newSelectionPrefix={ 'ADD NEW: ' }
							filterBy={ () => true }
							isLoading={ this.state.isLoading }
							labelKey="target"
							highlightOnlyResult={ true }
							minLength={ 2 }
							onSearch={ this.handleSearch.bind(this) }
							onChange={ this.props.onChange.bind(this, this.props.name) }
							options={ this.state.options }
							placeholder={ this.props.placeholder }
							renderMenuItemChildren={ (options, props) => (
								<Fragment>
									<span>{ options.target }</span>
								</Fragment>
							) }
						/>
					}
					{ this.props.type == 'typeahead' && this.props.allowNew &&
						<div className="input-group-append">
							<button className="btn btn-primary" type="button" onClick={ () => { this.props.onChange([{ customOption: true, target: '' }]) } }>+ New</button>
						</div>
					}
					{ this.props.type == 'date' &&
						<DatePicker
							className="form-control form-control-sm" 
							dateFormat="MM-dd-yyyy"
							isClearable={ true }
							onChange={ this.props.onChange.bind(this, this.props.name) }
							{ ...inputProps }
						/>
					}
					{ this.props.append &&
						<div className="input-group-append input-group-sm">
							<span className="input-group-text input-group-addon">{ this.props.append }</span>
						</div>
					}
					{ this.state.error_message &&
						<div className="invalid-feedback" style={{ display: 'block' }}>
							{ this.state.error_message }
						</div>
					}
				</div>
			</div>
		);
	}
}
