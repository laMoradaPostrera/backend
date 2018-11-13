/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 5 / 9 / 2017 - 7:39:27
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
let CONSTANTS = require('../events/constants.js')
var User_answer = function () {
	var params = [
		{
			"table": "user_answer",
			"relations": [
				{
					"type": "1-1",
					"entity": "service",
					"name": "service",
					"leftKey": "id_service",
					"foreign_name": "name"
				},
				{
					"type": "1-1",
					"entity":
					"question",
					"leftKey": "id_question",
					"name": "question",
					"foreign_name": "text"
				},
				{
					"type": "1-1",
					"entity": "user",
					"name": "user",
					"leftKey": "id_user",
					"foreign_name": "email"
				},
				{
					"type": "1-1",
					"entity": "media",
					"name": "media",
					"leftKey": "id_media",
					"foreign_name": "url"
				},
				{
					"type": "1-1",
					"entity": "questiontopic",
					"name": "topic",
					"leftKey": "id_topic",
					"foreign_name": "name"
				},
				{
					"type": "1-1",
					"entity": "request_status",
					"name": "status",
					"leftKey": "id_status",
					"foreign_name": "name"
				},
				{
					"type": "1-n",
					"entity": "evaluation_request",
					"name": "evaluators",
					"rightKey": "id_answer"
				}
			],
			"entity": "user_answer",
			"model": "entity"
		}
	]
	BaseModel.apply(this, params)
	this.clearMedia = function (id) {
		let q = `UPDATE user_answer SET id_media = NULL WHERE id= '${id}'`
		return this.customQuery(q)
	}
	this.toPostulate = function (user, params) {
		params = params || {}
		params.limit = params.limit || 20
		params.page = params.page || 1
		params.order = params.order || 'id asc'
		let topics = []
		user.topics.forEach((topic) => {
			topics.push(topic.id)
		})
		let query = `SELECT SQL_CALC_FOUND_ROWS * FROM view_user_answer 
		WHERE id IN (
			SELECT u_a.id FROM user_answer u_a
			JOIN service s ON  u_a.id_service = s.id
			JOIN questiontopic qt ON  u_a.id_topic = qt.id
			JOIN question q ON  u_a.id_question = q.id
			LEFT JOIN institution i on i.id = s.id_institution
			WHERE 
			${params['institution.id'] ? 's.id_institution = ' + params['institution.id'] + ' AND ' : ''}
			${params['service.id'] ? 's.id = ' + params['service.id'] + ' AND ' : ''}
			${params['region.id'] ? 'i.id_region = ' + params['region.id'] + ' AND ' : ''}
			${params['category.id'] ? 'qt.id_category = ' + params['category.id'] + ' AND ' : ''}
			${params['topic.id'] ? 'qt.id = ' + params['topic.id'] + ' AND ' : ''}
			${params['level'] ? 'q.level = ' + params['level'] + ' AND ' : ''}
			u_a.id_topic IN (${topics.join(',')}) AND
			u_a.id_status = '${CONSTANTS.EVALUATION_REQUEST.ASIGNADO}' AND 
			u_a.id NOT IN (SELECT id_answer FROM evaluation_request WHERE id_user = '${user.id}')
			${params.order ? 'ORDER BY u_a.'+params.order : ''}
		)
		LIMIT ${params.limit * (params.page - 1)},${params.limit};
		SELECT FOUND_ROWS() as total;`
		return this.customQuery(query).then((result) => {
			let data = result[0]
			let total = result[1][0].total
			let list = []
			for (let i = 0; i < data.length; i++) {
				list.push(this.sintetizeRelation(data[i], { entity: 'user_answer' }))
			}
			return { data: list, total_results: total }
		})
	}
	this.urgent = function (user, params) {
		params = params || {}
		params.limit = params.limit || 20
		params.page = params.page || 1
		params.order = params.order || 'id asc'
		let now = new Date();
		let query = `SELECT SQL_CALC_FOUND_ROWS u_a.* FROM view_user_answer u_a
		JOIN evaluation_request e_r ON e_r.id_answer = u_a.id
		WHERE u_a.id IN (
			SELECT u_a.id FROM user_answer u_a
			JOIN evaluation_request e_r ON e_r.id_answer = u_a.id
			WHERE 
			(e_r.id_user = 4 AND e_r.id_request_status < 9 ) OR
			(e_r.id_request_status < 9 AND e_r.end_time < '${now.toISOString().split("T")[0]}')
			ORDER BY e_r.end_time ASC
		)
		ORDER BY e_r.end_time ASC
		LIMIT ${params.limit * (params.page - 1)},${params.limit};
		SELECT FOUND_ROWS() as total;`
		return this.customQuery(query).then((result) => {
			let data = result[0]
			let total = result[1][0].total
			let list = []
			for (let i = 0; i < data.length; i++) {
				list.push(this.sintetizeRelation(data[i], { entity: 'user_answer' }))
			}
			return { data: list, total_results: total }
		})
	}
	this.getStatsByService = function(service){
		let q = `SELECT 
			i.name institution,
			s.name service,
			q.id id,
			q.text requisite,
			c.name category,
			q.level level,
			u_a.id_status status,
			e_r.id_request_status r_status,
			IFNULL(e_r.branch,0) branch,
			DATEDIFF(CURRENT_DATE(),u_a.timestamp) time
			FROM user_answer u_a 
			JOIN service s on u_a.id_service = s.id 
			JOIN institution i on i.id = s.id_institution 
			JOIN evaluation_request e_r on e_r.id_answer = u_a.id
			JOIN question q on u_a.id_question = q.id
			JOIN category c on s.id_category = c.id 
			WHERE u_a.id_service = ${service}`
		return this.customQuery(q).then((results)=>{
			let _final = []
			let _requisites = {}
			results.forEach((item)=>{
				if(!_requisites[item.id]){
					_requisites[item.id] = {
						'Entidad':item.institution,
						'Servicio':item.service,
						'Requisito':item.requisite,
						'Categoría':item.category,
						'Nivel':item.level,
						'En Validación':0,
						'Por Asignar':0,
						'Rechazado por admon':0,
						'Número Evaluadores':0,
						'Aceptado':0,
						'Rechazado':0,
						'Retroalimentación':0,
						'Cumple':0,
						'No Cumple':0,
						'Tiempo':item.time
					}
				}
				item.Rechazado += item.branch
				if(item.status === CONSTANTS.EVALUATION_REQUEST.PENDIENTE){
					_requisites[item.id]['En Validación']++
				}
				if(item.status === CONSTANTS.EVALUATION_REQUEST.POR_ASIGNAR){
					_requisites[item.id]['Por Asignar']++
				}
				if(item.status === CONSTANTS.EVALUATION_REQUEST.ERROR){
					_requisites[item.id]['Rechazado por admono']++
				}
				if(item.r_status === CONSTANTS.EVALUATION_REQUEST.ACEPTADO){
					_requisites[item.id].Aceptado++
					_requisites[item.id]['Número Evaluadores']++
				}
				if(item.r_status === CONSTANTS.EVALUATION_REQUEST.RETROALIMENTACION){
					_requisites[item.id]['Retroalimentación']++
					_requisites[item.id]['Número Evaluadores']++
				}
				if(item.r_status === CONSTANTS.EVALUATION_REQUEST.CUMPLE){
					_requisites[item.id].Cumple++
					_requisites[item.id]['Número Evaluadores']++
				}
				if(item.r_status === CONSTANTS.EVALUATION_REQUEST.NO_CUMPLE){
					_requisites[item.id]['No Cumple']++
					_requisites[item.id]['Número Evaluadores']++
				}
			})
			for(let i in _requisites){
				_final.push(_requisites[i])
			}
			return {data:_final}
		})
	}
return this
};
util.inherits(User_answer, BaseModel)
module.exports = User_answer