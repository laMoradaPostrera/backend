/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 15 / 9 / 2017 - 1:25:45
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
let emiter = require('../events/emiter.js').instance
let CONSTANTS = require('../events/constants.js')
var Service = function () {
	var params = [{
		"table": "service",
		"relations": [
			{
				"type": "1-1",
				"name": "category",
				"foreign_name": "name",
				"entity": "category",
				"leftKey": "id_category"
			},
			{
				"type": "1-1",
				"name": "institution",
				"foreign_name": "name",
				"entity": "institution",
				"leftKey": "id_institution"
			},
			{
				"type": "1-n",
				"name": "history",
				"rightKey": "id_service",
				"entity": "service_status"
			},
			{
				"type": "1-1",
				"name": "status",
				"leftKey": "current_status",
				"foreign_name": "name",
				"entity": "status"
			},
			{
				"type": "1-n",
				"name": "comments",
				"entity": "service_comment",
				"rightKey": "id_service"
			},
      {
        "type": "1-n",
        "name": "requisites",
        "rightKey": "id_service",
        "entity": "user_answer"
      },
		],
		"entity": "service",
		"model": "entity"
	}]
	BaseModel.apply(this, params)

	this.getDenied = function(){
		let q=`SELECT \`service\`.\`id\` \`key\` FROM \`service\` 
		JOIN (SELECT \`service_status\`.\`id_service\`,MAX(\`service_status\`.\`valid_to\`) FROM \`service_status\` 
		WHERE (
			\`service_status\`.\`id_status\` = '${CONSTANTS.SERVICE.NO_CUMPLE}'
		)
		GROUP BY \`id_service\`) \`service_status\` ON \`service_status\`.\`id_service\` = \`service\`.\`id\` 
		GROUP BY \`key\` ORDER BY \`service\`.id ;`
		let keys = []
		return this.customQuery(q).then((results)=>{
			results.forEach((result)=>{
				keys.push(result.key)
			})
			if(keys.length == 0){
				return [[],[{total:0}],[]]
			}
			let query = `SELECT SQL_CALC_FOUND_ROWS * FROM view_service 
			WHERE id IN (${keys.join(',')}) ORDER BY id desc
			LIMIT 0,5000;
			SELECT FOUND_ROWS() as total;
			SELECT * FROM view_service_status WHERE id_service IN (${keys.join(',')}) 
			AND id_status = ${CONSTANTS.SERVICE.NO_CUMPLE} ORDER BY timestamp desc;`	
			return this.customQuery(query)
		}).then((result)=>{
			let data = result[0]
			let total = result[1][0].total
			let history = result[2]
			let list = []
			
			let _history = {}
			for (let i = 0; i < history.length; i++) {
				let status = this.sintetizeRelation(history[i], {entity:'service_status'})
				if(!_history[status.id_service]){
					_history[status.id_service] = []
				}
				_history[status.id_service].push(status)
			}

			for (let i = 0; i < data.length; i++) {
				let item = this.sintetizeRelation(data[i], {entity:'service'})
				item.history = _history[item.id]
				delete item.is_active
				item['Calificado'] = _history[item.id][0].timestamp
				list.push(item)
			}
			return { data: list, total_results: total }
		})
	}
	this.getByLastStatusDate = function(valid_to,alert_time,status){
		if(!status){
			return
		}
		if(valid_to){
			valid_to = valid_to.toISOString().split('T')[0]
		}
		if(alert_time){
			alert_time = alert_time.toISOString().split('T')[0]
		}
		let q=`SELECT \`service\`.\`*\`,\`user\`.\`name\` \`user_name\`,
		\`user\`.\`email\` \`user_email\`,\`service_status\`.\`valid_to\`,
		\`category\`.\`name\` \`category_name\`
		 FROM \`service\` 
		JOIN (SELECT \`service_status\`.\`id_service\`,MAX(\`service_status\`.\`timestamp\`) \`timestamp\`, \`service_status\`.\`valid_to\` FROM \`service_status\` 
		WHERE (
			${status ? `\`service_status\`.\`id_status\` IN ( '${status.join(',')}' ) ` : ``} 
			${valid_to ? 'AND DATE(\`service_status\`.\`valid_to\`) = \''+valid_to +'\' ' :''}
			${alert_time ? 'AND DATE(\`service_status\`.\`valid_to\`) = \''+alert_time +'\' ' :''}
		) GROUP BY \`id_service\`) 
		\`service_status\` ON \`service_status\`.\`id_service\` = \`service\`.\`id\` 
		JOIN \`institution_user\` ON \`institution_user\`.\`id_institution\` = \`service\`.\`id_institution\`
		JOIN \`category\` ON \`service\`.\`id_category\` = \`category\`.\`id\`
		JOIN \`user\` ON \`institution_user\`.\`id_user\` = \`user\`.\`id\`
		WHERE \`service\`.\`is_active\` = '1'
		GROUP BY \`service\`.\`id\`
		ORDER BY \`service\`.id ;`
		let keys = []
		return this.customQuery(q)
	}
	this.getByCurrentStatusDate = function(valid_to,alert_time,status){
		if(!status){
			return
		}
		if(valid_to){
			valid_to = valid_to.toISOString().split('T')[0]
		}
		if(alert_time){
			alert_time = alert_time.toISOString().split('T')[0]
		}
		let q=`SELECT \`service\`.\`*\`,\`user\`.\`name\` \`user_name\`,
		\`user\`.\`email\` \`user_email\`,\`service_status\`.\`valid_to\`,
		\`category\`.\`name\` \`category_name\`
		 FROM \`service\` 
		JOIN (SELECT \`service_status\`.\`id_service\`,MAX(\`service_status\`.\`valid_to\`) \`valid_to\` FROM \`service_status\` 
		WHERE (
			${status ? `\`service_status\`.\`id_status\` IN ( '${status.join(',')}' ) ` : ``} 
			${valid_to ? 'AND DATE(\`service_status\`.\`valid_to\`) = \''+valid_to +'\' ' :''}
			${alert_time ? 'AND DATE(\`service_status\`.\`valid_to\`) = \''+alert_time +'\' ' :''}
		) GROUP BY \`id_service\`) 
		\`service_status\` ON \`service_status\`.\`id_service\` = \`service\`.\`id\` 
		JOIN \`institution_user\` ON \`institution_user\`.\`id_institution\` = \`service\`.\`id_institution\`
		JOIN \`category\` ON \`service\`.\`id_category\` = \`category\`.\`id\`
		JOIN \`user\` ON \`institution_user\`.\`id_user\` = \`user\`.\`id\`
		WHERE \`service\`.\`is_active\` = '1'
		GROUP BY \`service\`.\`id\`
		ORDER BY \`service\`.\`id\` ;`
		return this.customQuery(q)
	}
	this.prepareAsignation = function(service){
		let upgrade = false
		let q = `SELECT IFNULL(MAX(level),0) level from service_status WHERE id_status = '${CONSTANTS.SERVICE.CUMPLE}' AND id_service = '${service.id}'`
		return this.customQuery(q).then((result)=>{
			let max = result[0].level
			if(max > 0 && service.level > max){
				upgrade = true
			}
			if(!upgrade){
				let q = `UPDATE user_answer SET id_status = '${CONSTANTS.EVALUATION_REQUEST.PENDIENTE}' WHERE id_service = '${service.id}'; `
				return this.customQuery(q)
			}else {
				let q = `UPDATE user_answer SET id_status = '${CONSTANTS.EVALUATION_REQUEST.PENDIENTE}' WHERE id_service = '${service.id}' AND id_status = '${CONSTANTS.EVALUATION_REQUEST.NO_CUMPLE}'`
				return this.customQuery(q)
			}
		}).then((results)=>{
			let q = `SELECT id FROM chats WHERE id_evaluation_request IN (SELECT id from evaluation_request WHERE id_service = '${service.id}')`
			return this.customQuery(q)
		}).then((results)=>{
			if(results.length == 0){
				return []
			}
			let q = `DELETE FROM chats WHERE `; 
			for(var i in results){
				q+= `id=${results[i].id} OR `
			}
			q = q.slice(0,-3)
			return this.customQuery(q)
		}).then((results)=>{
			let q = `DELETE from evaluation_request WHERE id_service = '${service.id}'`;
			return this.customQuery(q)
		})
	}
	this.asignate = function (service) {
		let upgrade = false
		let q = `SELECT IFNULL(MAX(level),0) level from service_status WHERE id_status = '${CONSTANTS.SERVICE.CUMPLE}' AND id_service = '${service.id}'`
		return this.customQuery(q).then((result)=>{
			let max = result[0].level
			if(max > 0 && service.level > max){
				upgrade = true
			}
			let q = `SELECT u.id,u.email from user u JOIN user_role ON user_role.id_user = u.id WHERE user_role.id_role = 3`
			return this.customQuery(q)
		}).then((_admin)=>{
			_admin = _admin[0]
			let q = `SELECT * from request_status WHERE id = '${CONSTANTS.EVALUATION_REQUEST.ASIGNADO}'`
			return this.customQuery(q).
				then((_status) => {
					_status = _status[0]
					let duration = _status.duration
					let alarm = duration - _status.pre_end
					let atime = new Date()
					atime.setDate(atime.getDate() + alarm)
					let ftime = new Date()
					ftime.setDate(ftime.getDate() + duration)
					let q = `SELECT u.id id_user,
						u.email email,
						u.active active,
						qt.id id_topic,
						u_a.id id_answer,
						u_a.id_question id_question,
						u.id_availability
						FROM user_answer u_a
						LEFT JOIN questiontopic qt ON qt.id = u_a.id_topic
						LEFT JOIN user_questiontopic ON user_questiontopic.id_topic = qt.id
						LEFT JOIN user u ON u.id = user_questiontopic.id_user
						WHERE u_a.id_service = '${service.id}' 
						AND u_a.id_status = '${CONSTANTS.EVALUATION_REQUEST.POR_ASIGNAR}'
						ORDER BY u_a.id asc,u.id_availability desc`
					return this.customQuery(q).then((_users) => {
						console.log(_users)
						let _couples = {}
						_users.forEach(function (_user) {
							if (!_couples[_user.id_answer]) {
								_couples[_user.id_answer] = []
							}
							let found = false
							if(!_user.active){
								found = true
							}
							_couples[_user.id_answer].forEach((user)=>{
								if(user.id_user == _user.id_user){
									found = true
								}
							})
							if(!found){
								_couples[_user.id_answer].push(_user)
							}
						}, this)
						console.log(_couples)
						let request= []
						for (let answer in _couples) {
							let id_question = null
							_users.forEach((_user)=>{
								if(_user.id_answer == answer){
									id_question = _user.id_question
								}
							})
							let valid = []
							_couples[answer].forEach((data)=>{
								if(data.email && data.id_user){
									valid.push(data)
								}
							})
							let limit = 3
							let _count = valid.length
							let difference = limit - _count
							let index
							if (difference > 0) {
								limit = _count
								for (let i = 0; i < difference; i++) {
									request.push({
										id_user: _admin.id,
										id_answer: answer,
										id_service: service.id,
										id_request_status: CONSTANTS.EVALUATION_REQUEST.ASIGNADO,
										id_question: id_question,
										alert_time:atime.toISOString().split('T')[0],
										end_time:ftime.toISOString().split('T')[0]
									})
								emiter.emit('evaluation_request.asignation',{id_user:_admin.id})
								}
							}
	
							while (limit--) {
								index = Math.floor(Math.random() * valid.length)
								let data = valid.splice(index, index+1)[0]
								request.push({
									id_user: data.id_user,
									id_answer: answer,
									id_service: service.id,
									id_request_status: CONSTANTS.EVALUATION_REQUEST.ASIGNADO,
									id_question: data.id_question,
									alert_time:atime.toISOString().split('T')[0],
									end_time:ftime.toISOString().split('T')[0]
								})
								emiter.emit('evaluation_request.asignation',data)
							}
						}
						return request
					})
				})
		})
	}
	this.reasignate = function(request){
		let q = `SELECT u.id id_user,
		u.email email,
		qt.id id_topic,
		u_a.id id_answer,
		u_a.id_question id_question,
		u.id_availability
		FROM user_answer u_a
		JOIN questiontopic qt ON qt.id = u_a.id_topic
		JOIN user_questiontopic ON user_questiontopic.id_topic = qt.id
		JOIN user u ON u.id = user_questiontopic.id_user
		WHERE u_a.id = '${request.id_answer}' 
		AND u.id <> '${request.id_user}'
		AND u.active = 1
		AND u.id NOT IN (SELECT id_user FROM evaluation_request WHERE id_answer = ${request.id_answer})
		ORDER BY RAND()`
		return this.customQuery(q).then((_users) => {
			if(_users.length){
				let q = `UPDATE evaluation_request SET 
					id_user = ${_users[0].id_user}, 
					id_request_status = '${CONSTANTS.EVALUATION_REQUEST.ASIGNADO}' 
					WHERE id='${request.id}'`
				emiter.emit('evaluation_request.asignation',{id_user:_users[0].id_user})
				return this.customQuery(q)
			}else{
				let q = `SELECT u.id from user u JOIN user_role ON user_role.id_user = u.id WHERE user_role.id_role = 3`
                        	this.customQuery(q)
				.then((_admin)=>{
                        		_admin = _admin[0]
					let q = `UPDATE evaluation_request SET
                                        id_user = ${_admin.id},
                                        id_request_status = '${CONSTANTS.EVALUATION_REQUEST.ASIGNADO}'
                                        WHERE id='${request.id}'`
	                                emiter.emit('evaluation_request.asignation',{id_user:_admin.id})
        	                        return this.customQuery(q)
				})
			}
		})
	}
	this.delete = function (id) {
		let q = `SET FOREIGN_KEY_CHECKS = 0;
		DELETE FROM service_status WHERE id_service = '${id}';
		DELETE FROM service_comment WHERE id_service = '${id}';
		DELETE FROM service_comment WHERE id_service = '${id}';
		DELETE FROM user_answer WHERE id_service = '${id}';
		DELETE chats FROM chats JOIN evaluation_request ON chats.id_evaluation_request = evaluation_request.id WHERE evaluation_request.id_service = ${id};
		DELETE FROM evaluation_request WHERE id_service = '${id}';
		DELETE FROM service WHERE id = ${id};
		SET FOREIGN_KEY_CHECKS = 1;`
		return this.customQuery(q)
	}
	this.renovation= function(){
		let q = `SELECT s.id,s.name \`service\`,i.name \`institution\`,
		s.is_active,ss.level,ss.timestamp,ss.valid_to from service_status ss 
		JOIN service s ON s.id = ss.id_service
		JOIN institution i ON s.id_institution = i.id
		WHERE ss.id_status = 4;`
		return this.customQuery(q).then(res=>{
			return {data:res}
		})
	}
	this.getByPostulateCertificationDate = function(params,older){
		params = params || {}
		params.limit = params.limit || 20
		params.page = params.page || 1
		params.order = params.order || 'id asc'
		params.filter_field = params.filter_field || []
		params.filter_value = params.filter_value || []
		
		let _filters = {}
		for(let i = 0 ; i < params.filter_field.length ; i++){
			if(!_filters[params.filter_field[i]]){
				_filters[params.filter_field[i]] = []
			}
			_filters[params.filter_field[i]].push(params.filter_value[i])
		}
		let now = new Date()
		now = now.getFullYear() + '-' + (now.getMonth()+1)  + '-' + now.getDate()
		let query = `SELECT s.id FROM service s
		JOIN service_status ss ON  (
			ss.id_service = s.id AND
			ss.id_status = '${CONSTANTS.SERVICE.CUMPLE}' ${older ? '':`AND ss.valid_to > '${now}'`}
			${_filters['certification'] ? 'AND DATE(ss.timestamp) =  \''+_filters['certification'][0] +'\' AND ss.id_status = '+CONSTANTS.SERVICE.CUMPLE :''}
		)
		JOIN institution i on s.id_institution = i.id
		WHERE 
		${params['filter'] ? '(s.name like \'%'+params['filter'] +'%\' OR i.name like \'%'+params['filter'] +'%\') AND ' :''}
		${_filters['postulation'] ? 'DATE(s.timestamp) = \''+_filters['postulation'][0] +'\' AND ' :''}
		${_filters['institution.id'] ? 'i.id = \''+_filters['institution.id'][0] +'\' AND ' :''}
		${_filters['id'] ? 's.id = \''+_filters['id'][0] +'\' AND ' :''}
		${_filters['id_category'] ? 's.id_category = \''+_filters['id_category'][0] +'\' AND ' :''}
		${older ? 'true ':`s.is_active = '1' `}
		GROUP BY s.id desc
		ORDER BY s.id desc`
		let keys = []
		return this.customQuery(query).then((results)=>{
			results.forEach((result)=>{
				keys.push(result.id)
			})
			if(keys.length == 0){
				return [[],[{total:0}],[]]
			}
			let query = `SELECT SQL_CALC_FOUND_ROWS * FROM view_service 
			WHERE id IN (${keys.join(',')}) ORDER BY id desc
			LIMIT ${params.limit * (params.page-1)},${params.limit};
			SELECT FOUND_ROWS() as total;
			SELECT * FROM view_service_status WHERE id_service IN (${keys.join(',')}) AND id_status = ${CONSTANTS.SERVICE.CUMPLE} ORDER BY timestamp desc;`	
			return this.customQuery(query)
		}).then((result)=>{
			let data = result[0]
			let total = result[1][0].total
			let history = result[2]
			let list = []
			
			let _history = {}
			for (let i = 0; i < history.length; i++) {
				let status = this.sintetizeRelation(history[i], {entity:'service_status'})
				if(!_history[status.id_service]){
					_history[status.id_service] = []
				}
				_history[status.id_service].push(status)
			}

			for (let i = 0; i < data.length; i++) {
				let item = this.sintetizeRelation(data[i], {entity:'service'})
				item.history = _history[item.id]
				if(item.status.id != CONSTANTS.SERVICE.CUMPLE){
					item.status.name = 'OTORGADO'
				}
				item.level = _history[item.id][0].level
				item.valid_to = _history[item.id][0].valid_to
				item.certified = _history[item.id][0].timestamp
				list.push(item)
			}
			return { data: list, total_results: total }
		})
	}
	return this
};
util.inherits(Service, BaseModel)
module.exports = Service
