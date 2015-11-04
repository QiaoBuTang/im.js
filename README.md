# 乔布堂实时通信服务 JavaScript sdk

在服务端存在 IM 服务的前提下，客户端需要封装出一套 JavaScript 的 sdk 用于完成在线交流，聊天，系统通知等等业务

## 使用简介

依赖 `jQuery` 或者 `Zepto(未测试)`

客户端引入 `im.js`

## API

### `IM` 

描述: 配置一个 IM 的服务，生成一个 IM 的实例用于，提供后续调用的方法

参数:

  * businessId {String} (必须)  注册实时通信服务的业务 Id，根据业务的场景不同而不同

返回值: {Object} imClient IM 的实例，用于后续的接收消息

### `imClient.open()`

描述: 打开一个 im 的连接，用于接收推送的消息

参数: 无

返回: 无

### `imClient.on(eventName, callback)`

描述: 监听当前 imClient 内的事件

参数:

  * eventName {String} (必须) 监听的事件名称，现在只有 `message` 事件
  * callback {Function} (必须) 事件的回掉函数

返回: 无

### `imClient.one(eventName, callback)`

描述: 监听当前 imClient 内的事件, 只触发一次

参数:

  * eventName {String} (必须) 监听的事件名称，现在只有 `message` 事件
  * callback {Function} (必须) 事件的回掉函数

返回: 无

### `imClient.close`

描述: 关闭当前的 client 连接

参数: 无

返回: 无

