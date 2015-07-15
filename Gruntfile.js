( function() {

  "use strict";

  module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig( {

      pkg: grunt.file.readJSON( "package.json" ),

      execute: {
        target: {
          options: {
            args: []
          },
          src: [ "build.js" ]
        }
      },

      banner: "/* Author: uxisready.com , <%= grunt.template.today(\"yyyy\") %> */\n",

      stylus: {
        compile: {
          options: {
            compress: true,
           // banner: "<%= banner =%>",
            // paths: ["path/to/import", "another/to/import"],
            urlfunc: "embedurl", // use embedurl("test.png") in our code to trigger Data URI embedding
            use: [],
            import: [ //  @import "foo", "bar/moo", etc. into every .styl file
              // "stylus/", //  that is compiled. These might be findable based on values you gave
              //            "_mixins"    //  to `paths`, or a plugin you added under `use`
            ]
          },
          files: {

            "src/tmp/css/style.css"          : "src/stylus/style.styl",
            "src/tmp/css/style-noscript.css" : "src/stylus/style-noscript.styl",

            "src/tmp/css/style-wide.css"     : "src/stylus/style-wide.styl",
            "src/tmp/css/style-normal.css"   : "src/stylus/style-normal.styl",
            "src/tmp/css/style-narrow.css"   : "src/stylus/style-narrow.styl",
            "src/tmp/css/style-narrower.css" : "src/stylus/style-narrower.styl",
            "src/tmp/css/style-mobile.css"   : "src/stylus/style-mobile.styl",

            "src/tmp/css/print.css"          : "src/stylus/print.styl",
            "src/tmp/css/screen.css"         : "src/stylus/screen.styl",

            "src/tmp/css/style-ie.css"       : "src/stylus/style-ie.styl",
            "src/tmp/css/ie/v8.css"          : "src/stylus/ie/v8.styl",
            "src/tmp/css/ie/v9.css"          : "src/stylus/ie/v9.styl"

            //"path/to/another.css": ["path/to/sources/*.styl", "path/to/more/*.styl"] // compile and concat into single file
          }
        }
      },

      jsbeautifier: {
        files: [ "src/*.js", "*.json", "src/css/*.css" ],
        options: {
          js: {
            braceStyle: "end-expand",
            indentSize: 2,
            preserveNewlines: true,
            maxPreserveNewlines: 10,
            jslintHappy: false,
            spaceInParen: true,
            goodStuff: true
          }
        }
      },

      eslint: { // task
        options: {
          config: "eslint.json" // custom config
        },
        target: [ "*.js" ] // array of files
      },

      jscs: { // task
        src: "src/tmp/js/*.js",
        options: {
          config: "build/jscs.json",
          validateQuoteMarks: "\x22"
        }
      },

      copy: {
        main: {
          files: [
            { expand: true,  cwd: "src/tmp/concat",  src: "<%= pkg.name %>.js",  dest: "../x92studios.github.io/" },
            { expand: true,  cwd: "src/tmp/",  src: ["*.html","css/**"],  dest: "../x92studios.github.io/" },
            { expand: true,  cwd: "src/",      src: ["fonts/**", "images/**", "css/**", "*.ico" ],  dest: "../x92studios.github.io/" }
          ]
        }
      },

      concat: {
        options: {
          // define a string to put between each file in the concatenated output
          separator: "\n;" + Array(80).join("/") + "\n\n"
        },
        deploy: {
          files: {
            "src/tmp/concat/<%= pkg.name %>.js": ["src/js/libs/jquery.bundle.min.js", "src/js/libs/skel.min.js",  "src/js/libs/skel-layers.min.js", "src/js/init.js",  "src/js/index.js"]
           },
          nonull:true
        }
      },

      cssmin: {
        css:{
          src: "src/tmp/**.css",
          dest: "src/tmp/<%= pkg.name %>.min.css"
        }
      },

      uglify: {
        options: {
          banner: "/*! <%= pkg.name %> (<%= pkg.version %>) <%= grunt.template.today(\"dd-mm-yyyy\") %> */\n"
        },
        dist: {
          files: {
            "src/tmp/<%= pkg.name %>.min.js": "src/tmp/concat/<%= pkg.name %>.js"
          }
        }
      },

      svg2png: {
        all: {
          files: [
            { cwd: "src/images/", src: ["**/*.svg"], dest: "src/images/png/" }
          ]
        }
      },

      clean: {
        cleantmp: ["src/tmp/"]
      },

      watch: {
        files: [ "src/**/*" ],
        tasks: [ "quick" ]
      }

    } );

    grunt.loadNpmTasks( "grunt-execute" );
    grunt.loadNpmTasks( "grunt-eslint" );
    grunt.loadNpmTasks( "grunt-jscs-checker" );
    grunt.loadNpmTasks( "grunt-mkdir" );
    grunt.loadNpmTasks( "grunt-jsbeautifier" );
    grunt.loadNpmTasks( "grunt-contrib-stylus" );
    grunt.loadNpmTasks( "grunt-contrib-copy" );
    grunt.loadNpmTasks( "grunt-contrib-watch" );
    grunt.loadNpmTasks( "grunt-contrib-concat" );
    grunt.loadNpmTasks( "grunt-contrib-uglify" );
    grunt.loadNpmTasks( "grunt-contrib-cssmin" );
    grunt.loadNpmTasks( "grunt-contrib-clean" );
    grunt.loadNpmTasks( "grunt-svg2png" );
    grunt.loadNpmTasks( "grunt-newer" );

    // Default task(s).
    grunt.registerTask( "full"     , [ "clean", "generate", "lint" , "minimize" , "copy"] );

    grunt.registerTask( "default"  , [ "tidy", "generate", "lint" , "minimize" , "copy"] );

    grunt.registerTask( "tidy"     , [ "clean" ] );
    grunt.registerTask( "generate" , [ "newer:stylus", "svg2png", "execute" ] );

    grunt.registerTask( "lint"     , [ "jsbeautifier", "eslint", "jscs" ] );

    grunt.registerTask( "debug"    , [ "generate", "lint" ] );
    grunt.registerTask( "quick"    , [ "stylus", "jsbeautifier" ] );
    grunt.registerTask( "minimize" , [ "cssmin", "concat:deploy" ] );

    grunt.registerTask( "deploy"   , [ "" ] );

  };

}() );
