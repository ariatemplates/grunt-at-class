/*
 * Copyright 2013 Amadeus s.a.s.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var grunt = require('grunt');
var vm = require('vm');

function runInContext (code, memCheck) {
  var sandbox = {
    Aria : {
      classDefinition : function (definition) {
        var contextNamespace = "", classname;
        var index = definition.$classpath.lastIndexOf(".");
        if (index > -1) {
          contextNamespace = definition.$classpath.slice(0, index);
          classname = definition.$classpath.slice(index + 1);
        } else {
          classname = definition.$classpath;
        }
        var context = sandbox.Aria.nspace(contextNamespace);

        if (!definition.$constructor) {
          definition.$constructor = function () {};
        }

        // This looks pretty much like what we do in Aria.memCheckMode
        var Cnstrctr = !memCheck ? definition.$constructor : function () {
          definition.$constructor.apply(this, arguments);
        };

        if (definition.$singleton) {
          context[classname] = new Cnstrctr();
        } else {
          context[classname] = Cnstrctr;
        }

        context[classname].$package = contextNamespace;
        context[classname].$class = classname;

        if (definition.$onload) {
          definition.$onload.call(context[classname], definition, context[classname]);
        }
      },
      nspace : function (path) {
        if (!path) {
          return sandbox;
        }
        var segments = path.split(".");
        var base = sandbox;
        segments.forEach(function (name) {
          if (!(name in base)) {
            base[name] = {};
          }
          base = base[name];
        });
        return base;
      }
    }
  };
  vm.runInNewContext(code, sandbox);
  return sandbox;
}



exports.at_class = {
  singleton: function(test) {
    test.expect(2);

    var actual = grunt.file.read("tmp/singleton.js").toString();
    test.ok(/\$singleton\s*\:\s*true/.test(actual), "Expecting to find $singleton:true");

    var sandbox = runInContext(actual);
    test.equal(sandbox.tmp.Singleton.getIt(), 12);

    test.done();
  },
  singletonMemCheck: function(test) {
    test.expect(2);

    var actual = grunt.file.read("tmp/singleton.js").toString();
    test.ok(/\$singleton\s*\:\s*true/.test(actual), "Expecting to find $singleton:true");

    var sandbox = runInContext(actual, true);
    test.equal(sandbox.tmp.Singleton.getIt(), 12);

    test.done();
  },
  instance: function(test) {
    test.expect(3);

    var actual = grunt.file.read("tmp/instance.js").toString();
    test.ok(!/\$singleton/.test(actual), "Expecting not to be a singleton");

    var Constructor = runInContext(actual).tmp.Instance;
    var instanceOne = new Constructor(1);
    var instanceFour = new Constructor(4);
    instanceOne.increase();
    instanceFour.twice();
    test.equal(instanceOne.getValue(), 2);
    test.equal(instanceFour.getValue(), 8);

    test.done();
  },
  instanceMemCheck: function(test) {
    test.expect(3);

    var actual = grunt.file.read("tmp/instance.js").toString();
    test.ok(!/\$singleton/.test(actual), "Expecting not to be a singleton");

    var Constructor = runInContext(actual, true).tmp.Instance;
    var instanceOne = new Constructor(1);
    var instanceFour = new Constructor(4);
    instanceOne.increase();
    instanceFour.twice();
    test.equal(instanceOne.getValue(), 2);
    test.equal(instanceFour.getValue(), 8);

    test.done();
  },
  license: function(test) {
    test.expect(3);

    var actual = grunt.file.read("tmp/license/singleton.js").toString();
    test.ok(/\$singleton\s*\:\s*true/.test(actual), "Expecting to find $singleton:true");

    test.ok(/This is a license file/.test(actual), "Expecting to find a license");

    var singleton = runInContext(actual).tmp.license.Singleton;
    singleton.multiply(2);
    test.equal(singleton.getIt(), 24);

    test.done();
  },
  rootSingleton: function (test) {
    test.expect(1);

    var actual = grunt.file.read("tmp/root.js").toString();
    var sandbox = runInContext(actual);
    test.equal(sandbox.RootSingleton.getIt(), 12);

    test.done();
  }
};
