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

var fs = require("fs");
var path = require("path");

module.exports = function(grunt) {
  var templates = {
    singleton: fs.readFileSync(path.join(__dirname, '../lib/templates/singleton.js'), "utf-8").toString(),
    instance: fs.readFileSync(path.join(__dirname, '../lib/templates/instance.js'), "utf-8").toString()
  };

  grunt.registerMultiTask('at_class', 'Wrap a JavaScript file in an Aria Templates class definition.', function() {
    var config = function (param) {
      return [this.name, this.target, "options", param];
    }.bind(this);

    // These parameters are mandatory, I wouldn't know what to do otherwise
    this.requiresConfig(config("classpath"), config("exports"));

    // While these other options are optional
    var options = this.options({
      singleton: true,
      license: false
    });

    this.files.forEach(function(description) {
      // In principle I'd expect only one src file, if not simply concatenate everything
      var src = description.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        return grunt.file.read(filepath);
      }).join("\n");

      var licenseText = readLicense(options.license);
      var wrappedFile = readTemplate(licenseText, src, options);

      grunt.file.write(description.dest, wrappedFile);

      // Print a success message.
      grunt.log.writeln('File "' + description.dest + '" created.');
    });
  });

  function readLicense (licensePath) {
    if (licensePath === false) {
      return "";
    }
    if (!grunt.file.exists(licensePath)) {
      grunt.log.warn('License file "' + licensePath + '" not found.');
      return "";
    }
    return grunt.file.read(licensePath);
  }

  function readTemplate (license, code, options) {
    var template = options.singleton ? templates.singleton : templates.instance;
    return template.replace(/__([A-Z]+)__/g, function (match, name) {
      if (name === "LICENSE") {
        return license;
      } else if (name === "CODE") {
        return code;
      } else if (name === "TODAY") {
        return (new Date()).toString();
      } else {
        return options[name.toLowerCase()] || "";
      }
    });
  }
};