import gulp from 'gulp';
import replace from 'gulp-replace';
import fs from 'fs';
import cleancss from 'gulp-clean-css';
import rename from 'gulp-rename';

// Customize which modules to load here
const cssModules = [
  '_normalize',
  '_box-sizing',
  '_outlines',
  '_borders',
  '_border-colors',
  '_border-radius',
  '_border-style',
  '_border-widths',
  '_box-shadow',
  '_code',
  '_coordinates',
  '_clears',
  '_display',
  '_flexbox',
  '_floats',
  '_font-style',
  '_font-weight',
  '_forms',
  '_heights',
  '_letter-spacing',
  '_line-height',
  '_links',
  '_lists',
  '_max-widths',
  '_widths',
  '_overflow',
  '_position',
  '_opacity',
  '_skins-pseudo',
  '_skins',
  '_spacing',
  '_text-decoration',
  '_text-align',
  '_text-transform',
  '_type-scale',
  '_typography',
  '_utilities',
  '_white-space',
  '_hovers',
  '_z-index'
];

// Remove --ns and -l media queries and export to `amp-src` directory
export function removeExtraMediaQueries() {
  let paths = [];
  for (let a = 0; a < cssModules.length; a++) {
    paths.push(`src/${cssModules[a]}.css`);
  }
  return gulp.src(paths)
    .pipe(replace(/@media \(--breakpoint-not-small[\s\S]*?\n}/g, ''))
    .pipe(replace(/@media \(--breakpoint-medium[\s\S]*?\n}/g, ''))
    .pipe(gulp.dest('amp-src'));
}

// Transform --m media query to be `max-width: 45m`
export function generateMediaQueryCss() {
  let mediumMediaQuery = '@custom-media --breakpoint-large screen and (min-width: 45em);\n';
  return new Promise((resolve, reject) => {
    fs.writeFile('amp-src/_media-queries.css', mediumMediaQuery, (err) => {
      if (err) { reject(err); } else { resolve(); }
    });
  });
}

// Create tachyons-amp.css
export function generateModuleLoader() {
  let data = '';
  for (let a = 0; a < cssModules.length; a++) {
    data += "@import './" + cssModules[a] + "';\n";
  }
  data += "@import './_colors';\n@import './_media-queries';\n";
  return new Promise((resolve, reject) => {
    fs.writeFile('amp-src/tachyons-amp.css', data, (err) => {
      if (err) { reject(err); } else { resolve(); }
    });
  });
}

// Build from `amp-src` directory into `amp-build` directory
export function buildAmpCss() {
  const { exec } = require('child_process');
  const cmd = 'tachyons amp-src/tachyons-amp.css > amp-build/tachyons-amp.css';
  return new Promise((resolve, reject) => {
    exec(cmd, (err) => {
      if (err) { reject(err); } else { resolve(); }
    })
  });
}

// Minify the build
export function minifyBuild() {
  return gulp.src('amp-build/tachyons-amp.css')
    .pipe(cleancss({
      level: {
        1: {
          all: true,
          specialComments: 'none'
        }
      }
    }))
    .pipe(rename('tachyons-amp.min.css'))
    .pipe(gulp.dest('amp-build'));
}

// Validate the build
export function validate() {
  return new Promise(resolve => {
    let data = fs.readFileSync('amp-build/tachyons-amp.min.css');
    // Total size should not exceed 50kb
    console.log('Test #1 passed:', data.length <= 50000);
    // Contents should not contain `!important`, 'behavior' and '-moz-binding'
    console.log('Test #2 passed:', !/\!important|behavior|-moz-binding/.test(data));
    resolve();
  });
}

const build = gulp.series(removeExtraMediaQueries, generateMediaQueryCss, generateModuleLoader, buildAmpCss, minifyBuild, validate);
export default build;
