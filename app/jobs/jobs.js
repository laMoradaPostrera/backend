let CONSTANTS = require('../events/constants.js')
var config = require('../../config.json')
let HOST = config.hosts[config.enviroment]
let utiles = require('../utils/utiles')
var Jobs = function () {
	let model_entity_evaluation_request = require('../models/entity_evaluation_request.js')
	model_entity_evaluation_request = new model_entity_evaluation_request()
	let model_entity_service = require('../models/entity_service.js')
	model_entity_service = new model_entity_service()
	let model_user = require('../models/user.js')
	model_user = new model_user()
	let model_entity_motives = require('../models/entity_motives.js')
	model_entity_motives = new model_entity_motives()
	let entity_model_points = require('../models/entity_points.js')
	entity_model_points = new entity_model_points()
	/**
	 * execute
	 */
	this.execute = function () {
		///RENOVACIÓN
		//servicios que estén en creación y no se hayan postulado alert_time
		let adate = new Date()
		model_entity_service.getByLastStatusDate(null, adate, [CONSTANTS.SERVICE.INCOMPLETO])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Recordatorio Sello de Excelencia',
							`<div style="text-align:center;margin: 10px auto;">
							<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
							</div>
							<p>Hola ${service.user_name}</p>
							<p>Tienes un servicio pendiente de postulación:</p>
							<p>Nombre del Producto o Servicio: ${service.name}</p>
							<p>Categoría: ${service.category_name}</p>
							<p>Nivel ${service.level}</p>
							<p>Recuerda que puedes terminar la postulación en la plataforma de Sello de Excelencia Gobierno Digital</p>
							<p>Nuestros mejores deseos,<\p>
							<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que están en validación
		model_user.getAdmin().then((result) => {
			let _admin = result[0]
			model_entity_service.getByLastStatusDate(null, adate, [CONSTANTS.SERVICE.VERIFICACION])
				.then((results) => {
					results.forEach((service) => {
						let tout = Math.floor(Math.random() * 1000) + 100
						setTimeout(() => {
							utiles.sendEmail(_admin.email, null, null, 'Recordatorio Sello de Excelencia',
								`<div style="text-align:center;margin: 10px auto;">
							<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
							</div>
							<p>Hola ${_admin.name}</p>
							<p>Tienes un servicio pendiente de validar:</p>
							<p>Nombre del Producto o Servicio: ${service.name}</p>
							<p>Categoría: ${service.category_name}</p>
							<p>Nivel ${service.level}</p>
							<p>Nuestros mejores deseos,<\p>
							<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
							)
						}, tout)
					})
				})
		})
		//servicios que estén en otorgado y falten 2 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 60)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten 1.5 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 45)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten 1 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 30)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios que estén en otorgado y falten .5 meses para vencer el sello
		adate = new Date()
		adate.setDate(adate.getDate() + 15)
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//servicios deshabilitados
		adate = new Date()
		model_entity_service.getByCurrentStatusDate(adate, null, [CONSTANTS.SERVICE.CUMPLE])
			.then((results) => {
				results.forEach((service) => {
					let tout = Math.floor(Math.random() * 1000) + 100
					setTimeout(() => {
						utiles.sendEmail(service.user_email, null, null, 'Vencimiento Sello de Excelencia Gobierno Digital Colombia',
							`<div style="text-align:center;margin: 10px auto;">
						<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
						</div>
						<p>Hola ${service.user_name}</p>
						<p>El Sello de Excelencia de:</p>
						<p>Nombre del Producto o Servicio: ${service.name}</p>
						<p>Se vence el <b>${service.valid_to.toLocaleString()}</b></p>
						<p>Por favor ingresa a la plataforma para Renovar el Sello de Excelencia Gobierno Digital Colombia en la Pestaña 
						<b>Actividad</b> -> <b>Sellos Otorgados</b> da click en Renovar el Sello.</p>
						<p>Luego debes ir a la pestaña <b>Postular</b> y Seleccionar el Servicio en la sección <b>Continuar con una postulación anterior</b>
						<p>Ten en cuenta que si la renovación no se efectúa antes de la fecha de vencimiento tendrás que hacer todo el proceso de postulación nuevamente</p>
						<p>Nuestros mejores deseos,<\p>
						<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
						)
					}, tout)
				})
			})
		//solicitudes de evaluación que estén en alert_time y no estén en cumple / no_cumple
		adate = new Date()
		model_entity_evaluation_request.getByStatusDate(null, adate,
			[CONSTANTS.EVALUATION_REQUEST.ACEPTADO,
			CONSTANTS.EVALUATION_REQUEST.SOLICITADO,
			CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION,
			CONSTANTS.EVALUATION_REQUEST.ASIGNADO], true)
			.then((results) => {
				results.forEach((request) => {
					if (request.alert == 1) {
						let tout = Math.floor(Math.random() * 1000) + 100
						setTimeout(() => {
							utiles.sendEmail(request.user_email, null, null, 'Vencimiento de Evaluación - Sello de Excelencia Gobierno Digital Colombia',
								`<div style="text-align:center;margin: 10px auto;">
								<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
								</div>
								<p>Hola ${request.user_name ? request.user_name : ''}</p>
								<p>El plazo de evaluación del siguiente requisito:</p>
								<p>Categoría: ${request.category_name ? request.category_name : ''}</p>
								<p>Nivel: ${request.level ? request.level : ''}</p>
								<p>Temática: ${request.topic ? request.topic : ''}</p>
								<p>Requisito: ${request.question ? request.question : ''}</p>
								<p>Entidad: ${request.institution ? request.institution : ''}</p>
								<p>Nombre del Producto o Servicio: ${request.service_name ? request.service_name : ''}</p>
								<p>Está próximo a vencerse <b>${request.end_time ? request.end_time.toLocaleString() : ''}</b></p>
								<p>Por favor ingresa a la plataforma para Evaluar el Requisito.</p>
								<p>Nuestros mejores deseos,<\p>
								<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
							)
						}, tout)
					}
				})
			})
		//reasignar solicitudes con valid_to = hoy 
		let _admin = null
		let motive = null
		let requests = null
		return model_user.getAdmin().then((result) => {
			_admin = result[0]
			return model_entity_evaluation_request.getByStatusDate(adate, null,
				[CONSTANTS.EVALUATION_REQUEST.ACEPTADO,
				CONSTANTS.EVALUATION_REQUEST.SOLICITADO,
				CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION,
				CONSTANTS.EVALUATION_REQUEST.ASIGNADO], true)
		}).then(results => {
			requests = results
			return model_entity_motives.getAll({ limit: 5000 })
		}).then((results) => {
			if (results.data.length) {
				results.data.forEach((_motive) => {
					if (_motive.name.name === CONSTANTS.MOTIVES.EVALUATOR.NO_EVALUAR) {
						motive = _motive
					}
				})
			}
			return model_entity_evaluation_request.asignateRequests(adate, null,
				[CONSTANTS.EVALUATION_REQUEST.ACEPTADO,
				CONSTANTS.EVALUATION_REQUEST.SOLICITADO,
				CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION,
				CONSTANTS.EVALUATION_REQUEST.ASIGNADO], true,_admin.id)
		}).then(() => {
			requests.forEach((request) => {
				let tout = Math.floor(Math.random() * 1000) + 100
				setTimeout(() => {
					if (motive) {
						entity_model_points.addUserPoints(request.user_id, motive.id, '')
					}
					utiles.sendEmail(_admin.email, null, null, 'Asignación por Vencimiento de Evaluación - Sello de Excelencia Gobierno Digital Colombia',
						`<div style="text-align:center;margin: 10px auto;">
							<img width="100" src="${HOST}/assets/img/sell_gel.png"/>
							</div>
							<p>Hola ${_admin.name}</p>
							<p>El plazo de evaluación del siguiente requisito:</p>
							<p>Categoría: ${request.category_name}</p>
							<p>Nivel: ${request.level}</p>
							<p>Temática: ${request.topic}</p>
							<p>Requisito: ${request.question}</p>
							<p>Entidad: ${request.institution}</p>
							<p>Nombre del Producto o Servicio: ${request.service_name}</p>
							<p>Se ha vencido</p>
							<p>Por favor ingresa a la plataforma para Evaluar el Requisito.</p>
							<p>Nuestros mejores deseos,<\p>
							<p>El equipo del Sello de Excelencia Gobierno Digital Colombia<\p>`
					)
				}, tout)
			})
		})
	}

	this.info = function () {
		let adate = new Date()
		return model_entity_service.getByCurrentStatusDate(null, null, [CONSTANTS.SERVICE.INCOMPLETO])
	}
}
module.exports = Jobs