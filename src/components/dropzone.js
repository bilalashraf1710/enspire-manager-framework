import axios from 'axios';
import React from 'react';
import { ModalAlert } from './modal_alert';

export class Dropzone extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			uploading: false,
			progress: 0,
			counter: 0,
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
		ModalAlert({
			callback: () => { this.props.onChange(this.props.field, null) },
			text: 'The Existing Image will be Removed!',
			title: 'Are you sure?',
			type: 'warning',
		});
	}
	chooseFile(e) {
		var file = e.target.files[0];
		this.uploadFile(file);
	}
	uploadFile(file) {

		this.setState({ hover: true, uploading: true, progress: 3 });
		var filename = this.props.directory+'/'+(Date.now())+'.jpg'; // + file.name;

		axios.get('https://app.enspireservers.com:3001/aws/sign/'+this.props.bin+'/'+encodeURIComponent(filename)+'/'+encodeURIComponent(file.type), 
			null, { headers: { 'Content-Type': 'text/plain' } }).then((result) => {

			var options = {
				headers: { 'Content-Type': file.type },
				onUploadProgress: progressEvent => this.setState({ progress: progressEvent.loaded / file.size * 100 })
			};

			axios.put(result.data, file, options).then((result) => {
				this.props.onChange(this.props.field, 'https://' + this.props.bin + '.s3.amazonaws.com/' + filename);
				this.setState({ progress: 0, hover: false, uploading: false });
			}).catch((error) => {
				console.log(error);
			});

		}).catch((error) => {
			console.log(error);
		});
	}

	render() {

		// TODO - handle multiple files at a time with prop multiple = TRUE

		return (

			<div style={{ width: '100%', marginLeft: '5px', marginRight: '5px' }}>
				{ this.props.filename 

					? 	<div style={{ position: 'relative', textAlign: 'center', border: '1px solid #e5e6e7', padding: '10px' }}>
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
							<img src={ this.props.filename  } width={ this.props.width } style={{ width: '100%' }} />
						</div>

					:	<div id={ 'dropzone' } 
							className={ this.props.className + (this.state.hover ? ' highlight' : '') } 
							style={{ width: '100%', height: (this.props.maxHeight) ? this.props.maxHeight : '250px' }}
						>
						 	{ this.state.uploading

								?	<div>
										<h3>
											{ this.state.progress > 0
												?	<span>Uploading...</span>
												: 	<span>Finished!</span>
											}
										</h3>
										{ this.state.progress > 0 &&
											<div className="progress mt-3 mb-3" style={{ backgroundColor: 'white' }}>
												<div className="progress-bar" style={{ width: this.state.progress+'%' }} role="progressbar"></div>
											</div>
										}
									</div>

								: 	<h3>
										<i className="fa fa-upload fa-3x mb-3" style={{ color: '#cccccc', marginTop: '15px' }}></i>
										<br/>
										{ this.state.hover
											? 	<span>
													<strong>Drop Here!!</strong>
												</span>
											: 	<span>
													<label style={{ cursor: 'pointer' }}>
														<strong>Choose a file</strong>
														<input type="file" style={{ display: 'none' }} onChange={ this.chooseFile.bind(this) } />
													</label>&nbsp;or Drag here
												</span>
										}
									</h3>
							}
						</div>
				}
			</div>
		);
	}
}
