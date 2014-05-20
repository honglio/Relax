define(['SocialNetView', 'text!templates/profile.html',
        'text!templates/status.html', 'models/Status',
        'views/Status'],
function(SocialNetView,  profileTemplate,
         statusTemplate, Status, StatusView) {
  var profileView = SocialNetView.extend({
    el: $('#content'),

    events: {
      "submit form": "postStatus"
    },

    initialize: function () {
      this.collection.on('add', this.onStatusAdded, this);
    },

    onStatusRender: function(collection) {
        var that = this;
        collection.each(function(model) {
            that.onStatusAdded(model);
        });
    },

    onStatusAdded: function(status) {
        var statusHtml = (new StatusView({ model: status })).render().el;
        $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    postStatus: function() {
      var statusText = $('input[name=status]').val();
      var statusCollection = this.collection;
      $.post('/accounts/me/status',
      { status: statusText },
      function(data) {
          /*optional stuff to do after success */
          statusCollection.add(new Status({status:statusText}));
      });
      return false;
    },

    render: function() {
      this.$el.html( _.template(profileTemplate, this.collection.models[0].attributes) );
      this.onStatusRender(this.collection);
    }
  });

  return profileView;
});
