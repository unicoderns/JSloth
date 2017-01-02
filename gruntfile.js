////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2016  Christopher Mejía Montoya - me@chrissmejia.com - chrissmejia.com   //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(grunt) {
    "use strict";

    // Base URI
    grunt.uri = "./";
    // Sys URIs
    grunt.source = grunt.uri + "source/";
    grunt.dist = grunt.uri + "dist/";
    grunt.uriTask = grunt.uri + "grunt/";

    // Our task object where we"ll store our configuration.
    var tasks = {};

    // Typescript Tasks
    tasks = require(grunt.uriTask + "js-typescript.js")(grunt, tasks);

    // Lint Tasks
    tasks = require(grunt.uriTask + "js-lint.js")(grunt, tasks);

    // Copy Tasks
    tasks = require(grunt.uriTask + "js-copy.js")(grunt, tasks);

    // Minify Tasks
    tasks = require(grunt.uriTask + "js-watch.js")(grunt, tasks);

    // Register The Tasks
    grunt.registerTask("lint", ["tslint"]);
    grunt.registerTask("typescript", ["ts"]);
    grunt.registerTask("cp", ["copy"]);
    //grunt.registerTask("watch", ["daemon"]);
    grunt.registerTask("default", ["lint", "typescript", "cp"]);

    // Initialize The Grunt Configuration
    grunt.initConfig(tasks);

};