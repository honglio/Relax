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
      $('.contacts_list').empty();
      collection.each(function(contact) {
        var contactHtml = (new ContactView({ removeButton: true, model: contact })).render().el;
        $(contactHtml).appendTo('.contacts_list');
      });
    }
  });

  return contactsView;
});
