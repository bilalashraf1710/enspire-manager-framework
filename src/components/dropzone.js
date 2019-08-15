import axios from 'axios';
import React from 'react';
import { SweetAlert } from './sweet_alert';

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

		['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
			dropzone.addEventListener(eventName, preventDefaults, false);
		});
		
		dropzone.addEventListener('dragenter', this.dragenter.bind(this), false);
		dropzone.addEventListener('dragleave', this.dragleave.bind(this), false);
		dropzone.addEventListener('drop', this.dropped.bind(this), false);

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
		SweetAlert({
			text: 'The Existing Image will be Removed!',
			title: 'Are you sure?',
			type: 'warning',
			callback: () => { this.props.onChange(null) },
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
				this.props.onChange('https://enspiremanager-uploads.s3.amazonaws.com/' + filename);
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

			<div>
				{ this.props.filename 

					? 	<div style={{ position: 'relative' }}>
							<i className="fa fa-times-circle-o fa-3x" 
								style={{ 
									color: 'white', 
									cursor: 'pointer',
									opacity: '.5', 
									position: 'absolute', 
									right: '3px', 
									textShadow: '2px 2px 5px black', 
									top: '3px', 
									zIndex: '100', 
								}}
								onClick={ this.removeFile.bind(this) }
							></i>
							<img className={ this.props.className } src={ this.props.filename  } width={ this.props.width } />
						</div>

					:	<div id={ 'dropzone' } 
							className={ this.props.className + (this.state.hover ? ' highlight' : '') } 
							style={{ width: this.props.width, height: (this.props.height) ? this.props.height : '250px' }}
						>
						 	{ this.state.uploading

								?	<div style={{ width: '60%' }}>
										<h3>
											{ this.state.progress > 0
												?	<span>Uploading...</span>
												: 	<span>Finished!</span>
											}
										</h3>
										{ this.state.progress > 0 &&
											<div className="progress mt-3" style={{ backgroundColor: 'white' }}>
												<div className="progress-bar" style={{ width: this.state.progress+'%' }} role="progressbar"></div>
											</div>
										}
									</div>

								: 	<h3>
										<i className="fa fa-upload fa-4x mb-3" style={{ color: '#888888' }}></i>
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
