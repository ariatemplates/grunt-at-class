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

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    clean: {
      tests: ['tmp'],
    },

    at_class: {
      singleton: {
        src: ['test/fixtures/library.js'],
        dest: 'tmp/singleton.js',
        options: {
          singleton: true,
          exports: "myGlobal",
          classpath: "tmp.Singleton"
        }
      },
      instance: {
        src: ['test/fixtures/cons*.js'],
        dest: 'tmp/instance.js',
        options: {
          singleton: false,
          exports: "anotherObject",
          classpath: "tmp.Instance"
        }
      },
      license: {
        src: ['test/fixtures/*.js'],
        dest: 'tmp/license/singleton.js',
        options: {
          // default singleton: true
          exports: "myGlobal",
          classpath: "tmp.license.Singleton",
          license: "test/fixtures/license.txt"
        }
      }
    },

    nodeunit: {
      tests: ['test/*.js'],
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'at_class', 'nodeunit']);

  grunt.registerTask('default', ['jshint', 'test']);

};