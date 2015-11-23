'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var wallets = require('../../app/controllers/wallets.server.controller');

	// Wallets Routes
	app.route('/wallets')
		.get(wallets.list)
		.post(users.requiresLogin, wallets.create);

	app.route('/wallets/:walletId')
		.get(wallets.read)
		.put(users.requiresLogin, wallets.hasAuthorization, wallets.update)
		.delete(users.requiresLogin, wallets.hasAuthorization, wallets.delete);

	// Finish by binding the Wallet middleware
	app.param('walletId', wallets.walletByID);
};
