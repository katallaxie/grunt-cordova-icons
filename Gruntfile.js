/*
 * grunt-cordova.icons
 * https://github.com/katallaxie/grunt-cordova-icons
 *
 * Copyright (c) 2016 Sebastian Döll
 * Licensed under the MIT license
 */
// syntax
'use strict';

// module
module.exports = (grunt) => {
  // project configuration
  grunt.initConfig({
    icons: {
      options: {
        // later to support the alternation of the config.xml
        config: 'cordova.xml',
        platforms: ['ios', 'android']
      },
      ios: {
        options: {
          platforms: ['ios'],
          // this does not expands the 'dest' to the platform and /icons
          expand: false
        },
        src: './icon.png',
        dest: 'build/res/ios'
      },
      android: {
        options: {
          platforms: 'android'
        },
        src: './icon.png',
        dest: 'build/res'
      }
    },

    // checking code style
    eslint: {
      options: {
        format: 'stylish'
      },
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ]
    },
    // before testing anything, clear the relevant paths
    clean: {
      test: ['build']
    },

  });

  // load the plugin task
  grunt.loadTasks('tasks');

  // load development tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-eslint');

  // when testing then first clean the relevant dirs and produce the icons
  grunt.registerTask('test', ['clean', 'icons']);
  // TODO: add unit tests

  // By default, lint and run all tests.
  grunt.registerTask('default', ['eslint', 'test']);

};
