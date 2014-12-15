Simple Class
============

```javascript

var Class = require('simple-class')

var Foo = Class.extend({

  constructor: function Foo(foo) {
    this.foo = foo
  }

})

var SubFoo = Foo.extend({
  
  constructor: function SubFoo() {
    this._super('bar')
  }

})
```