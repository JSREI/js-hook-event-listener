# JavaScript Hook Event Listener

JavaScript逆向开发基础组件系列：Hook事件监听器函数，一般用在编写JavaScript逆向的油猴脚本中，作为基础组件提高开发效率。

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





