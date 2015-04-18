requirejs.config({
    baseUrl: 'scripts',

    paths: {
        // libs
        jquery: 'lib/jquery-2.1.3.min',
        lodash: 'lib/lodash.min',
        mustache: 'lib/mustache.min',
        q: 'lib/q',
        sammy: 'lib/sammy-latest.min',

        // controller
        controller: 'controller',

        // models
        albumModel: 'model/album',
        categoryModel: 'model/category',
        commentModel: 'model/comment',
        photoModel: 'model/photo',
        rateModel: 'model/rate',
        requestHandler: 'model/requestHandler',
        userModel: 'model/user',

        // views
        albumView: 'view/album',
        categoryView: 'view/category',
        commentView: 'view/comment',
        headerView: 'view/header',
        homeView: 'view/home',
        registerView: 'view/register',
        photoView: 'view/photo',
        rateView: 'view/rate'
    },

    shim: {
        sammy: {
            deps: ['jquery'],
            exports: 'Sammy'
        }
    }
});

var app = app || {};

define(['jquery', 'sammy', 'controller'], function ($, Sammy) {
    (function() {
        var categories = app.categoryData.load('https://api.parse.com/1/');
        var controller = app.controller.load(categories);

        app.router = Sammy(function () {
            var selector = '#wrapper';

            this.get('#/', function () {
                controller.getHomePage(selector);
            });

            this.get('#/register', function () {
                controller.getRegisterPage(selector);
            });

            this.get('#/Category', function () {
                controller.getCategoryPage(selector);
            });
        });

        app.router.run('#/');
    })();
});