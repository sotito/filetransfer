'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Wallet = mongoose.model('Wallet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, wallet;

/**
 * Wallet routes tests
 */
describe('Wallet CRUD tests', function() {
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

		// Save a user to the test db and create new Wallet
		user.save(function() {
			wallet = {
				name: 'Wallet Name'
			};

			done();
		});
	});

	it('should be able to save Wallet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wallet
				agent.post('/wallets')
					.send(wallet)
					.expect(200)
					.end(function(walletSaveErr, walletSaveRes) {
						// Handle Wallet save error
						if (walletSaveErr) done(walletSaveErr);

						// Get a list of Wallets
						agent.get('/wallets')
							.end(function(walletsGetErr, walletsGetRes) {
								// Handle Wallet save error
								if (walletsGetErr) done(walletsGetErr);

								// Get Wallets list
								var wallets = walletsGetRes.body;

								// Set assertions
								(wallets[0].user._id).should.equal(userId);
								(wallets[0].name).should.match('Wallet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Wallet instance if not logged in', function(done) {
		agent.post('/wallets')
			.send(wallet)
			.expect(401)
			.end(function(walletSaveErr, walletSaveRes) {
				// Call the assertion callback
				done(walletSaveErr);
			});
	});

	it('should not be able to save Wallet instance if no name is provided', function(done) {
		// Invalidate name field
		wallet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wallet
				agent.post('/wallets')
					.send(wallet)
					.expect(400)
					.end(function(walletSaveErr, walletSaveRes) {
						// Set message assertion
						(walletSaveRes.body.message).should.match('Please fill Wallet name');
						
						// Handle Wallet save error
						done(walletSaveErr);
					});
			});
	});

	it('should be able to update Wallet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wallet
				agent.post('/wallets')
					.send(wallet)
					.expect(200)
					.end(function(walletSaveErr, walletSaveRes) {
						// Handle Wallet save error
						if (walletSaveErr) done(walletSaveErr);

						// Update Wallet name
						wallet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Wallet
						agent.put('/wallets/' + walletSaveRes.body._id)
							.send(wallet)
							.expect(200)
							.end(function(walletUpdateErr, walletUpdateRes) {
								// Handle Wallet update error
								if (walletUpdateErr) done(walletUpdateErr);

								// Set assertions
								(walletUpdateRes.body._id).should.equal(walletSaveRes.body._id);
								(walletUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Wallets if not signed in', function(done) {
		// Create new Wallet model instance
		var walletObj = new Wallet(wallet);

		// Save the Wallet
		walletObj.save(function() {
			// Request Wallets
			request(app).get('/wallets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Wallet if not signed in', function(done) {
		// Create new Wallet model instance
		var walletObj = new Wallet(wallet);

		// Save the Wallet
		walletObj.save(function() {
			request(app).get('/wallets/' + walletObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', wallet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Wallet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Wallet
				agent.post('/wallets')
					.send(wallet)
					.expect(200)
					.end(function(walletSaveErr, walletSaveRes) {
						// Handle Wallet save error
						if (walletSaveErr) done(walletSaveErr);

						// Delete existing Wallet
						agent.delete('/wallets/' + walletSaveRes.body._id)
							.send(wallet)
							.expect(200)
							.end(function(walletDeleteErr, walletDeleteRes) {
								// Handle Wallet error error
								if (walletDeleteErr) done(walletDeleteErr);

								// Set assertions
								(walletDeleteRes.body._id).should.equal(walletSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Wallet instance if not signed in', function(done) {
		// Set Wallet user 
		wallet.user = user;

		// Create new Wallet model instance
		var walletObj = new Wallet(wallet);

		// Save the Wallet
		walletObj.save(function() {
			// Try deleting Wallet
			request(app).delete('/wallets/' + walletObj._id)
			.expect(401)
			.end(function(walletDeleteErr, walletDeleteRes) {
				// Set message assertion
				(walletDeleteRes.body.message).should.match('User is not logged in');

				// Handle Wallet error error
				done(walletDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Wallet.remove().exec();
		done();
	});
});