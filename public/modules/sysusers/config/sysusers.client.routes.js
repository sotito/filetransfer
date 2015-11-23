'use strict';

//Setting up route
angular.module('sysusers').config(['$stateProvider',
	function($stateProvider) {
		// Sysusers state routing
		$stateProvider.
		state('listSysusers', {
			url: '/sysusers',
			templateUrl: 'modules/sysusers/views/list-sysusers.client.view.html'
		}).
		state('createSysuser', {
			url: '/sysusers/create',
			templateUrl: 'modules/sysusers/views/create-sysuser.client.view.html'
		}).
		state('viewSysuser', {
			url: '/sysusers/:sysuserId',
			templateUrl: 'modules/sysusers/views/view-sysuser.client.view.html'
		}).
		state('editSysuser', {
			url: '/sysusers/:sysuserId/edit',
			templateUrl: 'modules/sysusers/views/edit-sysuser.client.view.html'
		});
	}
]);