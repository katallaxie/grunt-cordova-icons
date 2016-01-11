// syntax
'use strict';

// module
module.exports = (grunt) => {
  // dependencies
  const gm = require('gm');
  const path = require('path');
  const fs = require('fs');
  const async = require('async');
  // map grunt
  const log = grunt.log;
  const util = grunt.util;
  // defaults
  let icons = {
    ios: require('ios-icons')(),
    android: require('android-icons')()
  };

  function run(tasks, done) {
    //done(false);
    async.parallel(tasks, (error) => {
      if (error) {
        throw new util.error(`Error-> Processing icons`);
      }
      // nothing else to do
      done(true);
    });
  }

  // icon task
  function icon(src, dst, size) {
    return (callback) => {
      gm(src)
        .resize(size.width || size.height, size.height || size.width, '!')
        .gravity('Center')
        .write(dst, error => {
          if (error) {
            log.error(error);
          } else {
            callback(null, `${dst}`);
          }
        });
    };
  }

  function mkdir(dir) {
    grunt.file.mkdir(dir);
  }

  function isImage(file) {
    try {
      if (fs.statSync(file).isFile()) {
        return true;
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        log.fail(`${file} does not exists or is not an image.`);
      }
      return false;
    }
  }

  // register as multi task to have multiple targets running
  grunt.registerMultiTask('icons', 'Creates icons for a Cordova project', function() {
    // console.log(this);
    let done = this.async(),
      tasks = [],
      src = this.files[0].src[0],
      dest = this.files[0].dest;
    // being explicit
    tasks.length = 0;

    // merging task-specific and/or target-specific options witht the defaults
    let options = this.options({
      config: 'config.xml',
      platforms: ['ios', 'android'],
      expand: true
    });

    // so, in case just a string was passed in
    if (util.kindOf(options.platforms) !== 'array') {
      options.platforms = [options.platforms];
    }

    // filter for available platforms in task
    options.platforms = options.platforms.filter(platform => {
      return icons.hasOwnProperty(platform) || false;
    });

    if (!isImage(src)) {
      throw new util.error();
    }

    // proccess the platforms
    options.platforms.forEach(platform => {
      // setting the dir that the icons are written to
      let dir = options.expand ? path.join(dest, 'icons', platform) : dest;
      // create the directory
      mkdir(dir);
      // queue the creation tasks to be executed async in parallel
      icons[platform].forEach(i => {
        // set filename
        let file = path.join(dir, i.name);
        // push to the tasks queue
        tasks.push(icon(src, file, {width: i.width, height: i.width}));
      });
    });

    // check the task queue
    if (tasks.length > 0) {
      // run the task queue; pass along the promise
      run(tasks, done);
    } else {
      // end if there is nothing in the queue
      done();
    }
  });
};
