Simple Class
============

```javascript

var Class = require('simple-class')

var Foo = Class.extend({

  init: function Foo(foo) {
    this.foo = foo
  }

})

var SubFoo = Foo.extend({
  
  init: function SubFoo() {
    this._super('bar')
  }

})
```