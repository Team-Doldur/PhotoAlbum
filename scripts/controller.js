define(['headerView' ,'footerView', 'homeView', 'registerView', 'loginView', 'categoryView',
        'albumView', 'photoView', 'uploadPhotoView', 'createAlbumView', 'viewAlbumView', 'commentsView'],
    function (headerView, footerView, homeView, registerView, loginView, categoryView,
              albumView, photoView, uploadPhotoView, createAlbumView, viewAlbumView, commentsView) {
    return (function () {
        function Controller(model) {
            this._model = model;
        }

        function validateName(name) {
            var regex = /[^a-zA-Z\s+]+/;
            if (name.match(regex)) {
                throw new Error('Invalid name!')
            }
        }

        function cryptName(name) {
            return name.split(' ').join('+');
        }

        function decryptName(name) {
            return name.split('+').join(' ');
        }

        Controller.prototype.getHeader = function (headerSelector, data) {
            headerView.load(headerSelector, data);
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
            );
        };

        Controller.prototype.getAlbumPage = function (mainSelector, model, categoryAddress) {
            var categoryName = decryptName(categoryAddress);
            model.getAlbums(categoryName)
                .then(function (data){
                    albumView.load(mainSelector, data)
                },function(error){
                    console.error(error)
                })
        };

        Controller.prototype.getPhotoPage = function (mainSelector, albumAddress) {
            var albumName = decryptName(albumAddress);
            var _this = this;

            this._model.photos.getPhotos(albumName).then(
                function (data) {
                    photoView.load(mainSelector, data, _this, albumName);
                },
                function (error) {
                    console.error(error);
                });
        };

        Controller.prototype.getCreateAlbumPage = function (mainSelector, model) {
            model.categories.getCategories().then(
                function (data) {
                    if (sessionStorage['logged-in']) {
                        createAlbumView.load(mainSelector, data);
                    }
                },
                function (error) {
                    console.error(error);
                }
            )
        };

        Controller.prototype.getUploadPhotoPage = function (mainSelector, model, controller) {
            var _this = this;
            model.categories.getCategories().then(
                function (data) {
                    if (sessionStorage['logged-in']) {
                        uploadPhotoView.load(mainSelector, data, _this);
                    }
                },
                function (error) {
                    console.error(error);
                }
            )
        };

        Controller.prototype.sendPhoto = function(file, name, albumId, authorId){
            return this._model.photos.postPhoto(file, name, albumId, authorId)
        };

        Controller.prototype.getViewAlbumPage = function (mainSelector, albumId) {
            var _this = this;

            this._model.albums.getAlbumById(albumId)
                .then(function (data) {
                    viewAlbumView.load(mainSelector, data, _this);
                }, function (error) {
                    console.error(error);
                });
        };

        Controller.prototype.loadAlbumComments = function (selector, resourceType, albumName) {
            var _this = this;

            this._model.albums.getAlbumIdByName(albumName)
                .then(function (albumId) {
                    _this._model.comments.getComments(resourceType, albumId)
                        .then(function (data) {
                            commentsView.load(selector, data, albumId);
                        }, function (error) {
                            console.log(error);
                        });
                }, function (error) {
                    console.log(error);
                });
        };

        Controller.prototype.storeComment = function (params) {
            var _this = this;
            this._model.comments.postComment(params['resourceType'], params['resourceId'], params['author'], params['email'], params['comment-text'])
                .then(function (data) {
                    _this._model.albums.getAlbumById(params['resourceId'])
                        .then(function (album) {
                            _this.loadAlbumComments('#comments', 'Album', album.address);
                        }, function (error) {
                            console.log(error);
                        });
                }, function (error) {
                    console.log(error);
                })
        };

        return {
            load: function (model) {
                return new Controller(model);
            }
        }
    })();
});