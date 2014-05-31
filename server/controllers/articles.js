var mongoose = require('mongoose')
  , Article = mongoose.model('Article')
  , utils = require('../../lib/utils')
  , extend = require('util')._extend
  , config = require('../../config/config');

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.article = article;
    next();
  });
};

/**
 * List
 */

exports.index = function(req, res){

  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 3;
  var options = {
    perPage: perPage,
    page: page
  };

  /* list only req user's article */
  // var options = {
  //   perPage: perPage,
  //   page: page,
  //   criteria: {user: req.user}
  // };

  Article.list(options, function(err, articles) {
    if (err) return res.render('500');
    console.log('article list:' + articles);
    Article.count().exec(function (err, count) {
      res.render('article/index', {
        title: 'Articles',
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New article
 */

exports.new = function(req, res){
  res.render('article/new', {
    title: 'New Article',
    article: new Article({})
  });
};

/**
 * Create an article
 */

exports.create = function (req, res) {
  var article = new Article(req.body);
  article.user = req.user;

  article.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', {msg: 'Successfully created article!'});
      return res.redirect('/articles/'+article._id);
    }

    res.render('article/new', {
      title: 'New Article',
      article: article,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('article/edit', {
    title: 'Edit ' + req.article.title,
    article: req.article,
    oss: config.oss
  });
};

/**
 * Update article
 */

exports.update = function(req, res){
  var article = req.article;
  article = extend(article, req.body);

  console.log(article);
  article.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/articles/' + article._id);
    }

    res.render('article/edit', {
      title: 'Edit Article',
      article: article,
      error: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function(req, res){
    res.render('article/post', {
      article: req.article,
      oss: config.oss
    });
};

/**
 * Delete an article
 */

exports.destroy = function(req, res){
  var article = req.article;
  article.remove(function(err){
    req.flash('info', {msg: 'Deleted successfully'});
    res.redirect('/articles');
  });
};

exports.postViewNum = function(req, res) {
  var accountId = req.params.id == 'me'
                    ? req.session.accountId
                    : req.params.id;
  var viewNum = req.param('viewNum', null);

  if( null == viewNum ) {
    res.send(400);
    return;
  }

  Account.findById(accountId, function(account) {
    if ( account ) {
      account.viewNum += 1;
      account.save();
    }
  });
  res.send(200);
};