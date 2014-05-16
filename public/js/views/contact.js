define(['SocialNetView', 'text!templates/contact.html'], function(SocialNetView, contactTemplate) {
  var contactView = SocialNetView.extend({
    addButton: false,

    removeButton: false,

    tagName: 'li',

    events: {
      "click .addbutton": "addContact",
      "click .removebutton": "removeContact"
    },

    addContact: function() {
      var $responseArea = this.$('.action_area');
      $.post('/accounts/me/contact',
          {contactId: this.model._id}, function() { // on success
          $responseArea.text('Contact Added');
      }).error(function() {
          $responseArea.text('Could not add contact');
      });
    },

    removeContact: function() {
      var $responseArea = this.$('.action_area');
      $responseArea.text('Removing contact...');
      $.ajax({
        url: '/accounts/me/contact',
        type: 'DELETE',
        data: {
          contactId: this.model.accountId
        }}).done(function onSuccess() {
          $responseArea.text('Contact Removed');
        }).fail(function onError() {
          $responseArea.text('Could not remove contact');
        });
    },

    initialize: function() {
      // Set the addButton variable in case it has been added in the constructor
      if ( this.options.addButton ) {
        this.addButton = this.options.addButton;
      }

      if ( this.options.removeButton ) {
        this.removeButton = this.options.removeButton;
      }
    },

    render: function() {
      $(this.el).html(_.template(contactTemplate, {
        model: this.model,
        addButton: this.addButton,
        removeButton: this.removeButton
      }));
      return this;
    }
  });

  return contactView;
});
