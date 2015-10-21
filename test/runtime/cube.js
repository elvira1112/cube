global.window = {};
var testMod = require('../../runtime/cube.js');
var expect = require('expect.js');

describe('runtime/cube.js', function () {

  describe('test require', function () {
    var scripts = [];
    window.Cube.prototype._genScriptTag = function (name) {
      scripts.push(name);
    };
    beforeEach(function () {
      scripts = [];
    });

    it('should work fine', function (done) {
      window.Cube.use('/test.js', function (mod) {
        setTimeout(function () {
          expect(mod.name).to.be('test');
          expect(Object.keys(window.Cube._flag).length).to.be(0);
          expect(Object.keys(window.Cube._cached)).to.eql([
            '/test.js',
            '/a',
            '/b',
            '/c',
            '_'
          ]);
          done();
        }, 1);
      });
      window.Cube('/test.js', ['/a', '/b', '/c'], function (module, exports, require) {
        var a = require('/a');
        var b = require('/b');
        var c = require('/c');
        expect(module.exports === exports).to.be.ok();
        exports.name = 'test';
        return module.exports;
      });
      window.Cube('/a', [], function (module, exports, require) {
        exports.name = 'a';
        return module.exports;
      });
      window.Cube('/b', [], function (module, exports, require) {
        exports.name = 'b';
        return module.exports;
      });
      window.Cube('/c', [], function (module, exports, require) {
        exports.name = 'c';
        return module.exports;
      });
      expect(scripts.length).to.be(4);
    });
  });
});
