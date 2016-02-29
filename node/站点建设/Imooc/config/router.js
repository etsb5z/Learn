var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')


module.exports = function(app){
	//pre handle user
	app.use(function(req, res, next) {
		var _user = req.session.user

		app.locals.user = _user

		return next()
	})



	/*首页*/
	// index page
	app.get('/',Index.index)


	/*用户*/
	//signup
	app.post('/user/regist', User.regist)
	//signin
	app.post('/user/login', User.login)
	//logout
	app.get('/regist', User.showRegist)
	//logout
	app.get('/login', User.showLogin)
	//logout
	app.get('/logout', User.logout)
	// userlist page
	app.get('/admin/user/list',User.loginRequired, User.adminRequired, User.list)//中间介

	//mark
	//预处理和过滤操作都可以使用自定义中间介完成


	/*电影*/
	// detail page
	app.get('/movie/:id', Movie.detail)
	// admin new page
	app.get('/admin/movie/new',User.loginRequired, User.adminRequired, Movie.new)
	// list page
	app.get('/admin/movie/list',User.loginRequired, User.adminRequired, Movie.list)
	// admin update movie
	app.get('/admin/movie/update/:id',User.loginRequired, User.adminRequired, Movie.update)
	//录入新数据
	//admin past movie
	app.post('/admin/movie/new',User.loginRequired, User.adminRequired, Movie.save)
	//删除
	//ajax 删除记录
	app.delete('/admin/movie/list',User.loginRequired, User.adminRequired, Movie.del)

}
