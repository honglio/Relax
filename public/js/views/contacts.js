define(['SocialNetView', 'views/contact', 'text!templates/contacts.html'],
function(SocialNetView, ContactView, contactsTemplate) {
  var contactsView = SocialNetView.extend({
    el: $('#content'),

    initialize: function() {
    },

    render: function() {
      this.$el.html(contactsTemplate);

      if(null != this.collection.models[0].attributes.followers) {
        this.collection.models[0].attributes.followers.forEach(function(contact) {
          var contactHtml = (new ContactView({ removeButton: true, model: contact })).render().el;
          $(contactHtml).appendTo('.followers_list');
        });
      }
      if(null != this.collection.models[0].attributes.followings) {
        this.collection.models[0].attributes.followings.forEach(function(contact) {
          var contactHtml = (new ContactView({ removeButton: true, model: contact })).render().el;
          $(contactHtml).appendTo('.followings_list');
        });
      }
    }
  });

  return contactsView;
});
