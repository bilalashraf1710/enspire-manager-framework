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
			hits: [],
			isLoading: false,
			disableNew: false,
		};
		this.field_ref = React.createRef();
	}

	componentDidUpdate() {
		if (typeof this.props.onChange !== 'function') console.error('Missing onChange callback');

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
	onChangeEmail(event) {
		event.target.value = event.target.value.toLowerCase();
		this.props.onChange(event);
	}
	onBlurEmail(event) {
		event.target.value = event.target.value.toLowerCase();
		this.props.onBlur?.(event);
	}
	onTypeaheadChange(result) {
		var disableNew = (_.find(this.state.hits, (o) => { return o[this.props.target]?.trim() == result?.[0]?.target?.trim() })) ? true : false;
		this.setState({ disableNew });
		this.props.onChange(this.props.name, result);
	}
	async handleSearch(appId, search) {

		this.setState({ isLoading: true });
		var config = {
			table: this.props.table,
			fields: this.props.fields,
			sort: this.props.sort,
			appId: appId, // waiting to add appId to Service Items index.
		}
		var hits = await elasticSearch(search, config);
		const options = hits.map((hit) => {
			return { target: hit[this.props.target], id: hit[this.props.id] }
		});
		var disableNew = (_.find(hits, (o) => { return o[this.props.target]?.trim() == search?.trim() })) ? true : false;

		this.setState({ options, search, hits, isLoading: false, disableNew });
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
				
				{ this.props.hideLabel
					? 	<label>&nbsp;</label>
					: 	<>
							{ this.props.noLabel
								? <></>
								: <label style={{ whiteSpace: 'nowrap', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ this.props.label + ((this.props.required)?' *':'') }</label>
							}
						</>
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
							onBlur={ this.props.onBlur?.bind(this) } 
							placeholder={ this.props.placeholder } 
							readOnly={ this.props.readOnly }
							ref={ this.field_ref } 
							type="text"
							disabled={ this.props.disabled }
							{ ...inputProps }
						/>
					}
					{ this.props.type == 'email' &&
						<input 
							autoComplete="off" 
							className="form-control form-control-sm" 
							name={ this.props.name } 
							onChange={ this.onChangeEmail.bind(this) } 
							onBlur={ this.onBlurEmail.bind(this) } 
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
							onSearch={ this.handleSearch.bind(this, this.props.appId) }
							onChange={ this.onTypeaheadChange.bind(this) }
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
							<button className="btn btn-primary" type="button" disabled={ this.state.disableNew } onClick={ () => { this.props.onChange(this.props.name, [{ customOption: true, target: this.state.search }]) } }>+ New</button>
						</div>
					}
					{ this.props.type == 'date' &&
						<DatePicker
							className="form-control form-control-sm" 
							dateFormat="MM-dd-yyyy"
							isClearable={ false }
                            dateFormat={ this.props.dateFormat }
                            showTimeSelect={ this.props.showTimeSelect }
                            timeFormat={ this.props.timeFormat }
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
