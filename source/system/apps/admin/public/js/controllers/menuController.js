var app = new Vue({
    el: '#menu',
    data: {
        user: {
            email: '',
            password: ''
        }
    },
    methods: {
        logout() {
            console.log('here logout');
            {
                this.$http.post('/api/auth/v1/token/revoke/', JSON.stringify(this.$data.user))
                    .then(function (response) {
                        console.log(response);
                        window.location.href = "/auth/";
                    }, function (response) {
                        console.error(response);
                    });
            }
        }
    }
})