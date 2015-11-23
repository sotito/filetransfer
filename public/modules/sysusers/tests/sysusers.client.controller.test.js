'use strict';

(function() {
	// Sysusers Controller Spec
	describe('Sysusers Controller Tests', function() {
		// Initialize global variables
		var SysusersController,
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

			// Initialize the Sysusers controller.
			SysusersController = $controller('SysusersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Sysuser object fetched from XHR', inject(function(Sysusers) {
			// Create sample Sysuser using the Sysusers service
			var sampleSysuser = new Sysusers({
				name: 'New Sysuser'
			});

			// Create a sample Sysusers array that includes the new Sysuser
			var sampleSysusers = [sampleSysuser];

			// Set GET response
			$httpBackend.expectGET('sysusers').respond(sampleSysusers);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sysusers).toEqualData(sampleSysusers);
		}));

		it('$scope.findOne() should create an array with one Sysuser object fetched from XHR using a sysuserId URL parameter', inject(function(Sysusers) {
			// Define a sample Sysuser object
			var sampleSysuser = new Sysusers({
				name: 'New Sysuser'
			});

			// Set the URL parameter
			$stateParams.sysuserId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/sysusers\/([0-9a-fA-F]{24})$/).respond(sampleSysuser);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.sysuser).toEqualData(sampleSysuser);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Sysusers) {
			// Create a sample Sysuser object
			var sampleSysuserPostData = new Sysusers({
				name: 'New Sysuser'
			});

			// Create a sample Sysuser response
			var sampleSysuserResponse = new Sysusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Sysuser'
			});

			// Fixture mock form input values
			scope.name = 'New Sysuser';

			// Set POST response
			$httpBackend.expectPOST('sysusers', sampleSysuserPostData).respond(sampleSysuserResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Sysuser was created
			expect($location.path()).toBe('/sysusers/' + sampleSysuserResponse._id);
		}));

		it('$scope.update() should update a valid Sysuser', inject(function(Sysusers) {
			// Define a sample Sysuser put data
			var sampleSysuserPutData = new Sysusers({
				_id: '525cf20451979dea2c000001',
				name: 'New Sysuser'
			});

			// Mock Sysuser in scope
			scope.sysuser = sampleSysuserPutData;

			// Set PUT response
			$httpBackend.expectPUT(/sysusers\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/sysusers/' + sampleSysuserPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid sysuserId and remove the Sysuser from the scope', inject(function(Sysusers) {
			// Create new Sysuser object
			var sampleSysuser = new Sysusers({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Sysusers array and include the Sysuser
			scope.sysusers = [sampleSysuser];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/sysusers\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleSysuser);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.sysusers.length).toBe(0);
		}));
	});
}());