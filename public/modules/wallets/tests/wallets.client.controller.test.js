'use strict';

(function() {
	// Wallets Controller Spec
	describe('Wallets Controller Tests', function() {
		// Initialize global variables
		var WalletsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Wallets controller.
			WalletsController = $controller('WalletsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Wallet object fetched from XHR', inject(function(Wallets) {
			// Create sample Wallet using the Wallets service
			var sampleWallet = new Wallets({
				name: 'New Wallet'
			});

			// Create a sample Wallets array that includes the new Wallet
			var sampleWallets = [sampleWallet];

			// Set GET response
			$httpBackend.expectGET('wallets').respond(sampleWallets);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wallets).toEqualData(sampleWallets);
		}));

		it('$scope.findOne() should create an array with one Wallet object fetched from XHR using a walletId URL parameter', inject(function(Wallets) {
			// Define a sample Wallet object
			var sampleWallet = new Wallets({
				name: 'New Wallet'
			});

			// Set the URL parameter
			$stateParams.walletId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/wallets\/([0-9a-fA-F]{24})$/).respond(sampleWallet);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.wallet).toEqualData(sampleWallet);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Wallets) {
			// Create a sample Wallet object
			var sampleWalletPostData = new Wallets({
				name: 'New Wallet'
			});

			// Create a sample Wallet response
			var sampleWalletResponse = new Wallets({
				_id: '525cf20451979dea2c000001',
				name: 'New Wallet'
			});

			// Fixture mock form input values
			scope.name = 'New Wallet';

			// Set POST response
			$httpBackend.expectPOST('wallets', sampleWalletPostData).respond(sampleWalletResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Wallet was created
			expect($location.path()).toBe('/wallets/' + sampleWalletResponse._id);
		}));

		it('$scope.update() should update a valid Wallet', inject(function(Wallets) {
			// Define a sample Wallet put data
			var sampleWalletPutData = new Wallets({
				_id: '525cf20451979dea2c000001',
				name: 'New Wallet'
			});

			// Mock Wallet in scope
			scope.wallet = sampleWalletPutData;

			// Set PUT response
			$httpBackend.expectPUT(/wallets\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/wallets/' + sampleWalletPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid walletId and remove the Wallet from the scope', inject(function(Wallets) {
			// Create new Wallet object
			var sampleWallet = new Wallets({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Wallets array and include the Wallet
			scope.wallets = [sampleWallet];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/wallets\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleWallet);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.wallets.length).toBe(0);
		}));
	});
}());