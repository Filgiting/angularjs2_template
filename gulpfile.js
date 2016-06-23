var gulp = require( 'gulp' );

/* 
 * CSS 
 */
var postCSS      = require( 'gulp-postcss' ),
    sourceMaps   = require( 'gulp-sourcemaps' ),
    autoPrefixer = require( 'autoprefixer' ),
    preCss       = require( 'precss' ),
    cssNano      = require( 'cssnano' );

/* 
 * JavaScript & TypeScript 
 */
var jsUglify   = require( 'gulp-uglify' ),
    typeScript = require( 'gulp-typescript' );

/* 
 * Изображения 
 */
var imageMin = require( 'gulp-imagemin' );

/*
 * Разное
 */
var extReplace = require( 'gulp-ext-replace' );

/*
 * Директории
 */
var assetsDev  = 'assets/', /* Директория ресурсов для разработки */
    assetsProd = 'src/', /* Директория ресурсов для приложения */
    appDev     = 'dev/', /* Директория разработки */
    appProd    = 'app/'; /* Директория приложения */

var tsProject = typeScript.createProject( 'tsconfig.json' );

/*
 * Таск для обработки CSS 
 */
gulp.task( 'build-css', function()
{
  return gulp.src( assetsDev + 'scss/*.scss' )
    .pipe( sourceMaps.init() )
    .pipe( postCSS( [ preCss, autoPrefixer, cssNano ] ) )
    .pipe( sourceMaps.write() )
    .pipe( extReplace( '.css' ) )
    .pipe( gulp.dest( assetsProd + 'css/' ) );
} );

/*
 * Таск для обработки TypeScript 
 */
gulp.task( 'build-ts', function()
{
  return gulp.src( appDev + '**/*.ts' )
    .pipe( sourceMaps.init() )
    .pipe( typeScript( tsProject ) )
    .pipe( sourceMaps.write() )
    //.pipe( jsuglify() )
    .pipe( gulp.dest( appProd ) );
} );

/*
 * Таск для обработки изображений 
 */
gulp.task( 'build-img', function()
{
  return gulp.src( assetsDev + 'img/**/*' )
    .pipe( imageMin( {
      progressive: true
    } ) )
    .pipe( gulp.dest( assetsProd + 'img/' ) );
} );

/*
 * Таск для обработки HTML 
 */
gulp.task( 'build-html', function()
{
  return gulp.src( appDev + '**/*.html' )
    .pipe( gulp.dest( appProd ) );
} );

/*
 * Таск для наблюдателя 
 */
gulp.task( 'watch', function()
{
  gulp.watch( appDev + '**/*.ts', [ 'build-ts' ] );
  gulp.watch( assetsDev + 'scss/**/*.scss', [ 'build-css' ] );
  gulp.watch( assetsDev + 'img/*', [ 'build-img' ] );
} );

/*
 * Таск по умолчанию 
 */
gulp.task( 'default', [ 'watch', 'build-ts', 'build-css' ] );