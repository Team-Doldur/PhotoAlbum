define(['headerView' ,'footerView', 'homeView', 'registerView', 'loginView', 'categoryView', 'uploadPhotoView'],
    function (headerView, footerView, homeView, registerView, loginView, categoryView, uploadPhotoView) {
    return (function () {
        function Controller(model) {
        }

        Controller.prototype.getHeader = function (headerSelector) {
            headerView.load(headerSelector);
        };

        Controller.prototype.getFooter = function (footerSelector) {
            footerView.load(footerSelector);
        };

        Controller.prototype.getHomePage = function (mainSelector) {
            homeView.load(mainSelector);
        };

        Controller.prototype.getRegisterPage = function (mainSelector) {
            registerView.load(mainSelector);
        };

        Controller.prototype.getLoginPage = function (mainSelector) {
            loginView.load(mainSelector);
        };

        Controller.prototype.getCategoryPage = function (mainSelector, model) {
            model.getCategories().then(
                function (data) {
                    categoryView.load(mainSelector, data);
                },
                function (error) {
                    console.error(error);
                }
            )
        };

        Controller.prototype.getUploadPhotoPage = function (mainSelector, model) {
            model.categories.getCategories().then(
                function (data) {
                    uploadPhotoView.load(mainSelector, data);
                },
                function (error) {
                    console.error(error);
                }
            )

        };

        Controller.prototype.getAlbumPage = function (mainSelector, model) {
            model.getAlbums()
                .then(function (data){
                    //TODO: add view model call here.
                },function(error){
                    console.error(error)
                })
        };

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
    })();
});