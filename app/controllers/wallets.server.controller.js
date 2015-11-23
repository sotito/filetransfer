'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Wallet = mongoose.model('Wallet'),
	_ = require('lodash');

/**
 * Create a Wallet
 */
exports.create = function(req, res) {
	var wallet = new Wallet(req.body);
	wallet.user = req.user;

	wallet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wallet);
		}
	});
};

/**
 * Show the current Wallet
 */
exports.read = function(req, res) {
	res.jsonp(req.wallet);
};

/**
 * Update a Wallet
 */
exports.update = function(req, res) {
	var wallet = req.wallet ;

	wallet = _.extend(wallet , req.body);

	wallet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wallet);
		}
	});
};

/**
 * Delete an Wallet
 */
exports.delete = function(req, res) {
	var wallet = req.wallet ;

	wallet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wallet);
		}
	});
};

/**
 * List of Wallets
 */
exports.list = function(req, res) { 
	Wallet.find().sort('-created').populate('user', 'displayName').exec(function(err, wallets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(wallets);
		}
	});
};

/**
 * Wallet middleware
 */
exports.walletByID = function(req, res, next, id) { 
	Wallet.findById(id).populate('user', 'displayName').exec(function(err, wallet) {
		if (err) return next(err);
		if (! wallet) return next(new Error('Failed to load Wallet ' + id));
		req.wallet = wallet ;
		next();
	});
};

/**
 * Wallet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.wallet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
