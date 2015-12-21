var im = IM('liveId,META_liveId');

im.open();

im.on('chats', function (evt, ret) {
    console.log(ret.messages);
});
im.on('chat.liveId', function (evt, ret) {
    console.log(ret.messages);
});
im.on('online.liveId', function (evt, res) {
    console.log(res);
});
im.connections('liveId', function (count) {
    console.log(count);
});
