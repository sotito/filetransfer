'use strict';

//Setting up route
angular.module('wallets').config(['$stateProvider',
	function($stateProvider) {
		// Wallets state routing
		$stateProvider.
		state('listWallets', {
			url: '/wallets',
			templateUrl: 'modules/wallets/views/list-wallets.client.view.html'
		}).
		state('createWallet', {
			url: '/wallets/create',
			templateUrl: 'modules/wallets/views/create-wallet.client.view.html'
		}).
		state('viewWallet', {
			url: '/wallets/:walletId',
			templateUrl: 'modules/wallets/views/view-wallet.client.view.html'
		}).
		state('editWallet', {
			url: '/wallets/:walletId/edit',
			templateUrl: 'modules/wallets/views/edit-wallet.client.view.html'
		});
	}
]);