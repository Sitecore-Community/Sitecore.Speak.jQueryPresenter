var glob = require( "glob" );

module.exports = function ( grunt ) {

  grunt.initConfig( {
    pkg: grunt.file.readJSON( "package.json" ),
    clean: {
      nugget: [ "*.nupkg" ],
      all: [ "*.nupkg", "dist", "docs", "node_modules" ]
    },
    markdown: {
      all: {
        files: [ {
          expand: true,
          src: "md/api.md",
          dest: "md/html/",
          ext: ".html"
        } ],
        options: {
          template: "./md/template/bootstrap.jst",
          markdownOptions: {
            gfm: true
          }
        }
      }
    },
    xmlpoke: {
      nuget: {
        options: {
          replacements: [ {
            xpath: "/package/metadata/version",
            value: "<%= pkg.version %>"
          }, {
            xpath: "/package/metadata/id",
            value: "<%= pkg.nugetId %>"
          }, {
            xpath: "/package/metadata/authors",
            value: "<%= pkg.author %>"
          }, {
            xpath: "/package/metadata/description",
            value: "<%= pkg.description %>"
          }, {
            xpath: "/package/metadata/owners",
            value: "<%= pkg.author %>"
          } ]
        },
        files: {
          "Package.nuspec": "nuget.xml"
        }
      }
    },
    shell: {
      test: {
        command: "npm test",
        options: {
          async: false
        }
      }
    },
    uglify: {
      structure: {
        files: {
          "./dist/<%= pkg.name.replace(/js$/i, '') %>.min.js": [ "./dist/<%= pkg.name.replace(/js$/i, '') %>.js" ]
        }
      }
    },
    browserify: {
      dist: {
        src: [ "./src/index.js" ],
        dest: "./dist/<%= pkg.name.replace(/js$/i, '') %>.js",
        options: {
          standalone: "_sc",
          ignore: [ "loaderJS" ]
        }
      }
    },
    jshint: {
      all: [ "Gruntfile.js", "./src/**/*.js", "./test/**/*.js" ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        quotmark: "double",
        noarg: true,
        forin: true,
        newcap: true,
        sub: true,
        undef: false,
        boss: true,
        strict: false,
        unused: false,
        eqnull: true,
        node: true,
        browser: true,
        expr: "warn"
      }
    },
    watch: {
      src: {
        files: [ "*.js", "*.json", "./test/*.js", "./testClient/**/*.js", "./testClient/**/*.html", "./src/**/*.js" ],
        tasks: [ "build", "test", "todos" ],
        options: {
          livereload: true
        }
      }
    },
    yuidoc: {
      schemajs: {
        name: "<%= pkg.name.replace(/js$/i, '') %>",
        description: "<%= pkg.description %>",
        version: "<%= pkg.version %>",
        url: "<%= pkg.url %>",
        options: {
          paths: "src/",
          outdir: "docs/",
          themedir: "node_modules/yuidoc-bootstrap-theme/",
          helpers: [ "node_modules/yuidoc-bootstrap-theme/helpers/helpers.js" ]
        }
      }
    },
    todos: {
      src: {
        options: {
          verbose: false
        },
        src: [ "src/**/*.js" ]
      }
    },
    concat: {
      dist: {
        src: [
          "md/index.md",
          "md/events.md",
          "md/component.md",
          "md/property.md",
          "md/pagecode.md",
          "md/presenter.md",
          "md/plugin.md",
          "md/bindable.md",
          "md/pipeline.md"
        ],
        dest: "md/api.md",
      }
    }
  } );

  grunt.loadNpmTasks( "grunt-browserify" );
  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-shell-spawn" );
  grunt.loadNpmTasks( "grunt-contrib-uglify" );
  grunt.loadNpmTasks( "grunt-contrib-yuidoc" );
  grunt.loadNpmTasks( "grunt-xmlpoke" );
  grunt.loadNpmTasks( "grunt-contrib-clean" );
  grunt.loadNpmTasks( "grunt-todos" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );
  grunt.loadNpmTasks( "grunt-markdown" );
  grunt.loadNpmTasks( "grunt-contrib-concat" );

  grunt.registerTask( "clientTest", "Running mocha js for all the deps", function () {

    var files = glob.sync( "testClient/**/runner.html" );

    var count = 0;
    files.forEach( function ( file ) {
      var property = "shell.testcl" + count + ".command";
      grunt.config( property, "mocha-phantomjs " + file );
      grunt.config( "shell.testcl" + count + ".options", {
        async: false
      } );

      count++;
    } );
    for ( var i = 0; i < count; i++ ) {
      console.log( "Runnit test for " + files[ i ] );
      grunt.task.run( "shell:testcl" + i );
    }
  } );

  grunt.registerTask( "prependPackageVersionToDist", "Prepend the PackageVersion to the dist files", function () {

    var fs = require( "fs" ),
      dataPath = __dirname + "/dist/jQueryPresenter.js",
      dataMinPath = __dirname + "/dist/jQueryPresenter.min.js",
      header = "";

    header += "/**!\n";
    header += " *\n";
    header += " * jQueryPresenter\n";
    header += " *\n";
    header += " * Built: " + new Date() + "\n";
    header += " * PackageVersion: " + grunt.config( "pkg" ).version + "\n";
    header += " *\n";
    header += " */\n\n";

    fs.writeFileSync( dataPath, header + fs.readFileSync( dataPath ) );
    fs.writeFileSync( dataMinPath, header + fs.readFileSync( dataMinPath ) );

  } );

  grunt.registerTask( "default", [ "build", "test", "minify", "prependPackageVersionToDist" ] );
  grunt.registerTask( "test", [ "clientTest" ] );
  grunt.registerTask( "md", [ "concat", "markdown:all" ] );
  grunt.registerTask( "build", [ "browserify:dist", "jshint" ] );
  grunt.registerTask( "minify", [ "uglify:structure" ] );
  grunt.registerTask( "docs", [ "yuidoc:schemajs" ] );
  grunt.registerTask( "publish", [ "shell:nupack", "shell:nupublish" ] );
  grunt.registerTask( "xml", [ "xmlpoke:nuget" ] );

  grunt.registerTask( "start", function () {
    grunt.util.spawn( {
      cmd: "node",
      args: [ "docs.js" ]
    } );
    grunt.task.run( "watch" );
  } );
};
