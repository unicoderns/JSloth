##################
Create app
##################

This is the easiest way to create a new app.

*****************
1. Copy skeleton
*****************
Copy the sample app ``source/apps/sample``

*****************
2. Set up config
*****************
Setup config ``config.json``

-----------------
Example
-----------------

.. code-block:: json
   :linenos:

    {
        "custom_apps": [{
            "name": "newapp",
            "basepath": "/newapp/",
            "config": {}
        }]
    }

*****************
3. Setup angular
*****************

======================
.angular-cli.json
======================

Edit .angular-cli.json and copy sample and sample-server config:

-----------------
Example
-----------------

.. code-block:: json
   :linenos:

    [{
      "name": "newapp",
      "root": "source/apps/newapp/client",
      "outDir": "dist/browser/newapp",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "index": "index.html",
      "main": "main.ts",
      "polyfills": "polyfills.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.app.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": [
        "scss/styles.scss"
      ],
      "scripts": [],
      "environmentSource": "environments/environment.ts",
      "environments": {
        "dev": "environments/environment.ts",
        "prod": "environments/environment.prod.ts"
      }
    },
    {
      "name": "newapp-server",
      "root": "source/apps/newapp/client",
      "outDir": "dist/server/newapp",
      "assets": [
        "assets",
        "favicon.ico"
      ],
      "platform": "server",
      "index": "index.html",
      "main": "main.server.ts",
      "test": "test.ts",
      "tsconfig": "tsconfig.server.json",
      "testTsconfig": "tsconfig.spec.json",
      "prefix": "app",
      "styles": [
        "scss/styles.scss"
      ],
      "scripts": [],
      "environmentSource": "source/abstract/angular/environments/environment.ts",
      "environments": {
        "dev": "source/abstract/angular/environments/environment.ts",
        "prod": "source/abstract/angular/environments/environment.prod.ts"
      }
    }]


======================
.package.json
======================

Edit .package.json and copy sample and sample-server config:

    1. Add it to the end of ``npm buld`` .. ``&& ng build --prod --app newapp && ng build --prod --app newapp-server``
    2. Create a custom ``npm buld-newapp: "ng build --prod --app newapp && ng build --prod --app newapp-server"``

******************
4. Compile Angular
******************

Run ``npm buld`` to compile every client or ``npm buld-newapp`` to compile only the new app client
