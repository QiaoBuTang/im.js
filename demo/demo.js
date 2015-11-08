var im = IM('liveId');

im.open();

im.on('message', function (evt, message) {
    console.log(message);
});

im.connections(function (count) {
    console.log(count);
});
