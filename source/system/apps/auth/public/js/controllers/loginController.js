var app = new Vue({
    el: '#app',
    data: {
        user: {
            email: '',
            password: ''
        }
    },
    methods: {
        login() {
            {
                this.$http.post('/api/auth/v1/token/', JSON.stringify(this.$data.user))
                    .then(function (response) {
                        console.log(response);
                        if (response.body.success) {
                            window.location.href = "/";
                        } else {
                            $("#message").show();
                        }
                    }, function (response) {
                        console.error(response);
                    });
            }
        }
    }
})