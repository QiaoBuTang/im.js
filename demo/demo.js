var im = Comet('liveId');

im.open();

im.on('message', function (evt, message) {
    console.log(message);
});
im.on('refuse', function () {
    console.log('网络错误');
});
