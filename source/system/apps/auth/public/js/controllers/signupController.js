var app = new Vue({
    el: '#app',
    data: {
        user: {
            username: '',
            email:'',
            password:'',
            salt: '',
            firstName: '',
            lastName: '',
            timezone: '',
            admin: '',
            verified: '',
            active: ''

        }
    },
    methods: {
        signUp() {
            {
                var user = this.$data.user;
                window.location.href = "/auth/verify";
               /* this.$http.post('/api/admin/v1/users/create/', JSON.stringify(user))
                    .then(function (response) {
                        if (response.body.success) {
                            window.location.href = "/verify/"+ user.username;
                        } else {
                            $("#message").show();
                        }
                    }, function (response) {
                        console.error(response);
                    }); */
            }
        }
    }
})