process.env.DISABLE_NOTIFIER = true;

let elixir = require('laravel-elixir');

require("laravel-elixir-webpack-official");
require('laravel-elixir-vue');

elixir.config.sourcemaps = true;

let
    srcPath = './src',
    examplePath = './example',
    npmPath = './node_modules';

/**
 * Run elixir
 */
elixir(function(mix) {

    /*
     * Pack component
     */

    // Pack component to js file
    mix.webpack(
        [
            srcPath + '/**/**/*.js',
            srcPath + '/**/**/*.vue',
            examplePath + '/example.js',
        ],
        examplePath + '/assets/js/app.js'
    );

    // Copy flags images to dist
    mix.copy(
        [
            srcPath + '/img/**'
        ],
        examplePath + '/assets/img'
    );

    // Pack specified libs to lib.js
    mix.scripts(
        [
            npmPath + '/vue/dist/vue.js'
        ],
        examplePath + '/assets/js/lib.js'
    );
});