'use strict';

//Sysusers service used to communicate Sysusers REST endpoints
angular.module('sysusers').factory('Sysusers', ['$resource',
	function($resource) {
		return $resource('sysusers/:sysuserId', { sysuserId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);