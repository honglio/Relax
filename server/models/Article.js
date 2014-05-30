var mongoose = require('mongoose')
  , config = require('../../config/config')
  , OSS = require('aliyun-oss')
  , utils = require('../../lib/utils');

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',');
};

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',');
};

/**
 * Article Schema
 */

var ArticleSchema = new mongoose.Schema({
  title: {type : String, default : '', trim : true},
  body: {type : String, default : '', trim : true},
  user: {type : mongoose.Schema.ObjectId, ref : 'Account'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : mongoose.Schema.ObjectId, ref : 'Account' },
    createdAt: { type : Date, default : Date.now }
  }],
  tags: {type: [], get: getTags, set: setTags},
  image: {
    filename: {type : String, default : ''}
  },
  createdAt  : {type : Date, default : Date.now}
});

/**
 * Validations
 */

ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');

/**
 * Pre-remove hook
 */

ArticleSchema.pre('remove', function (next) {
  var oss = OSS.createClient(config.oss);
  var filename = this.image.filename;

  // if there are files associated with the item, remove from the cloud too
  oss.deleteObject({
    bucket: config.oss.bucket,
    object: filename
  }, function (err) {
    console.log(err);
    if (err) return next(err);
  });

  next();
});

/**
 * Methods
 */

ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} image
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (image, cb) {
    if (!image.name || !image.size) return this.save(cb);

    console.log(image);
    var oss = OSS.createClient(config.oss);
    var self = this;
    console.log(oss);

    oss.putObject({
      bucket: config.oss.bucket,
      object: image.name,
      source: image.path,
      headers: {}
    }, function (err, res) {
      if (err) {
        console.log(err);
        return cb(err);
      }
      if (res) {
          console.log(res);
          self.image.filename = image.name;
      }
      self.save(cb);
    });
  },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {

    this.comments.push({
      body: comment.body,
      user: user._id
    });
    // TODO: email commenter's name and comment to article writer
    this.save(cb);
  },

  /**
   * Remove comment
   *
   * @param {commentId} String
   * @param {Function} cb
   * @api private
   */

  removeComment: function (commentId, cb) {
    var index = utils.indexof(this.comments, { id: commentId });
    if (~index) this.comments.splice(index, 1);
    else return cb('not found');
    this.save(cb);
  }
};

/**
 * Statics
 */

ArticleSchema.statics = {

  /**
   * Find article by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb);
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {};

    this.find(criteria)
      .populate('user', 'profile')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb);
  }

};

mongoose.model('Article', ArticleSchema);
