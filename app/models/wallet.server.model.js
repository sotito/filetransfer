'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Wallet Schema
 */
var WalletSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Wallet name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Wallet', WalletSchema);