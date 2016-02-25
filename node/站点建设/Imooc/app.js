var express = require('express')
var path = require('path')
var mongoose = require('mongoose')
var _ = require('underscore')
var Movie = require('./models/movie')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var app = express()


//连接本地数据库
mongoose.connect('mongodb://localhost/imooc');

mongoose.connection.on("error", function (error) {
    console.log("数据库连接失败：" + error)
})
mongoose.connection.on("open", function () {
    console.log("------数据库连接成功！------")
})

//视图文件的路径
app.set('views', './views/pages')

//使用的模板引擎
app.set('view engine', 'jade')

/*表单数据格式化
 *新版express已不支持app.use(express.bodyParser());
 *需要安装body-parser模块，npm install body-parser
 *然后使用代码为：app.use(require('body-parser').urlencoded({extended: true}))
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

//静态支援的路径
app.use(express.static(path.join(__dirname, 'public')))

app.locals.moment = require('moment')

//设置端口号
app.listen(port)

//打印当前服务端口
console.log('imooc started on port ' + port)

//------------------路由----------------------
//模拟数据

// index page
app.get('/',function(req,res){
	Movie.fetch(function(err, movies){
		if (err){
			console.log(err)
		}

	res.render('index',{
		title: '首页',
		movies: movies
		})
	})
})

// detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err, movies){
		res.render('detail',{
			title: movies.title + '详情页',
			movie: movies
		})
	})
})




// admin page
app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: '后台录入页',
		movie:{
			title: '',
			doctor:'',
			year:'',
			country:'',
			language:'',
			poster: '',
			flash: '',
			summary:''
		}
	})
})

// list page
app.get('/admin/list',function(req,res){
	Movie.fetch(function(err, movies){
		if (err){
			console.log(err)
		}

		res.render('list',{
			title: '列表页',
			movies: movies
		})
	})


})

//--------------------------------------------------------------【请求接口】
//更新
app.get('/admin/update/:id', function (req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台更新页',
				movie: movie
			})
		})
	}
})


//录入新数据
//admin past movie
app.post('/admin/movie/new', function(req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie

	if(id !== 'undefined'){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function (err, movie) {
				if(err){
					console.log(err)
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	}
	else {
		_movie = new Movie({
			doctor: movieObj.doctor,
			title: movieObj.title,
			country: movieObj.country,
			language: movieObj.language,
			year: movieObj.year,
			poster: movieObj.poster,
			summary: movieObj.summary,
			flash: movieObj.flash
		})
		_movie.save(function(err, movie) {
			if(err){
				console.log(err)
			}
			res.redirect('/movie/' + movie._id)
		})
	}

})


//删除
// 删除记录
app.delete('/admin/list', function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie) {
			if(err){
				console.log(err);
			}else {
				res.json({success: 1})
			}
		})
	}
})
