!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('Class', this, function () {

  // Simple Class
  // ------------
  // A simple Class implementation.

  // Use Object.create or a simple shim.
  var create = (Object.create || (function () {
    function Object() {}
    return function (prototype) {
      Object.prototype = prototype
      var result = new Object()
      Object.prototype = null
      return result
    }
  }))

  // Define a method, wrapping it for calls to its super if needed.
  function method(obj, key, method) {
    var _super = obj[key]
    if (_super && 'function' === typeof method
        // Check to make sure we don't create circular dependencies.
        && (!_super.valueOf || _super.valueOf() != method.valueOf())
        && /\b_super\b/.test(method)) {
      // Ensure we're using the underlying function (if `method` was already wrapped)
      var originalMethod = method.valueOf()
      // Override the method
      method = function () {
        var prev = this._super || function () {}
        var result
        this._super = _super
        try {
          result = originalMethod.apply(this, arguments)
        } finally {
          this._super = prev
        }
        return result
      }
      method.valueOf = function (type) {
        return (type = 'object')? method : originalMethod
      }
      method.toString = function () {
        return String(originalMethod)
      }
    }
    obj[key] = method
  }

  // Extend an object.
  function mixin(dest, source) {
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        if (key === 'constructor') continue
        method(dest, key, source[key])
      }
    }
    return dest
  }

  // The base class
  function Class() {
    // No-op
  }

  // Extend and create a new class from the current one.
  Class.extend = function extend(_instance, _static) {
    _instance = _instance || {}
    // Alias the constructor
    if (_instance.hasOwnProperty('constructor')) {
      var __constructor = _instance.constructor
      _instance.__constructor = __constructor
      delete _instance.constructor
    }
    var _parent = this
    var SubClass = function Class() { // Named for prettier console logging
      this._super = function () {} // Default super method
      if (Class.prototype.__constructor) Class.prototype.__constructor.apply(this, arguments)
    }
    SubClass.prototype = create(_parent.prototype)
    SubClass._super = function () {} // Default Super method
    mixin(SubClass, _parent) // Add static methods from the parent
    mixin(SubClass, _static)
    mixin(SubClass.prototype, _instance)
    SubClass.prototype.constructor = SubClass
    SubClass.extend = extend
    // A more useful toString method
    SubClass.toString = function () {
      return (this.prototype.__constructor)? this.prototype.__constructor.toString() : '[Class]'
    }
    SubClass.valueOf = function () {
      return (this.prototype.__constructor)? this.prototype.__constructor.valueOf() : Object.valueOf()
    }
    return SubClass
  }

  return Class
})