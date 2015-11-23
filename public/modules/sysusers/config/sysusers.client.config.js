'use strict';

// Configuring the Articles module
angular.module('sysusers').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Sysusers', 'sysusers', 'dropdown', '/sysusers(/create)?');
		Menus.addSubMenuItem('topbar', 'sysusers', 'List Sysusers', 'sysusers');
		Menus.addSubMenuItem('topbar', 'sysusers', 'New Sysuser', 'sysusers/create');
	}
]);