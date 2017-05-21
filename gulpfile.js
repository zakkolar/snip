var gulp = require('gulp');
var shell = require('gulp-shell');
var del = require('del');
var rename = require('gulp-rename');
var ts = require('gulp-typescript');
var sass = require('gulp-sass');
var insert = require('gulp-insert');

// The root working directory where code is edited
var srcRoot = 'src';
// The root staging folder for gapps configurations
var dstRoot = 'build';

// Runs the copy-latest task, then calls gapps upload in the correct
// configuration directory based on the target environment
gulp.task('upload-latest', ['copy-latest'], shell.task(['gapps upload']));

gulp.task('clean-deployment', function(cb) {
    return del([dstRoot+'/**/*'],cb);
});

gulp.task('copy-latest', ['clean-deployment', 'copy-server-code', 'copy-client-code', 'compile-server-ts', 'compile-client-ts', 'compile-scss']);

gulp.task('copy-server-code', ['clean-deployment'], function(){
    return gulp.src([
        srcRoot + '/server/*.js',
        srcRoot + '/libs/*.js',
        srcRoot + '/ui/*.server.js'])
        .pipe(gulp.dest(dstRoot));
});

gulp.task('copy-client-code', ['clean-deployment'], function(){
    return gulp.src([
        srcRoot + '/ui/*.html',
        srcRoot + '/ui/*.css',
        srcRoot + '/ui/*.js'])
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-server-ts', ['clean-deployment'], function(){
    return gulp.src([
        srcRoot + '/server/*.ts'])
        .pipe(ts({
            module:"None"
        }))
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-client-ts', ['clean-deployment'], function(){
    return gulp.src([
        srcRoot + '/ui/*.ts'])
        .pipe(ts({
            module:"None"
        }))
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-scss', ['clean-deployment'], function(){
    return gulp.src(srcRoot + '/ui/*.scss')
        .pipe(sass())
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});

function addHTMLExtension(){
    return rename(function(path){
        if (path.extname !== '.html') {
            path.extname = path.extname + '.html';
        }
        return path;
    });

}

function addHtmlTags(){
    return insert.transform(function(contents,file){
        var fileParts = file.path.split(".");
        var extension = fileParts[fileParts.length-1];
        var openTag;
        var closeTag;

        switch(extension){
            case "js":
                openTag="<script type='text/javascript'>";
                closeTag="</script>";
                break;
            case "css":
                openTag="<style type='text/css'>";
                closeTag="</style>";
                break;
            default:
                openTag="";
                closeTag="";
                break;
        }

        return openTag+contents+closeTag;
    })
}
