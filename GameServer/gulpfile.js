var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('lint', function ()
{
    gulp.src('./**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('develop', function ()
{
    nodemon({
        script: 'server.js',
        ext: 'js',
        tasks: ['lint']
    })
        .on('restart', function ()
        {
            console.log('restarted!');
        });
});