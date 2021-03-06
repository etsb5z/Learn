var Movie = require('../models/movie')
var _ = require('underscore')

// 详情
// detail page
exports.detail = function(req,res){
	var id = req.params.id

	Movie.findById(id, function(err, movies){
		res.render('detail',{
			title: movies.title + '详情页',
			movie: movies
		})
	})
}

//录入页
// admin new page
exports.new = function(req,res){
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
}


//更新
exports.update = function (req, res){
	var id = req.params.id;

	if(id){
		Movie.findById(id, function(err, movie){
			res.render('admin', {
				title: '后台更新页',
				movie: movie
			})
		})
	}
}


// 列表
// list page
exports.list = function(req,res){
	Movie.fetch(function(err, movies){
		if (err){
			console.log(err)
		}

		res.render('list',{
			title: '列表页',
			movies: movies
		})
	})

}



//录入新数据
//admin past movie
exports.save = function(req, res) {
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

}



//删除
//ajax 删除记录
exports.del = function(req, res){
	var id = req.query.id;

	if(id){
		Movie.remove({_id: id}, function(err, movie) {
			if(err){
				console.log(err);
				res.json({success: 0})
			}else {
				res.json({success: 1})
			}
		})
	}
}
