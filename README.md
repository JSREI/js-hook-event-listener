# JavaScript Hook Event Listener

GitHub Repository：https://github.com/JSREI/js-hook-event-listener

简体中文| [English](README_en.md)

JavaScript逆向开发基础组件系列：Hook事件监听器函数，一般用在编写JavaScript逆向的油猴脚本中，作为基础组件提高开发效率。

# API

```js
    /**
     *
     * @param object 要Hook的对象，在这个对象上增加的事件将被Hook
     * @param addEventListenerAttributeName 如果支持使用属性设置回调的话，
     * @param addEventListenerMethodName 如果是使用方法来添加事件监听器的话，那这个方法的名字是啥，默认值是 addEventListener
     * @param eventNameArray { string | Array} 要Hook的事件的名字，可以是一个字符串表示单个事件，可以是一个字符串数组来表示多个事件
     * @param eventListenerHookFunc 要增加的Hook逻辑，在每次触发被Hook的事件，执行被Hook的事件监听器之前，都会先执行这个函数，此方法需要返回一个能够转换为true的值，
     *                       才会继续执行被Hook的事件监听器函数，否则将不执行
     */
    constructor(object, addEventListenerAttributeName, addEventListenerMethodName = "addEventListener", eventNameArray, eventListenerHookFunc) {
      // ...
    }
     
```

## Example

油猴脚本中使用方式大概是这样：

```js
// 提前埋伏好，后面增加事件监听的时候会把给定的逻辑放进去，通常情况下是借助油猴脚本等之类的工具注入到正常页面的头部先执行
(() => {
    const fooBtnElement = document.getElementById("foo-btn");
    const hookFunc = function () {
        alert("执行了Hook逻辑！");
        return true;
        // return false;
    };
  	// 表示给这个元素的
    new HookEventListener(fooBtnElement, "onclick", "addEventListener", ["click"], hookFunc).addHook();
})();
```

页面中网站开发者的代码是这样，就会被前面的代码Hook到：

```js
// 正常的代码，就正常添加事件，但是会被前面添加的Hook给捕捉到先悄悄执行Hook逻辑，然后才会执行此处指定的事件回调方法
const elementById = document.getElementById("foo-btn");
const eventFunc = function () {
    alert("按钮被单击！");
};
// elementById.addEventListener("click", eventFunc);
elementById.onclick = eventFunc;
```

## TODO 
对于DOM元素直接在<HTMLElement>标签中绑定时间的情况也要能够Hook得到 


## 逆向技术交流群

扫码加入逆向技术交流群：

<img src="./README.assets/image-20241016230653669.png" style="width: 200px">

如群二维码过期，可以加我个人微信，发送【逆向群】拉你进群：

<img src="./README.assets/image-20231030132026541-7614065.png" style="width: 200px">

[点此](https://t.me/jsreijsrei)或扫码加入TG交流群：

<img src="./README.assets/image-20241016231143315.png" style="width: 200px">



