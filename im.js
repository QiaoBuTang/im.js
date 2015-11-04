var Comet = (function () {
    var ORIGIN = "http://im.av.qiaobutang.com:8333";
    var MsgType = {
        chat: 1,
        systemMsg: 2,
        live: 3
    };

    var IM = function (businessIds) {
        this.businessIds = businessIds;
        this.pb = $({});
        this.connect = null;
    };

    // a pub/sub pattern depend on jquery
    IM.prototype.on = function (eventName, callback) {
        this.pb.on.apply(this.pb, arguments);
    };
    IM.prototype.once = function (eventName, callback) {
        this.pb.once.apply(this.pb, arguments);
    };
    IM.prototype.emit = function (eventName) {
        this.pb.trigger.apply(this.pb, arguments);
    };

    IM.prototype.open = function () {
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
    IM.prototype.comet = function () {
        var _this = this;
        this.connect =  $.get(ORIGIN + '/comet/web/connect/' + this.uuid);
        this.connect
            .then(function (res) {
                if (res.resultCode === 504) {
                    _this.comet(); // 如果超时，立刻重连
                } else if (res.resultCode === 200) {
                    _this.emit('message', res);
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
    IM.prototype.close = function () {
        this.connect && this.connect.abort();
    };
    IM.prototype.subscribe = function (channels, callback) {

    };

    return function (businessIds) {
        return new IM(businessIds);
    };
}());
