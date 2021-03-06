/**  * ENTITY AUTO_GENERATED BY DMT-GENERATOR
 * {{ENTITY_NAME}}
 * DMT 2017
 * GENERATED: 2 / 11 / 2017 - 9:22:41
 **/
var BaseModel = require('../utils/model.js')
var util = require('util')
var Hall_of_fame = function () {
	var params = [{
	"table": "hall_of_fame",
	"relations": [
		{
			"type": "1-1",
			"entity": "role",
			"name": "role",
			"leftKey": "id_role",
			"foreign_name": "name"
		}
	],
	"entity": "hall_of_fame",
	"model": "entity"
}]
	BaseModel.apply(this, params)
	return this
};
util.inherits(Hall_of_fame, BaseModel)
module.exports = Hall_of_fame