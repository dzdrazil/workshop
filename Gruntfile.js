'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    webpack: {
      app: {
        entry: './assets/src/main.js',
        output: {
          path: 'assets/public/scripts/',
          filename: 'build.js'
        },
        stats: {
          colors: true,
          modules: true,
          reasons: true
        },
        module: {
          loaders: [
            {
              // test: /\.js$/,
              // loader: 'webpack-traceur?runtime',
              loader: 'traceur?runtime',
              test: /^(?!.*(node_modules))+.+\.js$/,
              // exclude: /(node_modules)/
            },
            { test: /\.html$/, loader: 'ractive' }
          ]
        },
        resolve: {
          // you can now require('file') instead of require('file.js')
          extensions: ['', '.js', '.json']
        }
      }
    },
    watch: {
      files: ['./assets/src/**/*.js'],
      tasks: ['webpack']
    }
  });

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['webpack', 'watch']);

};
