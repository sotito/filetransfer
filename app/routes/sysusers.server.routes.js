'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var sysusers = require('../../app/controllers/sysusers.server.controller');

	// Sysusers Routes
	app.route('/sysusers')
		.get(sysusers.list)
		.post(users.requiresLogin, sysusers.create);

	app.route('/sysusers/:sysuserId')
		.get(sysusers.read)
		.put(users.requiresLogin, sysusers.hasAuthorization, sysusers.update)
		.delete(users.requiresLogin, sysusers.hasAuthorization, sysusers.delete);

	// Finish by binding the Sysuser middleware
	app.param('sysuserId', sysusers.sysuserByID);
};
