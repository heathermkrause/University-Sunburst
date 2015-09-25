module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.initConfig({

        clean : {
          dist : ['dist']
        },

        copy: {
            dist : {
                options : {
                    process : function(content, srcpath){
                        if(srcpath == 'index.html'){
                            content = content
                                .replace('libs/requirejs/', '')
                                .replace('app/app', 'app')
                                .replace('<link rel="stylesheet/less" type="text/css" href="less/app.less"/>', '<link rel="stylesheet" type="text/css" href="app.css"/>')
                                .replace('<script src="libs/less/dist/less.js"></script>', '');
                        }

                        return content;
                    }
                },

                files : [
                    {
                        src : 'index.html',
                        dest : './dist/index.html',
                    },
                    {src : 'libs/requirejs/require.js', dest : 'dist/require.js'}
                ]
            }
        },

        requirejs : {
            compile : {
                options : {
                    baseUrl : './app',
                    out : 'dist/app.js',
                    name : 'app',
                    mainConfigFile : 'app/app.js',
                    wrap : true
                }
            }
        },

        less : {
            dist : {
                files : {
                    'dist/app.css' : 'less/app.less'
                }
            }
        },

        karma : {
            daemon :{
                configFile : 'karma.conf.js',
                background: true
            },

            unit : {
                configFile: 'karma.conf.js',
                singleRun : true
            }
        },

        watch: {
        }
    });

    grunt.registerTask('watch-changes', ['copy:js', 'watch:js']);
    grunt.registerTask('dist', ['clean:dist', 'requirejs:compile', 'less:dist', 'copy:dist']);
}