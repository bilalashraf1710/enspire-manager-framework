import React from 'react';
import { CompactPicker } from 'react-color';

export class Colorbox extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			displayColorPicker: false,
		};
		this.field_ref = React.createRef();
	}

	componentDidMount() {
		this.setState({ color: this.props.value });
	}

	handleToggle = () => {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};

	handleClose = () => {
		this.setState({ displayColorPicker: false });
	};

	handleChangeColor = (color) => {
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
						<CompactPicker color={ '#' + this.props.value } onChange={ this.handleChangeColor } />
					</div>
				}
			</span>
		);
	}
}
