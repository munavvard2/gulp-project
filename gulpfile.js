const { src, dest, watch, parallel, series } = require("gulp");
const sass = require('gulp-sass')(require('sass'));

function myTask(callBack){
    callBack();
}


function copy(cb){
    src('routes/*.js')
        .pipe(dest('copies'));
    cb();
}

function generateCSS(cb){
    src('./sass/**/*.scss')
        .pipe(sass().on('error',sass.logError))
        .pipe(dest('public/stylesheets'))
        .pipe(sync.stream());
    cb();
}

const ejs = require("gulp-ejs");
const rename = require("gulp-rename");


function generateHTML(cb) {
    src("./views/index.ejs")
        .pipe(ejs({
            title: "Hello World",
        }))
        .pipe(rename({
            extname: ".html"
        }))
        .pipe(dest("public"));
    cb();
}


const eslint = require("gulp-eslint");

function runLinter(cb) {
    return src(['**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format()) 
        .pipe(eslint.failAfterError())
        .on('end', function() {
            cb();
        });
}


const mocha = require('gulp-mocha');
let runTests = (cb)=>{
    return src(['**/*.test.js'])
        .pipe(mocha())
        .on('error',()=>{
            cb(new Error('Tests Failed'));
        })
        .on('end',()=>{
            cb();
        });
};


let watchFiles = (cb)=>{
    watch('views/**.ejs',generateHTML);
    watch('sass/**.scss',generateCSS);
    watch(['**/*.js','!node_modules/**'],parallel(runLinter,runTests));    
};


const sync = require('browser-sync').create();

let browserSync = (cb)=>{
    sync.init({
        server:{
            baseDir:"./public"
        }
    });

    watch('views/**.ejs',generateHTML);
    watch('sass/**.scss',generateCSS);
    watch("./public/**.html").on('change',sync.reload);
};

exports.sync     = browserSync;
exports.watch   = watchFiles;
exports.test    = runTests;
exports.lint    = runLinter;
exports.html    = generateHTML;
exports.myTask  = myTask; 
exports.copy    = copy;
exports.css     = generateCSS;
exports.default = series(runLinter,parallel(generateCSS,generateHTML),runTests);
