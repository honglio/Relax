define(['SocialNetView', 'views/contact', 'text!templates/contacts.html'],
function(SocialNetView, ContactView, contactsTemplate) {
  var contactsView = SocialNetView.extend({
    el: $('#content'),

    initialize: function() {
      this.collection.on('reset', this.renderCollection, this);
    },

    render: function() {
      this.$el.html(contactsTemplate);
    },

    renderCollection: function(collection) {
      $('.followers_list').html('Followers:');
      $('.followings_list').html('Followings:');

      if(null != collection.models[0].attributes.followers) {
        collection.models[0].attributes.followers.forEach(function(contact) {
          var contactHtml = (new ContactView({ removeButton: true, model: contact })).render().el;
          $(contactHtml).appendTo('.followers_list');
        });
      }
      if(null != collection.models[0].attributes.followings) {
        collection.models[0].attributes.followings.forEach(function(contact) {
          var contactHtml = (new ContactView({ removeButton: true, model: contact })).render().el;
          $(contactHtml).appendTo('.followings_list');
        });
      }
    }
  });

  return contactsView;
});
