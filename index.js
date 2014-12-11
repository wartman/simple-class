!function (name, context, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(definition)
  else context[name] = definition()
}('Class', this, function () {

  // Simple Class
  // ------------
  // A dead-simple class module with not TOO much magic.
  // Should work in even ancient browsers.

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

  // Extend an object
  function mixin(obj, src) {
    if (!src) return
    for (var key in src) {
      if (src.hasOwnProperty(key)) obj[key] = src[key]
    }
  }

  // A decorator to create a '_super' method
  function superMethod(Class, proto) {
    return function (meth) {
      var args = Array.prototype.slice.call(arguments, 1)
      var superMethod = (proto)
        ? Class._parent.prototype[meth]
        : Class._parent[meth]
      var result
      if (superMethod) {
        var ret = Class._parent
        Class._parent = Class._parent._parent
        result = superMethod.apply(this, args)
        Class._parent = ret
      } else {
        throw new Error('No super-method found: ' + meth)
      }
      return result
    }
  }

  // The base class
  function Class() {}

  // Extend and create a new class from the current one.
  Class.extend = function extend(_instance, _static) {
    _instance = _instance || {}
    var _parent = this
    var SubClass = (_instance.hasOwnProperty('constructor'))
      ? _instance.constructor
      : function () { return _parent.apply(this, arguments) }
    SubClass.prototype = create(_parent.prototype)
    mixin(SubClass, _parent) // Add static methods from the parent
    mixin(SubClass, _static)
    mixin(SubClass.prototype, _instance)
    SubClass.prototype.constructor = SubClass
    SubClass._parent = _parent
    SubClass._super = superMethod(SubClass, false)
    SubClass.prototype._super = superMethod(SubClass, true)
    SubClass.extend = extend
    return SubClass
  }

  return Class
})