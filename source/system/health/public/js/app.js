var app = new Vue({
    el: '#app',
    data: {
        status: {}
    },
    created: function()
    {
        this.getStatus();
    },
    methods: {
        getStatus(){
          {
              this.$http.get('/api/health/v1/').then((response) => {
                console.log(response.body);
                  this.status = response.body;
              });
          }
        }
      }
})