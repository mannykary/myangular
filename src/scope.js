'use strict';

var _ = require('lodash');

function Scope() {
	// $$ prefix signifies that this variable should be considered private in the Angular framework.
	this.$$watchers = [];
}

Scope.prototype.$watch = function(watchFn, listenerFn) {
	var watcher = {
		watchFn: watchFn,
		listenerFn: listenerFn
	};
	this.$$watchers.push(watcher);
};

// Call listener functions on all registered watchers
// Check if values specified by watch functions have actually changed, and _only then_ call
// the respective listener functions ==> "DIRTY CHECKING"
Scope.prototype.$digest = function() {
	var self = this;
	var newValue, oldValue;
	_.forEach(this.$$watchers, function(watcher) {
		newValue = watcher.watchFn(self);
		oldValue = watcher.last;
		if (newValue != oldValue) {
			watcher.last = newValue;
			watcher.listenerFn(newValue, oldValue, self);
		}
	});
};

module.exports = Scope;