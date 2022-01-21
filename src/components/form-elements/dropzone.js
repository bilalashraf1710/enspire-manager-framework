import React from 'react';
import _ from 'lodash';
import { PdfPreview } from '../pdf-preview';
import { ValidateMessage } from './validate-message';

export class Dropzone extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			uploading: false,
			progress: 1, // Keeps screen from jumping when upload starts
			counter: 0,
			pdfPage: 1,
			pdfPages: 1,
		};
	}

	componentDidMount() {
		var dropzone = document.getElementById('dropzone');

		if (dropzone) {
			['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
				dropzone.addEventListener(eventName, preventDefaults, false);
			});
			
			dropzone.addEventListener('dragenter', this.dragenter.bind(this), false);
			dropzone.addEventListener('dragleave', this.dragleave.bind(this), false);
			dropzone.addEventListener('drop', this.dropped.bind(this), false);
		}

		function preventDefaults(e) {
			e.preventDefault();
			e.stopPropagation();
		}
	}
    componentDidUpdate() {
		if (typeof this.props.onChange !== 'function') console.error('Missing onChange callback');

		if (this.props.form_error !== undefined) {

			var error = _.find(this.props.form_error, { field: this.props.field })

			if (error && !this.state.error) {

				var error_message = ValidateMessage(error);
				if (this.props.form_error[0].field === this.props.field) {
					window.toastr.error('Please upload a File', error_message);
				}
				this.setState({ error: true, error_message });

			} else if (!error && this.state.error) {
				this.setState({ error: false, error_message: null });
			}
		}
	}

	dragenter() {
		this.setState({ counter: this.state.counter+1 });
		this.highlight(true);
	}
	dragleave() {
		this.setState({ counter: this.state.counter-1 });
		if (this.state.counter == 0) {
			this.highlight(false);
		}
	}
	highlight(value) {
		this.setState({ hover: value });
	}
	dropped(e) {
		let dt = e.dataTransfer
		let file = dt.files[0];
		if (file) this.uploadFile(file);
	}
	removeFile() {
		this.props.onChange(this.props.field, null)
		window.toastr.info('The image will be permanently removed or replaced only after Saving', 'Image Removed');
	}
	chooseFile(e) {
		var file = e.target.files[0];
		this.uploadFile(file);
	}
	uploadFile(file) {
		console.error(file);
		console.error(this.props);
		if (this.props.storage == 's3') this.uploadS3(file);
		if (this.props.storage == 'firebase') this.uploadFirestore(file);
	}
	handlePagination(value) {
		this.setState({ pdfPage: value });
	}
	handlePageShift(shift) {
		let page = this.state.pdfPage + shift;
		if (page < 1) page = 1;
		if (page > this.state.pdfPages) page = this.state.pdfPages;
		this.setState({ pdfPage: page });
	}
	onDocumentLoadSuccess({ numPages }) {
		this.setState({ pdfPages: numPages });
	}

	uploadFirestore(file) {
		
		var metadata = { contentType: file.type };
		var ext = '';
		if (file.type.endsWith('pdf')) ext = '.pdf';
		if (file.type.endsWith('jpeg')) ext = '.jpg';
		if (file.type.endsWith('png')) ext = '.png';
		if (file.type.endsWith('pdf')) ext = '.pdf';
		if (file.type.endsWith('xlsx')) ext = '.xlsx';
		if (file.type.endsWith('sheet')) ext = '.xlsx';

		var filename = ((this.props.directory) ? this.props.directory + '/' : '') + ((this.props.filename) ? this.props.filename : (Date.now()) + ext);
		var uploadTask = this.props.storageRef.child(this.props.bin + '/' + filename).put(file, metadata);

		this.setState({ hover: true, uploading: true, progress: 1 });

		uploadTask.on('state_changed', (snapshot) => {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			this.setState({ progress: progress });
		}, (error) => {
			console.error(error);
		}, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				this.props.onChange(this.props.field, downloadURL, filename, file.type);
			});
			setTimeout(() => {
				this.setState({ progress: 1, hover: false, uploading: false });
			}, 500);
		});		
	}
	uploadS3(file) {

		// var filename = this.props.directory+'/'+(Date.now())+'.jpg'; // + file.name;
		
		// this.setState({ hover: true, uploading: true, progress: 3 });
		// axios.get('https://app.enspireservers.com:3001/aws/sign/'+this.props.bin+'/'+encodeURIComponent(filename)+'/'+encodeURIComponent(file.type), 
		// 	null, { headers: { 'Content-Type': 'text/plain' } }).then((result) => {

		// 	var options = {
		// 		headers: { 'Content-Type': file.type },
		// 		onUploadProgress: progressEvent => this.setState({ progress: progressEvent.loaded / file.size * 100 })
		// 	};

		// 	axios.put(result.data, file, options).then((result) => {
		// 		this.props.onChange(this.props.field, 'https://' + this.props.bin + '.s3.amazonaws.com/' + filename);
		// 		this.setState({ progress: 0, hover: false, uploading: false });
		// 	}).catch((error) => {
		// 		console.log(error);
		// 	});

		// }).catch((error) => {
		// 	console.log(error);
		// });
	}

	render() {

		// TODO - handle multiple files at a time with prop multiple = TRUE
		var pagination = [];
		for (var i = 1; i <= this.state.pdfPages; i++) {
			pagination.push(<button className={ 'btn btn-white ' + ((this.state.pdfPage == i) ? 'active' : '') } onClick={ this.handlePagination.bind(this, i) }>{ i }</button>);
		}


		return (

			<div className={ this.props.className } style={{ width: '100%', paddingLeft: '5px', paddingRight: '5px', margin: '8px 0' }}>
				
				{ this.props.label && <p>{ this.props.label + ((this.props.required)?' *':'') }</p> }

				{ this.props.image &&
					<div style={{ position: 'relative', textAlign: 'center', border: '1px solid #e5e6e7', padding: '10px' }}>
						{ !this.props.readOnly &&
							<i className="far fa-times-circle fa-3x" 
								style={{ 
									color: 'white', 
									cursor: 'pointer',
									opacity: '.5', 
									position: 'absolute', 
									right: '5px', 
									textShadow: '2px 2px 5px black', 
									top: '3px', 
									zIndex: '100', 
								}}
								onClick={ this.removeFile.bind(this) }
							></i>
						}
						{ (this.props.image.includes('.jpg') || this.props.image.includes('.jpeg') || this.props.image.includes('.png')) &&
							<div>
								<img src={ this.props.image  } width={ this.props.width } style={{ width: '100%' }} />
								<p><a href={ this.props.image } target="_blank">Open in Browser</a></p>
							</div>
						}
						{ this.props.image.includes('.pdf') &&
							<PdfPreview file={ this.props.image } width={ 400 } centered={ true }/>
						}
					</div>
				}

				{ !this.props.image &&

					<>
						{ this.props.readOnly
						?   <div style={ { padding: '20px', textAlign: 'center', border: '1px solid #e5e6e7' }}>
                                <h3>No File Available</h3>
                            </div>
                        : 	<>
                                <div id={ 'dropzone' } className={ ((this.state.error)?'has-error':'') }>
                                    <div className={ (this.state.hover ? ' highlight' : '') } 
                                        style={ { height: (this.props.maxHeight) ? this.props.maxHeight : '250px' }}
                                    >
                                        <>
                                            { this.state.uploading

                                                ?	<div>
                                                        <h3><span>Uploading...</span></h3>
                                                        { this.state.progress > 0 &&
                                                            <div className="progress mt-3 mb-3" style={{ backgroundColor: 'white' }}>
                                                                <div className="progress-bar" style={{ width: this.state.progress+'%' }} role="progressbar"></div>
                                                            </div>
                                                        }
                                                    </div>

                                                : 	<h3 style={{ backgroundColor: 'transparent' }}>
                                                        <i className="fa fa-upload fa-3x mb-3" style={{ color: '#cccccc', marginTop: '15px' }}></i>
                                                        <br/>
                                                        { this.state.hover
                                                            ? 	<span>
                                                                    <strong>Drop Here!!</strong>
                                                                </span>
                                                            : 	<span>
                                                                    <label style={{ cursor: 'pointer' }}>
                                                                        <strong>Choose a file</strong>
                                                                        <input type="file" accept="image/png, image/jpeg, .pdf" style={{ display: 'none' }} onChange={ this.chooseFile.bind(this) } />
                                                                    </label>&nbsp;or Drag here
                                                                </span>
                                                        }
                                                    </h3>
                                            }
                                        </>
                                    </div>
                                </div>
                                { this.state.error_message &&
                                    <div className="invalid-feedback" style={{ display: 'block' }}>
                                        { this.state.error_message }
                                    </div>
                                }
                            </>
						}
					</>
				}
			</div>
		);
	}
}
