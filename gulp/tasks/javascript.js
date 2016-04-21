var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var livereload = require('gulp-livereload');
var size = require('gulp-size');
var config = require('../config').js;
var streamqueue = require('streamqueue');
var concat = require('gulp-concat');
var handleErrors = require('../util/handleErrors');
var webpackStream = require('webpack-stream');
var path = require('path');
var webpack = require("webpack");

gulp.task('js', function () {
  return gulp.src(config.src)
    .pipe(webpackStream({
      plugins: [
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery'
        })
      ],
      module: {
        // preLoaders: [
        //   {
        //     test: /\.js$/,
        //     exclude: /node_modules/,
        //     loader: require.resolve('eslint-loader')
        //   }
        // ],
        loaders: [
          { test: /jquery\.js$/, loader: 'expose?$' },
          { test: /jquery\.js$/, loader: 'expose?jQuery' },
          {
            test: /\.js$/,
            include: [
              path.resolve(__dirname, '../../src/js')
            ],
            // exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              plugins: ['transform-object-rest-spread']
            }
          }
        ]
      },
      devtool: 'source-map',
      output: {
        filename: config.resultFile
      }
    }))
    .on('error', handleErrors)
    .pipe(gulp.dest(config.dest))
    .pipe(livereload())
    .pipe(size({
      title: 'JS'
    }));
  //
  // var bundle = browserify({
  //   entries: config.src,
  //   debug: true
  // }).on('error', handleErrors)
  // .bundle().on('error', handleErrors)
  // .pipe(source(config.resultFile))
  // .pipe(buffer())
  // .pipe(sourcemaps.init({ loadMaps: true }))
  // .pipe(sourcemaps.write())
  // .pipe(gulp.dest(config.dest))
  // .pipe(livereload())
  // .pipe(size({
  //   title: 'JS'
  // }));

  // config.vendor.forEach(function (item) {
  //   b.require(item.path, {expose: item.name})
  // });

  // return streamqueue({ objectMode: true },
  //   gulp.src(config.vendor),
  //   bundle
  // )
  // .pipe(concat(config.resultFile))
  // .pipe(gulp.dest(config.dest))
  // .pipe(livereload())
  // .pipe(size({
  //   title: 'JS'
  // }));
});