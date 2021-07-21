import React from 'react';
import { Spinner } from './spinner';
import { pdfjs, Document, Page } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export class PdfPreview extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			pdfPage: 1,
			pdfPages: 1,
		};
	}

	handlePagination(value) {
		this.setState({ pdfPage: value });
	}
	handlePageInc(inc) {
		let page = this.state.pdfPage + inc;
		if (page < 1) page = 1;
		if (page > this.state.pdfPages) page = this.state.pdfPages;
		this.setState({ pdfPage: page });
	}
	onDocumentLoadSuccess({ numPages }) {
		this.setState({ pdfPages: numPages });
	}

	render() {

		var pagination = [];
		for (var i = 1; i <= this.state.pdfPages; i++) {
			pagination.push(<button key={ 'button' + i } className={ 'btn btn-white ' + ((this.state.pdfPage == i) ? 'active' : '') } onClick={ this.handlePagination.bind(this, i) }>{ i }</button>);
		}

		var height = (this.props.width) ? this.props.width * 1.5 : 600;

		return (

			<div className={ (this.props.centered) ? 'text-center' : '' } style={ { width: (this.props.width) ? this.props.width : 400, height: height }}>
				<Document
					file={ this.props.file }
					loading={ <Spinner style={{ marginTop: (height * .40) + 'px', marginBottom: (height * .40) + 'px' }} /> }
					onLoadSuccess={ this.onDocumentLoadSuccess.bind(this) }
					onLoadError={ console.error }
				>
					<Page pageNumber={ this.state.pdfPage } width={ (this.props.width) ? this.props.width : 400 } renderMode="svg" />
				</Document>
				
				{ this.props.pagination !== false &&
					<div className="btn-group">
						<button type="button" className="btn btn-white" onClick={ this.handlePageInc.bind(this, -1) }><i className="fa fa-chevron-left"></i></button>
						{ pagination }
						<button type="button" className="btn btn-white" onClick={ this.handlePageInc.bind(this, 1) }><i className="fa fa-chevron-right"></i> </button>
					</div>
				}

				{ this.props.download_link !== false &&
					<p className="mt-3"><a href={ this.props.file } target="_blank">Open in Browser <i className="fas fa-external-link-alt"></i></a></p>
				}
			</div>
		);
	}
}
