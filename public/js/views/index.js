define(['SocialNetView', 'text!templates/index.html',
        'views/status', 'models/Status'
], function(SocialNetView, indexTemplate, StatusView, Status) {
    var indexView = SocialNetView.extend({
        el: $('#content'),

        events: {
            "submit form": "updateStatus",
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

            options.socketEvents.bind( 'status:me', this.onSocketStatusAdded, this );
            this.collection.on('add', this.onStatusAdded, this);
            this.collection.on('reset', this.onStatusCollectionReset, this);
        },

        onStatusCollectionReset: function(collection) {
            var that = this;
            collection.each(function(model) {
                that.onStatusAdded(model);
            });
        },

        onSocketStatusAdded: function(data) {
            var newStatus = data.data;
            var found = false;
            this.collection.forEach(function(status) {
                var name = status.get('name');
                if ( name && name.full == newStatus.name.full && status.get('status') == newStatus.status ) {
                    found = true;
                }
            });
            if (!found) {
                this.collection.add(new Status({status:newStatus.status, name:newStatus.name}))
            }
        },

        onStatusAdded: function(status) {
            var statusHtml = (new StatusView({ model: status })).render().el;
            $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
        },

        updateStatus: function() {
            var statusText = $('input[name=status]').val();
            var statusCollection = this.collection;
            $.post('/accounts/me/status', {status: statusText}, function(data) {
                /*optional stuff to do after success */
                statusCollection.add(new Status({status:statusText}))
            });
            return false;
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
