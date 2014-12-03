var expect = require('expect.js')
var Class = require('../')

describe('Class', function () {
  
  describe('#extend', function () {

    it('creates a new class', function () {
      var Test = Class.extend({
        constructor: function () {
          this.foo = 'foo'
        }
      })
      expect(Test).to.be.a('function')
      expect(Test.extend).to.equal(Class.extend)
      var test = new Test()
      expect(test).to.be.a(Test)
      expect(test.foo).to.equal('foo')
    })

    it('creates instance methods', function () {
      var Test = Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function () {
          return this.foo
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      expect(Test.prototype.getFoo).to.be.a('function')
      var test = new Test('foo')
      expect(test.getFoo).to.be.a('function')
      expect(test.setFoo).to.be.a('function')
      expect(test.getFoo()).to.equal('foo')
      test.setFoo('bar')
      expect(test.getFoo()).to.equal('bar')
    })

    it('inherits instance methods', function () {
      var Test = Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function () {
          return this.foo
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      var TestTwo = Test.extend()
      expect(TestTwo.prototype.getFoo).to.be.a('function')
      var test = new TestTwo('foo')
      expect(test.getFoo).to.be.a('function')
      expect(test.setFoo).to.be.a('function')
      expect(test.getFoo()).to.equal('foo')
      test.setFoo('bar')
      expect(test.getFoo()).to.equal('bar')
    })

  })

  describe('#_super', function () {

    it('grants access to super calls', function () {
      var Test = Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function () {
          return this.foo
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      var TestTwo = Test.extend({
        getFoo: function () {
          return this._super('getFoo') + 'bar'
        }
      })
      var test = new TestTwo('foo')
      expect(test.getFoo()).to.equal('foobar')
      var TestThree = TestTwo.extend({
        getFoo: function () {
          return this._super('getFoo') + 'bin'
        }
      })
      var test = new TestThree('foo')
      expect(test.getFoo()).to.equal('foobarbin')
    })

    it('does not endlessly loop', function () {
      var _called = ''
      var Test = Class.extend({
        constructor: function () {
          _called += 'first'
        }
      })
      var SubTest = Test.extend({
        constructor: function () {
          _called += 'second'
          this._super('constructor')
        }
      })
      var SubSubTest = SubTest.extend({
        constructor: function () {
          _called += 'last'
          this._super('constructor')
        }
      })
      var test = new SubSubTest()
      expect(_called).to.equal('lastsecondfirst')
    })

    it('passes arguments to super calls', function () {
      var Test = Class.extend({
        constructor: function (foo) {
          this.setFoo(foo)
        },
        getFoo: function (append) {
          return this.foo + append
        },
        setFoo: function (foo) {
          this.foo = foo
        }
      })
      var TestTwo = Test.extend({
        constructor: function () {
          this._super('constructor', 'foo')
        },
        getFoo: function () {
          return this._super('getFoo', 'bar')
        }
      })
      var test = new TestTwo()
      expect(test.getFoo()).to.equal('foobar')
    })

  })

})