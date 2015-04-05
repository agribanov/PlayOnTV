var config  = require('./gulp.config'),
    gulp    = require('gulp'),
    gutil   = require('gulp-util'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    browserify = require('gulp-browserify'),
    LessPluginAutoPrefix = require('less-plugin-autoprefix'),
    autoprefix = new LessPluginAutoPrefix({ browsers: ["last 2 versions"] }),
    less    = require('gulp-less'),
    uglify    = require('gulp-uglify'),
    server  = require('gulp-develop-server'),
    bs      = require( 'browser-sync' ),
    livereload = require( 'gulp-livereload' );

gulp.task('clean', function(){
  return gulp.src(config.buildDir+'*', {read: false})
    .pipe(clean());
});

gulp.task('copy', ['copy:html', 'copy:assets']);

gulp.task('copy:html', function(){
  return gulp.src(config.files.frontend.html)
      .pipe(gulp.dest(config.buildDir));

});

gulp.task('copy:assets', function(){
  return gulp.src(config.files.frontend.assets)
      .pipe(gulp.dest(config.buildDir + '/assets'));

});

gulp.task('copyWidget', ['copyWidget:html', 'copyWidget:lib', 'copyWidget:xml', 'copyWidget:assets']);

gulp.task('copyWidget:html', function(){
  return gulp.src(config.files.widget.html)
      .pipe(gulp.dest(config.widgetCompileDir));

});

gulp.task('copyWidget:lib', function(){
  return gulp.src(config.files.widget.lib)
      .pipe(gulp.dest(config.widgetCompileDir + '/lib'));

});

gulp.task('copyWidget:xml', function(){
  return gulp.src(config.files.widget.xml)
      .pipe(gulp.dest(config.widgetCompileDir));

});

gulp.task('copyWidget:assets', function(){
  return gulp.src(config.files.widget.assets)
      .pipe(gulp.dest(config.widgetCompileDir + '/assets'));

});

gulp.task('less:frontend', function(){
  return gulp.src(config.main.frontend.less)
      .pipe(concat('app.less'))
      .pipe(less({
        plugins: [autoprefix]
      }))
      .pipe(gulp.dest(config.buildDir))
      .pipe(bs.reload({stream: true}));
});

gulp.task('less:widget', function(){
  return gulp.src(config.main.widget.less)
      .pipe(concat('app.less'))
      .pipe(less({
        plugins: [autoprefix]
      }))
      .pipe(gulp.dest(config.widgetCompileDir))
});

gulp.task('browserify:frontend', function(){
  return gulp.src(config.main.frontend.js)
      .pipe(browserify({transform: 'reactify'}))
      .pipe(gulp.dest(config.buildDir));
})

gulp.task('browserify:widget', function(){
  return gulp.src(config.main.widget.js)
      .pipe(browserify({transform: 'reactify'}))
      .pipe(uglify())
      .pipe(gulp.dest(config.widgetCompileDir));
})

gulp.task('server:start', function(){
  server.listen(config.server, function( error ) {
        livereload.listen(error);
        // if( ! error ) {
        //   bs( config.bs );
        // }
    });
});

gulp.task('start', ['clean', 'copy', 'less:frontend', 'browserify:frontend', 'server:start'], function(){
    function restart( file ) {
      server.changed( function( error ) {
          if( ! error ) {
            livereload.changed( file.path );
            bs.reload();
          }
      });
    }
 
    gulp.watch( config.files.backend ).on( 'change', restart );
    gulp.watch( config.files.frontend.html, ['copy:html', bs.reload]);
    gulp.watch( config.files.frontend.less, ['less:frontend']);
    gulp.watch( config.files.frontend.js, ['browserify:frontend', bs.reload]);
});

gulp.task('widget', ['copyWidget', 'less:widget', 'browserify:widget'], function(){
    gulp.watch( config.files.widget.html, ['copyWidget:html']);
    gulp.watch( config.files.widget.xml, ['copyWidget:xml']);
    gulp.watch( config.files.widget.lib, ['copyWidget:lib']);
    gulp.watch( config.files.widget.less, ['less:widget']);
    gulp.watch( config.files.widget.js, ['browserify:widget']);

});
