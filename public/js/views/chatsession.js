define(['SocialNetView', 'text!templates/chatsession.html'],
function(SocialNetView, chatItemTemplate) {
  var chatItemView = SocialNetView.extend({
    tagName: 'div',

    className: 'chat_session',

    $el: $(this.el),

    events: {
      'submit form': 'sendChat'
    },

    initialize: function(options) {
      this.socketEvents = options.socketEvents;
      var accountId = this.model.accountId;
      this.socketEvents.on('socket:chat:in:' + accountId, this.receiveChat, this);
      this.socketEvents.bind('login:' + accountId, this.handleContactLogin, this);
      this.socketEvents.bind('logout:' + accountId, this.handleContactLogout, this);
    },

    handleContactLogin: function() {
      this.$el.find('.online_indicator').addClass('online');
      this.model.online = true;
    },

    handleContactLogout: function() {
      this.model.online = false;
      $onlineIndicator = this.$el.find('.online_indicator');
      while ( $onlineIndicator.hasClass('online') ) {
        $onlineIndicator.removeClass('online');
      }
    },

    receiveChat: function(data) {
      var chatLine = this.model.name.first + ': ' + data.text;
      this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));
    },

    sendChat: function() {
      var chatText = this.$el.find('input[name=chat]').val();
      if ( chatText && /[^\s]+/.test(chatText) ) {
        var chatLine = 'Me: ' + chatText;
        this.$el.find('.chat_log').append($('<li>' + chatLine + '</li>'));
        this.socketEvents.trigger('socket:chat', {
          to: this.model.accountId,
          text: chatText
        });
      }
      return false;
    },

    render: function() {
      console.log(this.model);
      this.$el.html(_.template(chatItemTemplate, {
        model: this.model
      }));
      if ( this.model.online ) this.handleContactLogin();
      return this;
    }
  });

  return chatItemView;
});