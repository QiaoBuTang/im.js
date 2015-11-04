var Comet = (function () {
    var ORIGIN = "http://im.av.qiaobutang.com:8333";

    var IM = function (businessIds) {
        this.businessIds = businessIds;
        this.pb = $({});
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
                    return deferred.resolve();
                } else {
                    return deferred.reject('get uuid failed');
                }
            })
            .then($.proxy(this.comet, this))
    };
    IM.prototype.comet = function (uuid) {
        var _this = this;
        return $.get(ORIGIN + '/comet/web/connect/' + this.uuid)
            .then(function (res) {
                if (res.resultCode === 504) {
                    _this.comet(); // 如果超时，立刻重连
                } else if (res.resultCode === 200) {
                    _this.emit('message', res);
                    _this.comet();
                }
            });
    };
    IM.prototype.close = function () {

    };
    IM.prototype.subscribe = function (channels, callback) {

    };

    return function (businessIds) {
        return new IM(businessIds);
    };
}());
