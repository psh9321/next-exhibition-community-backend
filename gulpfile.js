"use strict"

const gulp = require("gulp");
const uglify = require("gulp-uglify");
const insert = require("gulp-insert");
 
/** 폴더 */
const DIR = {
    PUBLIC : "src",
    DEST : "src_dist"
}

const PUBLIC = {
    MODEL : `${DIR["PUBLIC"]}/model/*.js`,
    API : `${DIR["PUBLIC"]}/api/*.js`,
    ROUTER : `${DIR["PUBLIC"]}/router/*.js`,
    UTIL : `${DIR["PUBLIC"]}/util/*.js`,
    MIDDLEWARE : `${DIR["PUBLIC"]}/middleware/*.js`,
}

const PUBLIC_DEST = {
    MODEL : `${DIR["DEST"]}/model`,
    API : `${DIR["DEST"]}/api`,
    ROUTER : `${DIR["DEST"]}/router`,
    UTIL : `${DIR["DEST"]}/util`,
    MIDDLEWARE : `${DIR["DEST"]}/middleware`,
}

function getCurrentTime() {
    const options = { timeZone: 'Asia/Seoul', locale: 'ko-KR' };
    return new Date().toLocaleString('ko-KR', options);
}

gulp.task("model", () => {
    return gulp.src(PUBLIC["MODEL"])
    // .pipe(uglify())
    .pipe(insert.append(`// build date : ${getCurrentTime()}`))
    .pipe(gulp.dest(PUBLIC_DEST["MODEL"]))
});

gulp.task("api", () => {
    return gulp.src(PUBLIC["API"])
    .pipe(uglify())
    .pipe(insert.append(`// build date : ${getCurrentTime()}`))
    .pipe(gulp.dest(PUBLIC_DEST["API"]))
});

gulp.task("router", () => {
    return gulp.src(PUBLIC["ROUTER"])
    .pipe(uglify())
    .pipe(insert.append(`// build date : ${getCurrentTime()}`))
    .pipe(gulp.dest(PUBLIC_DEST["ROUTER"]))
});

gulp.task("util", () => {
    return gulp.src(PUBLIC["UTIL"])
    .pipe(uglify())
    .pipe(insert.append(`// build date : ${getCurrentTime()}`))
    .pipe(gulp.dest(PUBLIC_DEST["UTIL"]))
});

gulp.task("middleware", () => {
    return gulp.src(PUBLIC["MIDDLEWARE"])
    .pipe(uglify())
    .pipe(insert.append(`// build date : ${getCurrentTime()}`))
    .pipe(gulp.dest(PUBLIC_DEST["MIDDLEWARE"]))
});


gulp.task("dev", gulp.parallel(["model","api", "router", "util", "middleware"]), () => {
  return console.log("gulp...")
})