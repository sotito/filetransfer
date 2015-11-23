'use strict';

// Wallets controller
angular.module('wallets').controller('WalletsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Wallets',
	function($scope, $stateParams, $location, Authentication, Wallets) {
		$scope.authentication = Authentication;

		// Create new Wallet
		$scope.create = function() {
			// Create new Wallet object
			var wallet = new Wallets ({
				name: this.name
			});

			// Redirect after save
			wallet.$save(function(response) {
				$location.path('wallets/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Wallet
		$scope.remove = function(wallet) {
			if ( wallet ) { 
				wallet.$remove();

				for (var i in $scope.wallets) {
					if ($scope.wallets [i] === wallet) {
						$scope.wallets.splice(i, 1);
					}
				}
			} else {
				$scope.wallet.$remove(function() {
					$location.path('wallets');
				});
			}
		};

		// Update existing Wallet
		$scope.update = function() {
			var wallet = $scope.wallet;

			wallet.$update(function() {
				$location.path('wallets/' + wallet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Wallets
		$scope.find = function() {
			$scope.wallets = Wallets.query();
		};

		// Find existing Wallet
		$scope.findOne = function() {
			$scope.wallet = Wallets.get({ 
				walletId: $stateParams.walletId
			});
		};
	}
]);