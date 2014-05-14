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

    initialize: function (options) {
      this.socketEvents = options.socketEvents;
      this.model.bind('change', this.render, this);
    },

    postStatus: function() {
      var that = this;
      var statusText = $('input[name=status').val();
      var statusCollection = this.collection;
      $.post('/accounts/' + this.model.get('_id') + '/status', { status: statusText });
      return false;
    },

    prependStatus: function(statusModel) {
      var statusHtml = (new StatusView({ model: statusModel })).render().el;
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },

    onSocketStatusAdded: function(data) {
      var statusText = data.data;
      var statusModel = new Status({status:statusText.status, name:statusText.name});
      this.prependStatus(statusModel);
    },

    render: function() {
      if ( this.model.get('_id') ) {
        this.socketEvents.bind('status:' + this.model.get('_id'), this.onSocketStatusAdded, this);
      }
      var that = this;
      this.$el.html(
        _.template(profileTemplate, this.model.toJSON())
      );

      var statusCollection = this.model.get('status');
      if ( null != statusCollection ) {
        _.each(statusCollection, function (statusJson) {
          var statusModel = new Status(statusJson);
          that.prependStatus(statusModel);
        });
      }
    }
  });

  return profileView;
});
