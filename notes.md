# Build Your Own AngularJS Notes

## PART 1 - SCOPES

### Chapter 1 - Scopes and Dirty-Checking

`$watch`:
- Attach watcher to a scope. 
- A watcher is something that is notified when a change occurs on the scope.
- In Angular, you pass in a watch expression
     
`$digest`:
- Iterates over all the watchers attached to the scope, and runs their watch and listener functions accordingly
- Compare the watch function's return value to whatever the same function returned the last time
- If values differ, watcher is _dirty_ and its listener function should be called
- Every watch function is called during every `$digest`, so pay attention to number of watches you have, as well as the
  performance of each individual watch function or expression

### Chapter 2 - Scope Methods

`$eval`, `$apply`: Execute functions on digest loop immediately
- `$eval`: 
    - Takes a function as an argument and immediately executes that function giving it the scope itself as an argument
    - Returns whatever the function returned
- `$apply`:
    - Integrates external libraries with Angular
    - Takes a function as an argument and executes that function using `$eval`
    - Then it kick-starts the digest cycle by invoking `$digest`
    - Big idea is that we can execute some code that isn't aware of Angular. Code may still change things on the scope,
      and as long as we wrap the code in `$apply` we can be sure that any watches on the scope will pick up on those
      changes

`$evalAsync`, `$applyAsync`, `$$postDigest`: Time-shifted or deferred executions
- `$evalAsync`:
    - Takes a function and schedules it to run later but still during the ongoing digest
    - Defer some code from within a watch listener function -- the deferred code will be invoked within the current
      digest iteration
    - Often preferable to `$timeout` with zero delay due to browser event loop. `$timeout` relinquishes control to the
      browser and lets it decide when to run the scheduled work. The browser may then choose to execute other work
      before it gets to your timeout. However, `$evalAsync` is more strict about when scheduled work is executed -- it
      will happen during the ongoing digest and thus is guaranteed to run before the browser decides to do anything else.
      `$evalAsync` can avoid some unnecessary rendering.
- `$applyAsync`:
    - Performs `$apply` to a function from outside a digest loop asynchronously
    - Designed to be used like $apply is
    - Unlike `$apply`, it does not evaluate the given function immediately nor does it launch a digest immediately --
      execution is deferred
    - Main point is to optimize things that happen in quick succession so that they only need a single digest
- `$$postDigest`:
    - This is internal to Angular
    - Schedules a function to run "later" (after the next digest has finished)
    - Like `$evalAsync`, function scheduled with `$$postDigest` is executed just once
    - Unlike `$evalAsync` or `$applyAsync`, function scheduled with `$$postDigest` does _not_ cause a digest to be scheduled,
      so the function execution is delayed until digest happens for some other reason

`$watchGroup`: watch several things with a single effect

### Chapter 3 - Scope Inheritance

- Implemented on top of regular JavaScript prototypal object inheritance
- Root scope: at the top in Angular, with all other scopes being descendants of the root scope, created for
  controllers and directives.
- Create a child scope by called `$new` on an existing scope
- Child scope can access properties of parent scope, but parent scope _cannot_ access properties of child scope
- Child scope can manipulate and watch a parent scopes' properties
- Shadowing: assigning an attribute on a child that already exists on a parent does _not_ change the parent's attribute.
  We have two _different_ attributes on the scope chain, but with the same name. From the child's perspective, the
  parent's attribute is _shadowed_ by the child's attribute of the same name.
- Calling `$digest` on a scope digests the watches attached to the scope we called, and its children recursively
- Calling `$apply` digests all watches in the _whole scope hierarchy_ from the root.
- Calling `$evalAsync` schedules a digest on the root scope, and the scope being called
- Isolated scopes: do not prototypically inherit from its parent and thus does not have access to the parents' attributes.
  Pass boolean through `$new` (set to `true` to make it isolated)
- Substituting the parent scope: pass in "hierarchical" parent as second argument to `$new`
- Destroying scopes: need to keep scope hierarchy small by destroying any unused scopes. Call `$destroy` on the scope
