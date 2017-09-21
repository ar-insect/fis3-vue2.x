
var domain = fis.config.get('domain');
var eslintConfig = require('./eslint.js');

var config = {
    release: {
        assets: '/dist/assets/',
        app: '/dist/',
        base: 'pkg/base_pkg.js',
        pkg: 'pkg/app_pkg.js',
    },
    idMaps: [{
        reg: /^\/app\/((?:[^\/]+\/)*)([^\/]+)\/\2\..*$/i,
        id: 'app/$1$2',
    }, {
        reg: /^\/app\/(.*)\..*$/i,
        id: 'app/$1',
    }, {
        reg: /^\/widget\/((?:[^\/]+\/)*)([^\/]+)\/\2\..*$/i,
        id: '$1$2',
    }, {
        reg: /^\/widget\/(.*)\..*$/i,
        id: '$1',
    }],
};

// 此处加上npm和commonjs两个hook来处理不同类型的模块
fis.hook('npm');
fis.hook('commonjs');

fis.match('::packager', {
    postpackager: fis.plugin('loader', {
        allInOne: false,
        resourceType: 'auto',
        processor: {
            '.html': 'html',
        },
        useInlineMap: true,
    }),
});
// 默认发布路径
fis.match('**/*', {
    release: config.release.assets + '$0',
    domain: domain,
    url: '/assets$0',
});
// 排除不需要发布的资源
fis.match('doc/**', {
    release: false,
});
fis.match('**.{sh,md}', {
    release: false,
});
// 命中`Html`
fis.match(/^\/(app)\/(.*\.html)$/i, {
    parser: fis.plugin('html-replaceurl', {
        newWords: {
            __host__: domain,
        },
    }),
    rExt: '.html',
    release: config.release.app + '$2',
});
// 命中`Sass`
fis.match('*.scss', {
    rExt: '.css',
    parser: [
        fis.plugin('node-sass'),
        fis.plugin('bem-replace', {
            rules: config.idMaps,
        }),
    ],
    postprocessor: fis.plugin('autoprefixer', {
        // detail config (https://github.com/postcss/autoprefixer#browsers)
        'browsers': ['Android >= 2.3', 'ChromeAndroid > 1%', 'iOS >= 4'],
        'cascade': true,
    }),
});
// 定义js模块id
fis.match(/^\/app\/(.*)\.js$/i, {
    id: 'app/$1',
});
// example: `/widget/common/common.js`
// id: `widget/common/common`
fis.match(/^\/widget\/(.*)\.js$/i, {
    id: 'widget/$1',
});
fis.match(/^\/component\/(.*)\.js$/i, {
    id: 'component/$1',
});
// node_modules
fis.match('node_modules/**.js', {
    isMod: true,
    useMap: true,
    parser: fis.plugin('babel-6.x'), // 这里不加配置只对es6的基础语法做转换，注意这里不能加es6垫片
});

fis.match('{app,widget,component}/**.js', {
    isMod: true,
    useMap: true,
    useSameNameRequire: true,
    lint: fis.plugin('eslint', eslintConfig),
    preprocessor: fis.plugin('js-require-css'),
    parser: [
        fis.plugin('bem-replace', {
            rules: config.idMaps,
        }),
        fis.plugin('html-replaceurl', {
            newWords: {
                __host__: domain,
            },
        }),
        // https://github.com/fex-team/fis-parser-babel-6.x
        fis.plugin('babel-6.x', {
            sourceMaps: true,
            presets: [
                'es2015',
                'stage-2',
            ],
            'env': {
                'test': {
                    'presets': ['env', 'stage-2'],
                    'plugins': ['istanbul'],
                },
            },
            plugins: [
                [
                    'transform-runtime',
                    {
                        'helpers': true,
                        'polyfill': true,
                        'regenerator': true,
                    },
                ],
            ],
        }),
    ],
});
// 编译vue组件
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
                __host__: domain,
            },
        }),
    ],
});
// 编译vue组件中的sass
fis.match('*.vue:scss', {
    rExt: 'css',
    parser: [
        fis.plugin('node-sass', {
            sourceMap: true,
        }),
        fis.plugin('bem-replace', {
            rules: config.idMaps,
        }),
    ],
    postprocessor: fis.plugin('autoprefixer', {
        // detail config (https://github.com/postcss/autoprefixer#browsers)
        'browsers': ['Android >= 2.3', 'ChromeAndroid > 1%', 'iOS >= 4'],
        'cascade': true,
    }),
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
                'stage-2',
            ],
            'env': {
                'test': {
                    'presets': ['env', 'stage-2'],
                    'plugins': ['istanbul'],
                },
            },
            plugins: [
                [
                    'transform-runtime',
                    {
                        'helpers': true,
                        'polyfill': true,
                        'regenerator': true,
                    },
                ],
            ],
        }),
    ],
});

// 以下为发布生产配置
fis.media('publish').match('::package', {
    spriter: fis.plugin('csssprites'),
    postpackager: fis.plugin('loader', {
        allInOne: true,
        ignore: ['static/require.js'],
        resourceType: 'auto',
        processor: {
            '.html': 'html',
        },
        useInlineMap: false,
    }),
}).match('*.js', {
    optimizer: fis.plugin('uglify-js', {
        mangle: {
            except: 'exports, module, require, define', //export, module, require不压缩变量名
        },
        compress: {
            drop_console: true, //自动去除console.log等调试信息
        },
    }),
}).match('**/*', {
    domain: domain,
}).match('*.{css,scss}', {
    useSprite: true,
    optimizer: fis.plugin('clean-css', {
        keepSpecialComments: 0,
    }),
}).match('*.{png}', {
    optimizer: fis.plugin('png-compressor'),
}).match('*.{js,css,scss,png,jpg,gif}', {
    useHash: true,
}).match('static/mod.js', {
    packTo: config.release.pkg,
    packOrder: -100,
}).match('node_modules/**.js', {
    packTo: config.release.pkg,
    packOrder: -99,
}).match('widget/**.{js,vue}', {
    packTo: config.release.pkg,
    packOrder: -98,
}).match('app/**.{js,vue}', {
    packTo: config.release.pkg,
    packOrder: -97,
});
