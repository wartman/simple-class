Simple Class
============

```javascript
var Foo = Class.extend({

  constructor: function Foo(foo) {
    this.foo = foo
  }

})

var SubFoo = Foo.extend({
  
  constructor: function SubFoo() {
    this._super('constructor', 'bar')
  }

})
```