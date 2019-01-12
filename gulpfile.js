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

gulp.task('clean-deployment', function(cb) {
    return del([dstRoot+'/**/*'],cb);
});

gulp.task('copy-server-code', function(){
    return gulp.src([
        srcRoot + '/server/*.js',
        srcRoot + '/libs/*.js',
        srcRoot + '/ui/*.server.js'])
        .pipe(gulp.dest(dstRoot));
});

gulp.task('copy-client-code', function(){
    return gulp.src([
        srcRoot + '/ui/*.html',
        srcRoot + '/ui/*.css',
        srcRoot + '/ui/*.js'])
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-server-ts', function(){
    return gulp.src([
        srcRoot + '/server/*.ts'])
        .pipe(ts({
            module:"None"
        }))
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-client-ts', function(){
    return gulp.src([
        srcRoot + '/ui/*.ts'])
        .pipe(ts({
            module:"None"
        }))
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});

gulp.task('compile-scss', function(){
    return gulp.src(srcRoot + '/ui/*.scss')
        .pipe(sass())
        .pipe(addHtmlTags())
        .pipe(addHTMLExtension())
        .pipe(gulp.dest(dstRoot));
});





gulp.task('copy-latest', gulp.series('clean-deployment', 'copy-server-code', 'copy-client-code', 'compile-server-ts', 'compile-client-ts', 'compile-scss'));

// Runs the copy-latest task, then calls gapps upload in the correct
// configuration directory based on the target environment
gulp.task('upload-latest', gulp.series('copy-latest', shell.task(['gapps upload'])));

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
