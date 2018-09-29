var app = new Vue({
    el: '#app',
    data: {
        sessions: [],
        session: {
            add: '',
            ip:'',
            user: ''
        }
    },
    created: function () {
        if (!$('body').hasClass("public")) {
            this.getSessions();
        }

    },
    filters: {
        fromNow: function (date) {
            var offset = moment().utcOffset();
            var localDate = moment.utc(date).add(offset, 'minutes');
            if (date) return localDate.fromNow();
        }
    },
    methods: {
        
        getSessions() {
            {
                this.$http.get('/api/admin/v1/sessions/').then((response) => {
                    console.log(response.body);
                    this.sessions = response.body;
                });
            }
        }
    }
})