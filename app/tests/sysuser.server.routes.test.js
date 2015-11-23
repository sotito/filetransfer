'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Sysuser = mongoose.model('Sysuser'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, sysuser;

/**
 * Sysuser routes tests
 */
describe('Sysuser CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Sysuser
		user.save(function() {
			sysuser = {
				name: 'Sysuser Name'
			};

			done();
		});
	});

	it('should be able to save Sysuser instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sysuser
				agent.post('/sysusers')
					.send(sysuser)
					.expect(200)
					.end(function(sysuserSaveErr, sysuserSaveRes) {
						// Handle Sysuser save error
						if (sysuserSaveErr) done(sysuserSaveErr);

						// Get a list of Sysusers
						agent.get('/sysusers')
							.end(function(sysusersGetErr, sysusersGetRes) {
								// Handle Sysuser save error
								if (sysusersGetErr) done(sysusersGetErr);

								// Get Sysusers list
								var sysusers = sysusersGetRes.body;

								// Set assertions
								(sysusers[0].user._id).should.equal(userId);
								(sysusers[0].name).should.match('Sysuser Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Sysuser instance if not logged in', function(done) {
		agent.post('/sysusers')
			.send(sysuser)
			.expect(401)
			.end(function(sysuserSaveErr, sysuserSaveRes) {
				// Call the assertion callback
				done(sysuserSaveErr);
			});
	});

	it('should not be able to save Sysuser instance if no name is provided', function(done) {
		// Invalidate name field
		sysuser.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sysuser
				agent.post('/sysusers')
					.send(sysuser)
					.expect(400)
					.end(function(sysuserSaveErr, sysuserSaveRes) {
						// Set message assertion
						(sysuserSaveRes.body.message).should.match('Please fill Sysuser name');
						
						// Handle Sysuser save error
						done(sysuserSaveErr);
					});
			});
	});

	it('should be able to update Sysuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sysuser
				agent.post('/sysusers')
					.send(sysuser)
					.expect(200)
					.end(function(sysuserSaveErr, sysuserSaveRes) {
						// Handle Sysuser save error
						if (sysuserSaveErr) done(sysuserSaveErr);

						// Update Sysuser name
						sysuser.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Sysuser
						agent.put('/sysusers/' + sysuserSaveRes.body._id)
							.send(sysuser)
							.expect(200)
							.end(function(sysuserUpdateErr, sysuserUpdateRes) {
								// Handle Sysuser update error
								if (sysuserUpdateErr) done(sysuserUpdateErr);

								// Set assertions
								(sysuserUpdateRes.body._id).should.equal(sysuserSaveRes.body._id);
								(sysuserUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Sysusers if not signed in', function(done) {
		// Create new Sysuser model instance
		var sysuserObj = new Sysuser(sysuser);

		// Save the Sysuser
		sysuserObj.save(function() {
			// Request Sysusers
			request(app).get('/sysusers')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Sysuser if not signed in', function(done) {
		// Create new Sysuser model instance
		var sysuserObj = new Sysuser(sysuser);

		// Save the Sysuser
		sysuserObj.save(function() {
			request(app).get('/sysusers/' + sysuserObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', sysuser.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Sysuser instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Sysuser
				agent.post('/sysusers')
					.send(sysuser)
					.expect(200)
					.end(function(sysuserSaveErr, sysuserSaveRes) {
						// Handle Sysuser save error
						if (sysuserSaveErr) done(sysuserSaveErr);

						// Delete existing Sysuser
						agent.delete('/sysusers/' + sysuserSaveRes.body._id)
							.send(sysuser)
							.expect(200)
							.end(function(sysuserDeleteErr, sysuserDeleteRes) {
								// Handle Sysuser error error
								if (sysuserDeleteErr) done(sysuserDeleteErr);

								// Set assertions
								(sysuserDeleteRes.body._id).should.equal(sysuserSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Sysuser instance if not signed in', function(done) {
		// Set Sysuser user 
		sysuser.user = user;

		// Create new Sysuser model instance
		var sysuserObj = new Sysuser(sysuser);

		// Save the Sysuser
		sysuserObj.save(function() {
			// Try deleting Sysuser
			request(app).delete('/sysusers/' + sysuserObj._id)
			.expect(401)
			.end(function(sysuserDeleteErr, sysuserDeleteRes) {
				// Set message assertion
				(sysuserDeleteRes.body.message).should.match('User is not logged in');

				// Handle Sysuser error error
				done(sysuserDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Sysuser.remove().exec();
		done();
	});
});