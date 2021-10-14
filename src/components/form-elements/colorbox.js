import React from 'react';
import { CompactPicker } from 'react-color';

export class Colorbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			displayColorPicker: false,
			error: false,
			error_message: null,
		};
		this.field_ref = React.createRef();
	}

	componentDidMount() {
		this.setState({ color: this.props.value });
	}
	componentDidUpdate() {
		if (this.props.form_error !== undefined) {

			var error = _.find(this.props.form_error, { field: this.props.name })

			if (error && !this.state.error) {

				var error_message = ValidateMessage(error);

				if (this.props.form_error[0].field === this.props.name) {
					this.field_ref.current.focus();
					window.toastr.error('Please update your value for <em>' + this.props.label + '</em>', error_message);
				}

				this.setState({ error: true, error_message });

			} else if (!error && this.state.error) {
				this.setState({ error: false, error_message: null });
			}
		}
	}
	handleToggle() {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};
	handleClose() {
		this.setState({ displayColorPicker: false });
	};
	handleChangeColor(color) {
		this.props.onChange(this.props.name, color.hex.split('#')[1]);
		this.setState({ displayColorPicker: false });
	};

	render() {

		return (

			<span className={ 'form-group ' + ((this.props.className) ? this.props.className : '') + ' ' + ((this.state.error) ? 'has-error' : '') }>
				{ this.props.hideLabel
					? <label>&nbsp;</label>
					: <>
						{ this.props.noLabel
							? <></>
							: <label style={ { whiteSpace: 'nowrap', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' } }>{ this.props.label + ((this.props.required) ? ' *' : '') }</label>
						}
					</>
				}
				<div className="row mt-2">
					<div className='col-1'>
						<div
							style={ { width: '25px', height: '25px', cursor: 'pointer', backgroundColor: '#' + this.props.value } }
							className="border"
							onClick={ this.handleToggle.bind(this) }
						></div>
					</div>
					<div className="col-10 d-flex justify-content-start align-items-center ml-1"> Choose a Color</div>
				</div>
				<br />

				{ this.state.displayColorPicker &&
					<div style={ { zIndex: '2', position: 'absolute', left: '10px', top: '70px' } }>
						<div style={ { position: 'absolute' } } onClick={ this.handleClose } />
					<CompactPicker color={ '#' + this.props.value } onChange={ this.handleChangeColor.bind(this) } ref={ this.field_ref } />
					</div>
				}
				{ this.state.error_message &&
					<div className="invalid-feedback" style={ { display: 'block' } }>
						{ this.state.error_message }
					</div>
				}
			</span>
		);
	}
}
