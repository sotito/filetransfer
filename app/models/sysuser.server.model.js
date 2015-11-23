'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Sysuser Schema
 */
var SysuserSchema = new Schema({
	firstName:{
			type:String,
			required: true
		},
		lastName:{
			type:String,
			required:true
		},
		userName: {
			type:String,
			required: true,
			index:{unique:true}
		},
		password: {
			type:String,
			required:true,
			select:false
		},
		phoneNumber: {
			type:String,
			default: '',
			required:false,

		},

		//manager ID of the user
		managerID: {
			type:String,
			required:false,

		}
});

mongoose.model('Sysuser', SysuserSchema);