var gulp = require('gulp');
var gulpConnect = require('gulp-connect');
var gulpUglify = require('gulp-uglify');
var gulpHtmlmin = require('gulp-htmlmin');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var imagemin = require("gulp-imagemin");
var minify = require('gulp-minify');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var cssnano = require("cssnano");
var sourcemaps = require("gulp-sourcemaps");
var gulpMinifyCss = require('gulp-minify-css');


function imgSquash(){
    return gulp
    .src("./src/img/*")
    .pipe(imagemin())
    .pipe(gulp.dest("./dist/img"));
}
gulp.task("imgSquash", imgSquash);

gulp.task('js', async function () {    
    return gulp.src([
        './src/js/*',
        './node_modules/bootstrap/dist/js/bootstrap.js'
    ])
    // .pipe(gulpConcat('bundle.js'))
    .pipe(gulpUglify())
    .pipe(minify())
    .pipe(gulp.dest('dist/js'))
    .pipe(gulpConnect.reload());
});

gulp.task('sayHello', async function () {
    console.log("Hello, selamat datang di Gulp!");
});

gulp.task('server', async function () {
    gulpConnect.server({
        root: "dist",
        livereload: true
    });
});

gulp.task('sass', async function(){
	gulp.src('src/sass/*.scss')
    .pipe(sass().on('error',sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
	.pipe(gulp.dest('dist/css'))
	.pipe(gulpConnect.reload());
})

// gulp.task('minify-js', async function () {
//     gulp
//         .src([
//             './src/js/*.js'
//         ])
//         .pipe(gulpConcat('bundle.js'))
//         .pipe(gulpUglify())
//         .pipe(gulp.dest('dist'))
//         .pipe(gulpConnect.reload());
// });

gulp.task('minify-css', async function() {
    gulp.src('./src/*.css')
      .pipe(gulpMinifyCss({
        compatibility: 'ie8'
      }))
      .pipe(gulp.dest('./dist/css'));
  });

gulp.task('minify-html', async function () {
    gulp.src('src/*.html')
        .pipe(gulpHtmlmin({
            collapseWhitespace: true
        }))
        .pipe(gulp.dest('dist'))
        .pipe(gulpConnect.reload());
});

gulp.task('watch', async function () {
    gulp.watch('./src/js/*.js', gulp.series('js'));
    gulp.watch('./src/sass/*.scss', gulp.series('sass'));
    gulp.watch('./src/*.html', gulp.series('minify-html'));
    gulp.watch('./src/img/', gulp.series('imgSquash'));
    gulp.watch('./src/*.css', gulp.series('minify-css'));
});

gulp.task('default', gulp.series('watch', 'server'));

gulp.task('clean', function() {
  return gulp.src('dist', {
    read: false,
    allowEmpty: true
  }).pipe(clean());
});

gulp.task('build', gulp.series('clean','sass','minify-css', 'minify-html', 'js', 'imgSquash'));