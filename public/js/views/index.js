define(['SocialNetView', 'text!templates/index.html',
        'views/status', 'models/Status'
], function(SocialNetView, indexTemplate, StatusView, Status) {
    var indexView = SocialNetView.extend({
        el: $('#content'),

        events: {
            "click #myProfile": "updateViewNum"
        },

        initialize: function(options) {
            var that = this;
            $.ajax("/accounts/me/viewNum", {
                method: "GET",
                success: function(data) {
                    console.log(data);
                    that.viewNum = data.data;
                    that.render();
                },
                error: function(data) {
                }
            });
        },

        updateViewNum: function() {
            console.log(this.viewNum);
            this.viewNum += 1;
            $.post('/accounts/me/viewNum', {viewNum: this.viewNum});
        },

        render: function() {
            console.log("rendered");
            this.$el.html(_.template(indexTemplate, {viewNum: this.viewNum}));
        }
    });

    return indexView;
});
