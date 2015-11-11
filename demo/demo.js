var im = IM('liveId,META_liveId');

im.open(function () {
    //im.addOnlineBind('liveId')
});

im.on('chats', function (evt, message) {
    console.log(message);
});
im.on('online.liveId', function (evt, res) {
    console.log(res);
});
im.connections('liveId', function (count) {
    console.log(count);
});
