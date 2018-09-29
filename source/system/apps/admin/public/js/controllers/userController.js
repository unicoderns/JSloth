var app = new Vue({
    el: '#app',
    data: {
        users: [],
        user: {
/* 
 id?: number;
    created?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    firstName?: string;
    lastName?: string;
    timezone?: number;
    admin?: boolean;
    verified?: boolean;
    active?: boolean;
             */
            username: '',
            email:'',
            password:'',
            salt: '',
            firstName: '',
            lastName: '',
            timezone: '',
            admin: '',
            verified: '',
            active: '',

        }
    },
    created: function () {
        if (!$('body').hasClass("public")) {
            this.getUsers();
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
        add() {
            {
                var user = this.$data.user;
                this.$http.post('/api/admin/v1/users/create/', JSON.stringify(user))
                    .then(function (response) {
                        if ($('#message').length) // use this if you are using id to check
                        {
                            $('#message').show();
                        } else {
                            location.reload();
                        }
                    }, function (response) {
                        console.error(response);
                    });
            }
        },
        getUsers() {
            {
                this.$http.get('/api/admin/v1/users/').then((response) => {
                    console.log(response.body);
                    this.users = response.body;
                });
            }
        }
    }
})