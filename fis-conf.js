
var config = {
    release: {
        assets: "/dist/assets/",
        app: "/dist/",
        base: "pkg/base_pkg.js",
        pkg: "pkg/app_pkg.js"
    },
    idMaps: [{
        reg: /^\/app\/((?:[^\/]+\/)*)([^\/]+)\/\2\..*$/i,
        id: 'app/$1$2'
    }, {
        reg: /^\/app\/(.*)\..*$/i,
        id: 'app/$1'
    }, {
        reg: /^\/widget\/((?:[^\/]+\/)*)([^\/]+)\/\2\..*$/i,
        id: '$1$2'
    }, {
        reg: /^\/widget\/(.*)\..*$/i,
        id: '$1'
    }]
};

var domain = fis.config.get('domain');

// used to do node_modules lookup 
fis.hook('npm');

fis.hook('commonjs');

fis.match('::packager', {
    postpackager: fis.plugin('loader', {
        allInOne: false,
        resourceType: 'auto',
        processor: {
            '.html': 'html'
        },
        useInlineMap: true
    })
});

fis.match('**/*', {
    release: config.release.assets + '$0',
    domain: domain,
    url: '/assets$0'
});
// 排除不需要发布的资源
fis.match('doc/**', {
    release: false
});
fis.match('**.{sh,md}', {
    release: false
});

// 命中`Html`
fis.match(/^\/(app)\/(.*\.html)$/i, {
    parser: fis.plugin('html-replaceurl', {
        newWords: {
            __url: domain
        }
    }),
    rExt: '.html',
    release: config.release.app + '$2'
});
// 命中`Sass`
fis.match('*.scss', {
    rExt: '.css',
    parser: [
        fis.plugin('node-sass'),
        fis.plugin('bem-replace', {
            rules: config.idMaps
    })],
    postprocessor: fis.plugin('autoprefixer', {
        // detail config (https://github.com/postcss/autoprefixer#browsers)
        "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
        "cascade": true
    })
});
// !!required node_modules
fis.match('node_modules/**.js', {
    isMod: true,
    useMap: true,
    parser: fis.plugin('babel-6.x')
});
// 定义js模块id
fis.match(/^\/app\/(.*)\.js$/i, {
    id: 'app/$1'
});
// example: `/widget/db.js`
// id: `widget/db`
fis.match(/^\/widget\/(.*)\.js$/i, {
    id: 'widget/$1'
});
fis.match(/^\/component\/(.*)\.js$/i, {
    id: 'component/$1'
});

fis.match('{app, widget, component}/**.js', {
    isMod: true,
    useMap: true,
    useSameNameRequire: true,
    preprocessor: fis.plugin('js-require-css'),
    parser: [
        fis.plugin('bem-replace', {
            rules: config.idMaps
        }),
        fis.plugin('html-replaceurl', {
            newWords: {
                __url: domain
            }
        }),
        // https://github.com/fex-team/fis-parser-babel-6.x
        fis.plugin('babel-6.x', {
            sourceMaps: true,
            // ignore: /node_modules\/(?!babel-runtime)/,
            presets: [
                'es2015',
                'stage-2'
            ],
            'env': {
                "test": {
                  "presets": ["env", "stage-2"],
                  "plugins": [ "istanbul" ]
                }
            },
            plugins: [
                ["transform-runtime",
                {
                  "helpers": true,
                  "polyfill": true,
                  "regenerator": true
                }
              ]
            ]
        })
    ]
});
// 编译vue组件/(.*\/)*([^.]+)\.vue$/
fis.match('*.vue', {
  useMap: true,
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: [
    // https://github.com/ccqgithub/fis3-parser-vue-component
    fis.plugin('vue-component', {
      runtimeOnly: true,
      styleNameJoin: '',
      extractCSS: true,
      cssScopedIdPrefix: '_v-',
      cssScopedHashType: 'sum',
      cssScopedHashLength: 8,
      cssScopedFlag: '__vuec__',
    }),
    fis.plugin('html-replaceurl', {
        newWords: {
            __url: domain
        }
    })
  ]
});
// 编译vue组件中的sass
fis.match('*.vue:scss', {
  rExt: 'css',
  parser: [
    fis.plugin('node-sass', {
        sourceMap: true
    }),
    fis.plugin('bem-replace', {
        rules: config.idMaps
    })
  ],
  postprocessor: fis.plugin('autoprefixer', {
    // detail config (https://github.com/postcss/autoprefixer#browsers)
    "browsers": ["Android >= 2.3", "ChromeAndroid > 1%", "iOS >= 4"],
    "cascade": true
  })
});
// 编译vue组件中的es6到es5
fis.match('*.vue:js', {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true,
    parser: [
        // https://github.com/fex-team/fis-parser-babel-6.x
        fis.plugin('babel-6.x', {
            presets: [
                'es2015',
                'stage-2'
            ],
            'env': {
                "test": {
                  "presets": ["env", "stage-2"],
                  "plugins": [ "istanbul" ]
                }
            },
            plugins: [
                ["transform-runtime",
                {
                  "helpers": true,
                  "polyfill": true,
                  "regenerator": true
                }
              ]
            ]
        })
    ]
});

// here goes the publish config
fis.media('publish').match('::package', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        allInOne: true,
        ignore: ['static/require.js'],
        resourceType: 'auto',
        processor: {
            '.html': 'html'
        },
        useInlineMap: false
    })
})
.match('*.js', {
    optimizer: fis.plugin('uglify-js', {
        mangle: { //export, module, require不压缩变量名
            except: 'exports, module, require, define'
        },
        compress : { //自动去除console.log等调试信息
            drop_console: true
        }
    })
}).match('**/*', {
    domain: domain,
}).match('*.{css,scss}', {
    useSprite: true,
    optimizer: fis.plugin('clean-css', {
        keepSpecialComments: 0
    })
}).match('*.{png}', {
    optimizer: fis.plugin('png-compressor')
}).match('*.{js,css,scss,png,jpg,gif}', {
    useHash: true
}).match('static/mod.js', {
    packTo: config.release.base,
    packOrder: -100
}).match('node_modules/**.js', {
    packTo: config.release.base,
    packOrder: -99
}).match('widget/**.{js,vue}', {
    packTo: config.release.base,
    packOrder: -98
}).match('app/**.{js,vue}', {
    packTo: config.release.base,
    packOrder: -97
});
