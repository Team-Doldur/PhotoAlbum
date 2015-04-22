define(['q', 'requestHandler'], function (Q, requestHandler, categoryModel) {
    var albumURL, filter;

    albumURL = "classes/Album";

    var Album = (function () {
        function Album(id, name, author, category) {
            this.id = id;
            this.name = name;
            this.author = author;
            this.category = category
        }

        return Album;
    });

    function createAlbum(id, name, author, category) {
        //Get category id here.
        return new Album(name, author, category);
    }

    function pushAlbumToDB(album) {
        requestHandler.postRequest(albumURL, album, 'application/json');
    }

    return (function () {
        function AlbumRepo(baseUrl) {
            this._requestHandler = requestHandler.load(baseUrl);
            this.albumsData = {
                albums: []
            };
        }

        AlbumRepo.prototype.getAlbums = function (category) {
            var deffer = Q.defer();
            var _this = this;
            this.albumsData['albums'].length = 0;

            if (category) {
                filter = '?where={"category":{"__type":"Pointer","className":"Category","objectId":"' + category.id + '"}}'
            } else {
                filter = '';
            }

            this._requestHandler.getRequest(albumURL + filter)
                .then(function (data) {
                    data['results'].forEach(function (album, index) {
                        _this.albumsData['albums'].push(createAlbum(album.objectId, album.name, album.author, album.category));
                    });
                    deffer.resolve(_this.albumsData)
                }, function (err) {
                    deffer.reject(err);
                });

            return deffer.promise;
        };

        return {
            load: function (baseURL) {
                return new AlbumRepo(baseURL)
            }
        }
    }())
});