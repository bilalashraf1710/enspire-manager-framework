import React, { Fragment } from 'react';
import FormBuilderComps from './form-layout-comps';


export class FormBuilder extends React.Component {
	// FILENAME MUST NOT BE "FORM_BUILDER" FOR SOME UNKNOWN REASON

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		var form_final;

		if (this.props.form[0].body) {

			form_final = 

				<Fragment>
					<div className="row">
						{
							this.props.form.map((column, column_index) => {

								return (

									<div key={ 'column'+column_index } className={ column.column_class }>
										{
											column.body.map((section, section_index) => {

												return (

													<div key={ 'section'+section_index } style={{ marginBottom: '20px' }}>

														{ section.section }
														
														<div className="form-row">
															{
																section.layout.map((field, field_index) => {

																	return (

																		<FormBuilderComps key={ 'component'+field_index } props={ this.props } field={ field } />

																	)
																})
															}
														</div>
													</div>
												);
											})
										}
									</div>
								)
							})
						}
					</div>
				</Fragment>

		} else if (this.props.form[0].block) {
			
			form_final = 

				<Fragment>

						{
							this.props.form.map((block, block_index) => {

								return (

									<div key={ 'block'+block_index } className="row">

										{
											block.block.map((column, column_index) => {

												return (

													<div key={ 'column'+column_index } className={ column.column_class }>
														{
															column.body.map((section, section_index) => {

																return (

																	<div key={ 'section'+section_index } style={{ marginBottom: '20px' }}>

																		{ section.section }
																		
																		<div className="form-row">
																			{
																				section.layout.map((field, field_index) => {

																					return (

																						<FormBuilderComps key={ 'component'+field_index } props={ this.props } field={ field } />

																					)
																				})
																			}
																		</div>
																	</div>
																);
															})
														}
													</div>
												)
											})
										}
									</div>
								)
							})
						}
				</Fragment>
		}

		return (

			<div>
				{ form_final }
			</div>
		);
	}
}
