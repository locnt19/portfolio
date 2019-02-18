import { src, dest, watch, parallel, series, lastRun } from "gulp"
import sass from 'gulp-sass'
import pug from 'gulp-pug'
import concat from 'gulp-concat'
import sourcemap from 'gulp-sourcemaps'
import clean from 'gulp-clean'
import postcss from 'gulp-postcss'
import autoprefixer from 'autoprefixer'
import fiber from 'fibers'
import debug from 'gulp-debug'
import fs from 'graceful-fs'
import minifierCSS from 'gulp-clean-css'
import minifierJS from 'gulp-uglify-es'
import browserSync from 'browser-sync'
import yargs from 'yargs'
import gulpif from 'gulp-if'
import rename from 'gulp-rename'
import replace from 'gulp-replace'
import plumber from 'gulp-plumber'

const argv = yargs.argv;
const Prod = !!argv.production;
const ccUrl = JSON.parse(fs.readFileSync('./concat.json'))


export const watchCode = () => {
    watch(['./lib/**/*.sass', './lib/*.sass'], series(styles));
    watch(['./lib/**/*.pug', './templates/*.pug', './templates/**/*.pug'], series(templates));
    watch(['./img/**/*.{svg,gif,png,jpg,jpeg}', './img/*.{svg,gif,png,jpg,jpeg}'], series(images));
    watch(['./lib/**/*.js', './scripts/*.js', './scripts/**/*.js'], series(scripts));
    watch(['./fonts/**/*.{eot,svg,ttf,woff,woff2}', './fonts/*.{eot,svg,ttf,woff,woff2}'], series(fonts));
    watch(['./concat.json'], parallel(cssCore, jsCore));
    watch(['./fonts/**/*.{eot,svg,ttf,woff,woff2}', './fonts/*.{eot,svg,ttf,woff,woff2}'], series(fonts));
    // watch('./dist').on('change', browserSync.reload)
}

export const server = () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            routes: {
                '/node_modules': 'node_modules'
            }
        },
        port: 2400,
        notify: false
    });
};


export const cleanFiles = () => src('./dist', { read: false, allowEmpty: true })
    .pipe(clean())
    .pipe(debug({
        "title": "Cleaning ",
        'showFiles': false
    }));
// merge css
export const cssCore = () => src(ccUrl.styles)
    .pipe(concat('core.min.css'))
    .pipe(minifierCSS())
    .pipe(debug({
        "title": "CSS Core",
        'showFiles': false
    }))
    .pipe(dest('./dist/css/'));

export const jsCore = () => src(ccUrl.scripts)
    .pipe(concat('core.min.js'))
    .pipe(minifierJS())
    .pipe(debug({
        "title": "JS Core",
        'showFiles': false
    }))
    .pipe(dest('./dist/js/'));

export const styles = () => src('./lib/*.sass')
    .pipe(plumber())
    .pipe(gulpif(!Prod, sourcemap.init({ loadMaps: true })))
    .pipe(sass({
        fiber: fiber,
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
    })).on('error', sass.logError)
    .pipe(gulpif(Prod, postcss([autoprefixer({
        browsers: ['last 4 version', "IE 10"],
        cascade: false,
    })])))
    .pipe(gulpif(Prod, minifierCSS()))
    .pipe(gulpif(Prod, rename({
        suffix: ".min"
    })))
    .pipe(plumber.stop())
    .pipe(gulpif(!Prod, sourcemap.write()))
    .pipe(dest('./dist/css'))
    .pipe(debug({
        "title": "CSS files"
    }))
    .on("end", browserSync.reload)



export const scripts = () => src([
        './scripts/*.js',
        './lib/*.js',
        './lib/**/*.js',
        '!./scripts/{**/\_*,**/\_*/**}.js'
    ])
    .pipe(gulpif(!Prod, sourcemap.init({ loadMaps: true })))
    .pipe(concat("main.js"))
    .pipe(gulpif(Prod, minifierJS()))
    .pipe(gulpif(Prod, rename({
        suffix: ".min"
    })))
    .pipe(gulpif(!Prod, sourcemap.write()))
    .pipe(dest('./dist/js/'))
    .pipe(debug({
        "title": "JS files"
    }))
    .on("end", browserSync.reload);



export const templates = () => src([
        './templates/**/*.pug',
        './templates/*.pug',
        '!./templates/{**/\_*,**/\_*/**}.pug'
    ])
    .pipe(pug({ pretty: true }))
    .pipe(gulpif(Prod, replace("main.css", "main.min.css")))
    .pipe(gulpif(Prod, replace("main.js", "main.min.js")))
    .pipe(dest('./dist'))
    .on("end", browserSync.reload);

export const images = () => src(['./img/**/*.{svg,gif,png,jpg,jpeg}', './img/*.{svg,gif,png,jpg,jpeg}'])
    .pipe(dest('./dist/img'))
    .pipe(debug({
        "title": "Images files"
    }))
    .on("end", browserSync.reload);



export const fonts = () => src(['./fonts/**/*.{eot,svg,ttf,woff,woff2,otf}', './fonts/*.{eot,svg,ttf,woff,woff2,otf}'])
    .pipe(dest('./dist/fonts'))
    .pipe(debug({
        "title": "Fonts files"
    }))
    .on("end", browserSync.reload);



export const development = series(cleanFiles, parallel(templates, styles, scripts, images, fonts, cssCore, jsCore), parallel(watchCode, server))

export const prod = series(cleanFiles, templates, styles, scripts, images, fonts, cssCore, jsCore)

export default development