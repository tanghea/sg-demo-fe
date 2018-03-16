var models = require('./models.json'),
    basepath = process.cwd(),
    path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    _ = require('lodash');
var srcPath = path.resolve(basepath,  "./src");
var iuapversion = "3.1.23";
var entrys = _.mapValues(models, function(value,key) {
    return srcPath+"/pages/"+key+'/index.js';
});
entrys["vendor"] = ["lodash","knockout","ko-epui", "components","common","eventemitter2"]
var htmlPlugin = function (language) {
    return _.map(models, function(value,key) {
        return new HtmlWebpackPlugin({
            title: value,
            //生成模板地址
            template: './src/pages/'+key+'/index.ejs',
            filename: key+'/index.html',
            //chunks这个参数告诉插件要引用entry里面的哪几个入口
            chunks: ['mainfest', 'vendor', key],
            //要把script插入到标签里
            inject: 'body',
            hash: true,
            minify:{    //压缩HTML文件
                collapseWhitespace:true    //删除空白符与换行符
            },
            "files": {
                "css": [].concat([
                    "../static/font-awesome-4.5.0/css/font-awesome.min.css",
                    //iuap
                    "../static/iuap-design-"+iuapversion+"/css/u.min.css",
                    "../static/iuap-design-"+iuapversion+"/css/grid.min.css",
                    "../static/css/base.css",
                    "../static/iuap-design-"+iuapversion+"/css/tree.css"
                ]),
                "js": [
                    //jquery
                    "../static/js/jquery-2.1.1.js",
                    "../static/js/knockout/knockout-3.4.0.min.js",
                    "../static/iuap-design-"+iuapversion+"/js/u.js",
                    "../static/iuap-design-"+iuapversion+"/js/u-grid.js",
                    "../static/iuap-design-"+iuapversion+"/js/u-tree.js",
                    "../static/jquery.metismenu.js",
                    "../static/file/jquery.cookie.js",
                    "../static/file/ajaxfileupload.js",
                    "../static/file/interface.file.js",
                    "../static/file/interface.file.impl.js",
                    "../static/js/loading/jquery.mloading.js"
                ]
            }
        })
    });
}
module.exports ={
    entry: entrys,
    dev: function (language) {
        return [].concat(htmlPlugin(language))
          .concat(
            //将公共代码抽离出来合并为一个文件
            new webpack.optimize.CommonsChunkPlugin({
              name: "vendor"
            })
          ).concat(
            new webpack.DefinePlugin({DEV: JSON.stringify(true)})
          )
          // .concat(new webpack.optimize.CommonsChunkPlugin({
          //   name: 'mainfest',
          //   chunks: ['vendor']
          // }))
    },
    prod: function (language) {
      return [].concat(htmlPlugin(language)
        .concat(
          //将公共代码抽离出来合并为一个文件
          new webpack.optimize.CommonsChunkPlugin({
            name: "vendor"
          })
        )
        .concat(
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false
            }
          })
        ).concat(
            new webpack.DefinePlugin({DEV: JSON.stringify(false)})
        )
      )
      // .concat(new webpack.optimize.CommonsChunkPlugin({
      //     name: 'mainfest',
      //     chunks: ['vendor']
      //   }))
    }
}
