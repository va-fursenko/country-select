process.env.DISABLE_NOTIFIER = true;

let elixir = require('laravel-elixir');

require("laravel-elixir-webpack-official");
require('laravel-elixir-vue');

elixir.config.sourcemaps = true;

let
    srcPath = './src',
    distPath = './dist';

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
            srcPath + '/**/*.js',
            srcPath + '/**/*.vue'
        ],
        distPath + '/vue-country-select.js'
    );

    // Copy flags images to dist
    mix.copy(
        [
            srcPath + '/img/**'
        ],
        distPath + '/img'
    );
});