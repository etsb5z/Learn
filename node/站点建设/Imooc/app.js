var express = require('express')
var path = require('path')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session) //connect-mongo是用来将connect的session持久化到mongodb中的
var morgan = require('morgan') //
var port = process.env.PORT || 3000
var app = express()
var dbUrl = 'mongodb://localhost/imooc'


//连接本地数据库
mongoose.connect(dbUrl);

mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error)
})
mongoose.connection.on("open", function () {
    console.log("------数据库连接成功！------")
})

//视图文件的路径
app.set('views', './app/views/pages')

//使用的模板引擎
app.set('view engine', 'jade')

/*表单数据格式化
 *新版express已不支持app.use(express.bodyParser());
 *需要安装body-parser模块，npm install body-parser
 *然后使用代码为：app.use(require('body-parser').urlencoded({extended: true}))
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//处理每一个请求的cookie
app.use(cookieParser())

//session
app.use(session({
	secret: 'imooc',
	store: new MongoStore({
		url: dbUrl,
		collection: 'sessions'
	})
}))

//静态支援的路径
app.use(express.static(path.join(__dirname, 'public')))

//全局时间
app.locals.moment = require('moment')

//设置端口号
app.listen(port)


//设置入口文件，输出日志和错误信息
if( app.get('env') === 'development'){
	//在屏幕输出
	app.set('showStackError', true)
	//打印的nodejs 服务器接受到的请求的信息
	app.use(morgan('dev'))
	//格式化源代码
	app.locals.pretty = true
	//打开 mongo debug
	mongoose.set('debug', true)
}



//导出路由模块
require('./config/router')(app)

//打印当前服务端口
console.log('imooc started on port ' + port)
