'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Sysuser = mongoose.model('Sysuser'),
	_ = require('lodash');

/**
 * Create a Sysuser
 */
exports.create = function(req, res) {
	var sysuser = new Sysuser(req.body);
	sysuser.user = req.user;

	sysuser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sysuser);
		}
	});
};

/**
 * Show the current Sysuser
 */
exports.read = function(req, res) {
	res.jsonp(req.sysuser);
};

/**
 * Update a Sysuser
 */
exports.update = function(req, res) {
	var sysuser = req.sysuser ;

	sysuser = _.extend(sysuser , req.body);

	sysuser.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sysuser);
		}
	});
};

/**
 * Delete an Sysuser
 */
exports.delete = function(req, res) {
	var sysuser = req.sysuser ;

	sysuser.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sysuser);
		}
	});
};

/**
 * List of Sysusers
 */
exports.list = function(req, res) { 
	Sysuser.find().sort('-created').populate('user', 'displayName').exec(function(err, sysusers) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(sysusers);
		}
	});
};

/**
 * Sysuser middleware
 */
exports.sysuserByID = function(req, res, next, id) { 
	Sysuser.findById(id).populate('user', 'displayName').exec(function(err, sysuser) {
		if (err) return next(err);
		if (! sysuser) return next(new Error('Failed to load Sysuser ' + id));
		req.sysuser = sysuser ;
		next();
	});
};

/**
 * Sysuser authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.sysuser.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
