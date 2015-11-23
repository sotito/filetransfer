'use strict';

//Wallets service used to communicate Wallets REST endpoints
angular.module('wallets').factory('Wallets', ['$resource',
	function($resource) {
		return $resource('wallets/:walletId', { walletId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);