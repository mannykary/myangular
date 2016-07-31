'use strict';

var Scope = require('../src/scope');

describe('Scope', function() {

  it('can be constructed and used as an object', function() {
    var scope = new Scope();
    scope.aProperty = 1;

    expect(scope.aProperty).toBe(1);
  });

  describe('digest', function() {

  	var scope;

  	beforeEach(function() {
  		scope = new Scope();
  	});

  	it('calls the listener function of a watch on first $digest', function() {
  		var watchFn    = function() { return 'wat'; };

  		// Jasmine test double functions. Can stub any function and track calls to it and all arguments
  		// http://jasmine.github.io/2.0/introduction.html#section-Spies
  		var listenerFn = jasmine.createSpy();

  		// Register watcher on the scope
  		scope.$watch(watchFn, listenerFn);

  		// Call listener functions on all registered watchers
  		scope.$digest();

  		// toHaveBeenCalled() returns true if spy was called.
  		expect(listenerFn).toHaveBeenCalled();
  	});

  	it('calls the watch function with the scope as the argument', function() {
  		var watchFn    = jasmine.createSpy();
  		var listenerFn = function() { };
  		scope.$watch(watchFn, listenerFn);

  		scope.$digest();

  		expect(watchFn).toHaveBeenCalledWith(scope);
  	});

		it('calls the listener function when the watched value changes', function() {
	  	scope.someValue = 'a';
	  	scope.counter = 0;

	  	scope.$watch(
	  		function(scope) { return scope.someValue; },
	  		function(newValue, oldValue, scope) { scope.counter++; }
	  	);

	  	expect(scope.counter).toBe(0);

	  	scope.$digest();
	  	expect(scope.counter).toBe(1);
			
			scope.$digest();
	  	expect(scope.counter).toBe(1);

	  	scope.someValue = 'b';
	  	expect(scope.counter).toBe(1); // Have not yet called $digest, so scope.counter still 1

	  	scope.$digest(); // This call to $digest will increment scope.counter
	  	expect(scope.counter).toBe(2);

	  });
	  
	});

});