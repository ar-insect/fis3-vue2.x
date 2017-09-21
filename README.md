## 简介

一个使用fis3+vue2.x整合的spa脚手架

### 编译说明

官方vue-cli使用webpack+loader这样的组合，fis3本身是不包含模块化加载工具的，所以这里使用`fis3-hook-commonjs`作为模块化打包工具，`mod.js`作为模块化加载，然后es6还是用`fis3-babel-6.x`进行编译，使之平稳过渡到es5，包括加入es6垫片`polyfill`以及`transform-runtime`等插件。

注意：像在webpack里面需要排除掉node_modules那样，对于node_modules中的模块是不能开启polyfill和helpers否则编译会报错，这个在fis-conf已经配置好了。

### 代码质量

增加eslint代码验证工具，分为2个层面：

1.代码编写，推荐使用`vscode`编辑器，配置vue文件的代码检测：文件 -> 首选项 -> 设置 增加如下配置

        "eslint.validate": [
            "javascript",
            "vue"
        ]

这样就支持vue文件中js代码块的语法验证了

2.代码编译

在fis编译期间也会对项目代码进行扫描检验，对于不合格的代码会提示warn或者error

TODO：需要对vue文件中的js部分增加eslint

### 目录结构

    | - front 客户端
        | - app 
        | - component 公共组件，这部分可以单独迁出业务项目（视情况而定）编译打包
        | - static 静态资源，包含非模块化的js
        | - widget 项目模块组件
        | - ...

    | - 服务器端
        | - config 配置
        | - dist 编译打包后的静态资源
        | - ...

### 代理层

使用node层作为中间层转发可以起到承上启下的作用，可以向后端发送请求将数据回传到客户端，当然还可以避免跨域等问题，如果没有过多需求也可以使用Nginx来做代理，代理配置修改serv/config/index.js里面的`dev.proxyTable`字段。

## 使用

### 开发环境

    cd front
    
    npm i # 初始化执行
    
    sh dev.sh # 编译

    cd serv
    
    npm i # 初始化执行
    
    npm run dev # 启动server调试

### 生产环境

使用Jenkins作为自动化发布，执行front/prod.sh产出生产环境代码然后提交到服务器端

其他相关问题欢迎加入qq群:162605336交流
