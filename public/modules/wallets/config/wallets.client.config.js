'use strict';

// Configuring the Articles module
angular.module('wallets').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Wallets', 'wallets', 'dropdown', '/wallets(/create)?');
		Menus.addSubMenuItem('topbar', 'wallets', 'List Wallets', 'wallets');
		Menus.addSubMenuItem('topbar', 'wallets', 'New Wallet', 'wallets/create');
	}
]);