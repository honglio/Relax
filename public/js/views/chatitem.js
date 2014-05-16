define(['SocialNetView', 'text!templates/chatitem.html'],
function(SocialNetView, chatItemTemplate) {
  var chatItemView = SocialNetView.extend({
    tagName: 'li',

    $el: $(this.el),

    events: {
      'click': 'startChatSession',
    },

    initialize: function(options) {
      console.log(this.model);
      var accountId = this.model.accountId;
      options.socketEvents.bind('login:' + accountId, this.handleContactLogin, this);
      options.socketEvents.bind('logout:' + accountId, this.handleContactLogout, this);
      options.socketEvents.bind('socket:chat:start:' + accountId, this.startChatSession, this);
    },

    handleContactLogin: function() {
      this.model.online = true;
      this.$el.find('.online_indicator').addClass('online');
    },

    handleContactLogout: function() {
      this.model.online = false;
      $onlineIndicator = this.$el.find('.online_indicator');
      while ( $onlineIndicator.hasClass('online') ) {
        $onlineIndicator.removeClass('online');
      }
    },

    startChatSession: function() {
      this.trigger('chat:start', this.model);
    },

    render: function() {
      this.$el.html(_.template(chatItemTemplate, {
        model: this.model
      }));
      if ( this.model.online ) this.handleContactLogin();
      return this;
    }
  });

  return chatItemView;
});