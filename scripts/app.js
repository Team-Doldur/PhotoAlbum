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
        modelsLoader: 'model/modelsLoader',
        photoModel: 'model/photo',
        requestHandler: 'model/requestHandler',
        userModel: 'model/user',


        // views
        albumView: 'view/album',
        categoryView: 'view/category',
        commentView: 'view/comment',
        headerView: 'view/header',
        footerView: 'view/footer',
        homeView: 'view/home',
        registerView: 'view/register',
        loginView: 'view/login',
        photoView: 'view/photo',
        uploadPhotoView: 'view/upload-photo',
        commentsView: 'view/comments',
        viewAlbumView: 'view/viewAlbum'
    },

    shim: {
        sammy: {
            deps: ['jquery'],
            exports: 'Sammy'
        }
    }
});

define(['jquery', 'sammy', 'controller', 'modelsLoader'], function ($, Sammy, ctrl, modelsLoader) {
    (function() {
        var baseUrl = 'https://api.parse.com/1/';
        var model = modelsLoader.load(baseUrl);
        var controller = ctrl.load(model);

        var router = Sammy(function () {
            var headerSelector = '#header';
            var homeSelector = '#wrapper';
            var mainSelector = '#main-content';
            var footerSelector = '#main-footer';
            var categorySelector = '#categories';
            var albumSelector = '#albums';

            this.get('#/', function () {
                controller.getHeader(headerSelector);
                controller.getHomePage(homeSelector);
                controller.getFooter(footerSelector);
            });

            this.get('#/Register', function () {
                controller.getHeader(headerSelector);
                controller.getRegisterPage(mainSelector);
            });

            this.get('#/Login', function () {
                controller.getHeader(headerSelector);
                controller.getLoginPage(mainSelector);
            });

            this.get('#/Category', function () {
                controller.getHeader(headerSelector);
                controller.getCategoryPage(categorySelector, model.categories);
            });

            this.get('#/Category/:categoryAddress', function(){
                controller.getHeader(headerSelector);
                controller.getCategoryPage(categorySelector, model.categories);
                controller.getAlbumPage(albumSelector, model.albums, this.params['categoryAddress']);
            });

            this.get('#/Category/:categoryAddress/:albumAddress', function () {
                controller.getHeader(headerSelector);
                controller.getPhotoPage(mainSelector, model.photos, this.params['albumAddress']);
            });

            this.get('#/Upload', function () {
                controller.getHeader(headerSelector);
                controller.getUploadPhotoPage(mainSelector, model);
            });

            this.get('#/Albums/:id', function () {
                controller.getHeader(headerSelector);
                controller.getViewAlbumPage(mainSelector, this.params['id']);
            })
        });

        router.run('#/');
    })();
});
