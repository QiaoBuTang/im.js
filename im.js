var IM = (function () {
    var ORIGIN = IM_SERVER || "http://im.av.qiaobutang.com:8333";
    var Instance; // comet 的单例对象, 一个页面只存在一个 comet 实例

    var Comet = function (bIds) {
        this.bIds = this._processBid(bIds);
        this.pb = $({});
        this.connect = null;
        this.liveNum = this.connections;
    };
    // TODO: 去重
    Comet.prototype._processBid = function (bIds) {
        if (bIds instanceof Array) return bIds;
        if (typeof bIds === 'string') return bIds.split(',');
    };
    // a pub/sub pattern depend on jquery
    Comet.prototype.on = function (eventName, callback) {
        this.pb.on.apply(this.pb, arguments);
    };
    Comet.prototype.one = function (eventName, callback) {
        this.pb.one.apply(this.pb, arguments);
    };
    Comet.prototype.emit = function (eventName) {
        this.pb.trigger.apply(this.pb, arguments);
    };

    Comet.prototype.open = function () {
        var _this = this;
        $.post(ORIGIN + '/comet/web/bindAndComet', {businessIds: this.bIds.join(',')})
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
        return this;
    };
    Comet.prototype.addBusiness = function (bids) {
        var _this = this;
        bids = this._processBid(bids);
        bids.forEach(function (bid) {
            $.get(ORIGIN + '/comet/web/bind/' + _this.uuid + '/' + bid)
                .then(function (res) {
                    if (res.resultCode === 2000) {
                        _this.trigger('didBind', bid);
                    } else {
                        _this.trigger('bindError', bid);
                    }
                })
                .fail(function () {
                    _this.trigger('bindError', bid);
                });
        });
    };
    Comet.prototype.removeBusiness = function (bids) {
        var _this = this;
        bids = this._processBid(bids);
        bids.forEach(function (bid) {
            $.get(ORIGIN + '/comet/web/unbind/' + bid)
                .then(function (res) {
                    if (res.resultCode === 2000) {
                        _this.trigger('didUnBind', bid);
                    } else {
                        _this.trigger('unBindError', bid);
                    }
                })
                .fail(function () {
                    _this.trigger('unBindError', bid);
                });
        });
    };
    Comet.prototype.comet = function () {
        var _this = this;
        this.connect =  $.get(ORIGIN + '/comet/web/connect/' + this.uuid);
        this.connect
            .then(function (res) {
                if (res.resultCode === 504) {
                    _this.comet(); // 如果超时，立刻重连
                } else if (res.resultCode === 200) {
                    _this._emit(res);
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
    Comet.prototype._emit = function (res) {
        var _this = this;
        var type = res.type;
        var emit = function (evtName, bId, result) {
            _this.trigger(evtName, result);
        };
        switch (type) {
            case 1:
                emit('chat', res.businessId, res.result);
            break;
            case 2:
                emit('noty', res.businessId, res.result);
            break;
            case 3:
                emit('live', res.businessId, res.result);
            break;
            case 4:
                emit('liveNum', res.result.businessId, res.result.count);
            break;
        }
    };
    Comet.prototype.close = function () {
        this.connect && this.connect.abort();
    };
    /**
     * 获取当前业务的连接数
     * @param callback {Function}
     */
    Comet.prototype.connections = function (callback) {
        $.get(ORIGIN + '/comet/web/group/' + this.businessIds + '/count').then(function (res) {
            if (res.resultCode === 200) {
                callback({
                    resultCode: 200,
                    count: 123
                });
            } else {
                callback({
                    resultCode: 400
                });
            }
        }, function () {
            callback({
                resultCode: 400
            });
        });
    };

    return function (businessIds) {
        if (Instance) {
            return Instance.addBusiness(businessIds);
        } else {
            return new Comet(businessIds);
        }
    };
}());
