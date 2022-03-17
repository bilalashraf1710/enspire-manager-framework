import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

export class Agile extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};
	}

	handleToggle() {
		this.setState({ show: !this.state.show });
	}

	render() {

		var color_class;
		switch (this.props.color_number) {
			case 0: color_class = 'muted-element'; break;
			case 1: color_class = 'primary-element'; break;
			case 2: color_class = 'success-element'; break;
			case 3: color_class = 'info-element'; break;
			case 4: color_class = 'warning-element'; break;
			case 5: color_class = 'danger-element'; break;
		}

		var links = (this.props.links) ? this.props.links.map((link, index) => {
			if (link.divider) return (
				<li className="dropdown-divider"></li>
			)

			return (
				<li key={ index }><a className="dropdown-item" href={ link.href } onClick={ (typeof link.callback === "function") ? () => { link.callback(this.props.id) } : null }>{ link.title }</a></li>
			);
		}) : null;

		var dropdown = (
			<ul className="dropdown-menu dropdown-menu-right" x-placement="bottom-start">
				{ links }
			</ul>
		);


		let style = (typeof this.props.onClick === "function") ? { cursor: 'pointer' } : null;
		let TitleTag = (this.props.titleTag) ? this.props.titleTag : 'p';
		let titleStyle = { fontWeight: (this.props.bold === false) ? 'normal' : 'bold' };


		return (

			<li className={ 'agile ui-sortable-handle fadeInDown ' + color_class + ' ' + this.props.className } onClick={ (typeof this.props.callback === "function") ? () => { this.props.onClick(this.props.id) } : null }>

				{ links &&
					<div className="btn-group float-right">
						<OverlayTrigger
							trigger={ 'click' }
							placement="bottom"
							overlay={ dropdown }
							show={ this.state.show }
							onToggle={ this.handleToggle.bind(this) }
						>
							<button className="dropdown-toggle btn btn-white" aria-expanded="false" style={ { padding: '0px 10px', marginTop: '-2px', border: 'none' } }></button>
						</OverlayTrigger>
					</div>
				}
				{ this.props.title &&
					<TitleTag className="m-0 p-0" style={ titleStyle }>{ this.props.title }</TitleTag>
				}
				{ this.props.detail &&
					<div className="agile-detail" style={ { fontSize: '11px' } }>
						{ this.props.detail } {/*<i className="far fa-clock"></i> 12.10.2015 */ }
					</div>
				}
			</li>
		);
	}
}
