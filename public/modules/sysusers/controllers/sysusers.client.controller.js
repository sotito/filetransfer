'use strict';

// Sysusers controller
angular.module('sysusers').controller('SysusersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Sysusers',
	function($scope, $stateParams, $location, Authentication, Sysusers) {
		$scope.authentication = Authentication;

		// Create new Sysuser
		$scope.create = function() {
			// Create new Sysuser object
			var sysuser = new Sysusers ({
				firstName: this.firstName,
				lastName: this.lastName,
				userName: this.userName,
				password: this.password,
				managerID: this.managerID
			});

			// Redirect after save
			sysuser.$save(function(response) {
				$location.path('sysusers/' + response._id);

				// Clear form fields
				$scope.firstName = '';
				$scope.lastName = '';
				$scope.userName = '';
				$scope.password = '';
				$scope.managerID = '';









			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Sysuser
		$scope.remove = function(sysuser) {
			if ( sysuser ) { 
				sysuser.$remove();

				for (var i in $scope.sysusers) {
					if ($scope.sysusers [i] === sysuser) {
						$scope.sysusers.splice(i, 1);
					}
				}
			} else {
				$scope.sysuser.$remove(function() {
					$location.path('sysusers');
				});
			}
		};

		// Update existing Sysuser
		$scope.update = function() {
			var sysuser = $scope.sysuser;

			sysuser.$update(function() {
				$location.path('sysusers/' + sysuser._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Sysusers
		$scope.find = function() {
			$scope.sysusers = Sysusers.query();
		};

		// Find existing Sysuser
		$scope.findOne = function() {
			$scope.sysuser = Sysusers.get({ 
				sysuserId: $stateParams.sysuserId
			});
		};
	}
]);