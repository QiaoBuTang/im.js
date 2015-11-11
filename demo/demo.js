var im = IM('liveId');

im.open();

im.on('chat.liveId', function (evt, message) {
    console.log(message);
});

im.connections('liveId', function (count) {
    console.log(count);
});
