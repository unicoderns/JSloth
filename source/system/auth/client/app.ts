// app/nav.js
Vue.component("app-nav", {
    template: `
    <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <a class="navbar-brand font-weight-bold" href="/">JSloth<span class="font-weight-light h6 text-muted"> Auth</span></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarsExampleDefault">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <a class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#">Disabled</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
          <div class="dropdown-menu" aria-labelledby="dropdown01">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
          </div>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search">
        <button class="btn btn-info" type="submit">Search</button>
      </form>
    </div>
  </nav>
    `
});

// page/support.js
Vue.component("page-support", {
    data: function () {
        return {
            title: "Support"
        };
    }
});

// page/help.js
Vue.component("page-help", {
    data: function () {
        return {
            title: "Help"
        };
    }
});

var vue = new Vue({
    el: "#app",
    data: {
        "page": "Global",
    },
    events: {

    }
});
/*
var router = new Vue.Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: "page-support"
        },
        {
            path: '/help',
            name: 'help',
            component: "page-help"
        },
        {
            path: '/product/:id',
            name: 'product',
            component: "ProductPage"
        }
    ]
})

vue.use(Router)
*/