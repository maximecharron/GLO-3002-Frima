var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');

gulp.task('lint', function ()
{
    gulp.src('./**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('develop', function ()
{
    nodemon({
        script: 'index.js',
        ext: 'js',
        tasks: ['lint']
    })
        .on('restart', function ()
        {
            console.log('restarted!');
        });
});
