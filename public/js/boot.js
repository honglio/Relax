require.config({
  paths: {
    jQuery: '/js/vendors/jquery',
    Underscore: '/js/vendors/underscore',
    Backbone: '/js/vendors/backbone',
    text: '/js/vendors/text',
    SocialNetView: '/js/SocialNetView',

    // directory map
    models: 'models',
    templates: '/templates'
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'SocialNet': ['Backbone']
  }
});

require(['SocialNet'], function(SocialNet) {
  SocialNet.initialize();
});
