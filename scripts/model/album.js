define(['q', 'requestHandler', 'categoryModel'], function (Q, requestHandler, categoryModel) {
    var albumURL, filter, _categoryModel;
    _categoryModel = categoryModel.load('https://api.parse.com/1/');
    albumURL = "classes/Album";

    var Album = (function () {
        var _category, _id;

        function AlbumForRepo(id, name, author, category) {
            this.id = id;
            this.name = name;
            this.author = author;
            this.category = category;
        }

        function AlbumForDB(name, author, category) {
            this.name = name;
            this.author = author;
            this.category = category;
        }

        function Pointer(id) {
            this.__type = "Pointer";
            this.className = "Category";
            this.objectId = id;
        }

        function createAlbum(id, name, author, category, forDB) {
            if (forDB) {
                _id = category.objectId;
                _category = new Pointer(_id);
                return new AlbumForDB(name, author, _category);
            }
            _category = category.name;
            return new AlbumForRepo(id, name, author, _category)
        }

        return createAlbum;
    }());

    var AlbumRepo = (function () {
        function AlbumRepo(baseUrl) {
            this._requestHandler = requestHandler.load(baseUrl);
            this.albumsData = {
                albums: []
            };
        }

        AlbumRepo.prototype.getAlbums = function (categoryName) {
            var _this, deffer, repo;
            _this = this;
            repo = this.albumsData;
            repo['albums'] = [];

            deffer = Q.defer();

            if (categoryName) {
                filterAlbums(categoryName)
                    .then(function (filter) {
                        return getAlbumAndPushToRepo(_this._requestHandler, repo, albumURL + filter + "&include=category,author")
                    })
                    .then(function (album) {
                        deffer.resolve(album)
                    })
            } else {
                getAlbumAndPushToRepo(_this._requestHandler, repo, albumURL + "?include=category,author")
                    .then(function (album) {
                        deffer.resolve(album)
                    })
            }
            return deffer.promise;
        };

        AlbumRepo.prototype.getAlbumById = function (id) {
            var defer = Q.defer();

            this._requestHandler.getRequest(albumURL + '/' + id + '?include=author')
                .then(function (data) {
                    defer.resolve(data);
                }, function (error) {
                    defer.reject(error);
                });

            return defer.promise;
        };

        AlbumRepo.prototype.publishAlbum = function (name, author, category) {
            this._requestHandler.postRequest(albumURL, new Album(null, name, author, category, true));
        };
        function getAlbumAndPushToRepo(requestHandler, repo, url) {
            var deffer, newAlbum;
            deffer = Q.defer();
            requestHandler.getRequest(url)
                .then(function (data) {
                    data['results'].forEach(function (album, index) {
                        newAlbum = new Album(album.objectId, album.name, album.author, album.category, false);
                        repo['albums'].push(newAlbum);
                        deffer.resolve(repo);
                    });
                }, function (err) {
                    deffer.reject(err)
                });
            return deffer.promise;
        }

        function filterAlbums(categoryName) {
            var deffer;
            deffer = Q.defer();
            _categoryModel.getCategoryIdByName(categoryName)
                .then(function (id) {
                    filter = '?where={"category":{"__type":"Pointer","className":"Category","objectId":"' + id + '"}}';
                    deffer.resolve(filter);
                }, function (err) {
                    deffer.reject(err);
                });
            return deffer.promise;
        }

        return AlbumRepo
    }());

    return {
        load: function (baseURL) {
            return new AlbumRepo(baseURL)
        }
    }
});