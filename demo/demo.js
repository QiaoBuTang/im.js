var im = Comet('liveId');

im.open();

im.on('message', function (evt, message) {
    console.log(message);
});
