var IM = (function () {
    var ORIGIN = "http://im.av.qiaobutang.com:8333";

    var Comet = function (businessIds) {
        this.businessIds = businessIds;
        this.pb = $({});
        this.connect = null;
    };

    // a pub/sub pattern depend on jquery
    Comet.prototype.on = function (eventName, callback) {
        this.pb.on.apply(this.pb, arguments);
    };
    Comet.prototype.once = function (eventName, callback) {
        this.pb.once.apply(this.pb, arguments);
    };
    Comet.prototype.emit = function (eventName) {
        this.pb.trigger.apply(this.pb, arguments);
    };

    Comet.prototype.open = function () {
        var _this = this;
        $.post(ORIGIN + '/comet/web/bindAndComet', {businessIds: this.businessIds})
            .then(function (data) {
                var deferred = $.Deferred();
                if (data.resultCode === 200) {
                    _this.uuid = data.uuid;
                    deferred.resolve();
                } else {
                    deferred.reject('get uuid failed');
                }
                return deferred.promise();
            })
            .fail(function () {
                // 系统错误后重连
                setTimeout(function () {
                    _this.open();
                }, 20000)
            })
            .then($.proxy(this.comet, this))
    };
    Comet.prototype.comet = function () {
        var _this = this;
        this.connect =  $.get(ORIGIN + '/comet/web/connect/' + this.uuid);
        this.connect
            .then(function (res) {
                if (res.resultCode === 504) {
                    _this.comet(); // 如果超时，立刻重连
                } else if (res.resultCode === 200) {
                    _this.emit('message', res.result);
                    _this.comet();
                }
            })
            .fail(function () {
                // 系统错误后重连
                setTimeout(function () {
                    _this.open();
                }, 20000);
            });
    };
    Comet.prototype.close = function () {
        this.connect && this.connect.abort();
    };

    return function (businessIds) {
        return new Comet(businessIds);
    };
}());
