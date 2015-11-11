var im = IM('liveId');

im.open();
im.on('chats', function (evt, message) {
    console.log(message);
});
im.connections('liveId', function (count) {
    console.log(count);
});
