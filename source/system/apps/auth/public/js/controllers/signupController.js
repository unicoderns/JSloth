var app = new Vue({
    el: '#app',
    data: {
        user: {
            username: '',
            email:'',
            password:'',
            salt: '',
            firstName: '',
            lastName: ''

        }
    },
    methods: {
        signUp() {
            {
                var user = this.$data.user;
               
               this.$http.post('/api/auth/v1/signup/', JSON.stringify(user))
                    .then(function (response) {
                        if (response.body.success) {
                            window.location.href = "/auth/verify";
                        } else {
                        }
                    }, function (response) {
                        console.error(response);
                    });
            }
        }
    }
})