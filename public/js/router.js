define(['views/index', 'views/register', 'views/login',
        'views/forgotpassword', 'views/profile', 'views/contacts',
        'views/addcontact', 'models/Account', 'models/StatusCollection',
        'models/ContactCollection'],
function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView,
         ContactsView, AddContactView, Account, StatusCollection,
         ContactCollection) {
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      "addcontact": "addcontact",
      "index": "index",
      "login": "login",
      "register": "register",
      "forgotpassword": "forgotpassword",
      "profile/:id": "profile",
      "contacts/:id": "contacts"
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() {
      this.changeView(new IndexView());
    },

    addcontact: function() {
      this.changeView(new AddContactView());
    },

    login: function() {
      this.changeView(new LoginView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },

    profile: function() {
      var statusCollection = new StatusCollection();
      statusCollection.url = '/accounts/me/status';
      var that = this;
      statusCollection.fetch({
        success: function(collection) {
          that.changeView(new ProfileView({collection: collection}));
        },
        error: function() {
            alert('An error occurred while fetch profile');
        }
      });
    },

    contacts: function(id) {
      var contactId = id ? id : 'me';
      var contactsCollection = new ContactCollection();
      contactsCollection.url = '/accounts/' + contactId + '/contacts';
      var that = this;
      contactsCollection.fetch({
        success: function(collection) {
          that.changeView(new ContactsView({collection: collection}));
        },
        error: function() {
          alert('An error occurred while fetch contact');
        }
      });
    }
  });

  return new SocialRouter();
});

