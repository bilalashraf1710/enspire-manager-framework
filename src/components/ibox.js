import React from 'react';
import { Spinner } from './spinner';
import { Select } from './form-elements/select';

export function Ibox(props) {

	var styleIbox = (props.mini) ? { marginBottom: '12px' } : {};
	var styleTitle = (props.mini) ? { padding: '10px', minHeight: 'auto', maxHeight: '34px' } : {};
	var styleContent = (props.mini) ? { padding: '10px' } : {};

	var options = (props.dropdown_array) ? props.dropdown_array.map((option, index) => {
		return (
			<option key={ 'option' + index } value={ option }>{ option }</option>
		);
	}) : [];

	return (

		<div id={ this.props.id } className={ 'animated fadeInRight p-0 py ' + props.className } style={ props.style }>
			<div className="ibox" style={ styleIbox }>
				<div className="ibox-title" style={ styleTitle }>
					<h5>{ props.title }
						{ props.icon_array &&
							<div className="ibox-tools" style={ { marginTop: '-5px' } }>
								{
									props.icon_callback_array?.slice().map((callback, index) => {
										if (typeof callback === "function") return (
											<a key={ 'icon' + index } onClick={ () => callback() } className="ml-2" style={ { fontSize: (props.mini) ? '14px' : '18px' } }>
												<i className={ props.icon_array.slice()[index] } style={ { color: '#c4c4c4' } }></i>
											</a>
										);
									})
								}
							</div>
						}
						{ props.button &&
							<button type="button" className="btn btn-sm btn-primary ml-3 pull-right" style={ { marginTop: '-4px' } } onClick={ props.button_callback.bind(this) }>{ props.button }</button>
						}
						{ props.dropdown_callback &&
							<div className={ 'ibox-tools' } style={ { marginTop: '-7px' } }>
								< Select
									noLabel={ true }
									name={ 'dropdown' }
									onChange={ props.dropdown_callback }
									value={ props.dropdown_value }
								>
									{ options }
								</Select>
							</div>
						}
					</h5>
				</div>
				<div className={ 'ibox-content' + ((props.no_fade) ? ' no-fade' : '') + ((props.show_spinner) ? ' sk-loading' : '') } style={ styleContent }>

					<Spinner />

					<div className="px-2">
						{ props.children }
					</div>

				</div>
			</div>
		</div>

	);
}
