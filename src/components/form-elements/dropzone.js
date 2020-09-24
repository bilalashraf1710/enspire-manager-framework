import axios from 'axios';
import React from 'react';
import { ModalAlert } from '../modal-alert';

export class Dropzone extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			hover: false,
			uploading: false,
			progress: 1, // Keeps screen from jumping when upload starts
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
	uploadFirestore(file) {
		
		var metadata = { contentType: file.type };
		var filename = ((this.props.directory) ? this.props.directory + '/' : '') + ((this.props.filename) ? this.props.filename : (Date.now()));
		var uploadTask = this.props.storageRef.child(this.props.bin + '/' + filename).put(file, metadata);

		this.setState({ hover: true, uploading: true, progress: 1 });

		uploadTask.on('state_changed', (snapshot) => {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			this.setState({ progress: progress });
		}, (error) => {
			console.error(error);
		}, () => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				this.props.onChange(this.props.field, downloadURL);
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

		return (

			<div style={{ width: '100%', marginLeft: '5px', marginRight: '5px' }}>

				{ this.props.image &&
					<div style={{ position: 'relative', textAlign: 'center', border: '1px solid #e5e6e7', padding: '10px' }}>
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
						<img src={ this.props.image  } width={ this.props.width } style={{ width: '100%' }} />
					</div>
				}


				<div id={ 'dropzone' }>
					{ !this.props.image &&
						<div className={ this.props.className + (this.state.hover ? ' highlight' : '') } 
							style={ { height: (this.props.maxHeight) ? this.props.maxHeight : '250px' }}
						>
							<>
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
															<input type="file" style={{ display: 'none' }} onChange={ this.chooseFile.bind(this) } />
														</label>&nbsp;or Drag here
													</span>
											}
										</h3>
								}
							</>
						</div>
					}
				</div>
			</div>
		);
	}
}
