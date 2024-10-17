# JavaScript Hook Event Listener

GitHub Repository：https://github.com/JSREI/js-hook-event-listener

[简体中文](./README.md) | English

# JavaScript Hook Event Listener

A fundamental component series for JavaScript reverse engineering: Hooking event listener functions, typically used in writing JavaScript reverse engineering scripts like Tampermonkey, serves as a basic component to improve development efficiency.

# API

```js
    /**
     *
     * @param object The object to be hooked, events added to this object will be hooked.
     * @param addEventListenerAttributeName If callbacks are set using properties,
     * @param addEventListenerMethodName If event listeners are added using methods, what is the name of this method? The default value is addEventListener.
     * @param eventNameArray { string | Array } The name of the event to be hooked, can be a single string representing a single event, or an array of strings representing multiple events.
     * @param eventListenerHookFunc The hook logic to be added, before executing the hooked event listener each time the hooked event is triggered, this function will be executed first. This method needs to return a value that can be converted to true,
     *                       only then will the hooked event listener function be executed, otherwise it will not be executed.
     */
    constructor(object, addEventListenerAttributeName, addEventListenerMethodName = "addEventListener", eventNameArray, eventListenerHookFunc) {
      // ...
    }
     
```

## Example

The usage in a Tampermonkey script is roughly as follows:

```js
// Lurk in advance, the logic given later will be put in when the event listener is added, usually relying on tools like Tampermonkey scripts to inject into the head of the normal page to execute first
(() => {
    const fooBtnElement = document.getElementById("foo-btn");
    const hookFunc = function () {
        alert("Hook logic executed!");
        return true;
        // return false;
    };
    // Indicates that this element's
    new HookEventListener(fooBtnElement, "onclick", "addEventListener", ["click"], hookFunc).addHook();
})();
```

The code of the website developer in the page is like this and will be hooked by the previous code:

```js
// Normal code, just add events normally, but it will be caught by the hook added before and quietly execute the hook logic first, and then execute the event callback method specified here
const elementById = document.getElementById("foo-btn");
const eventFunc = function () {
    alert("Button clicked!");
};
// elementById.addEventListener("click", eventFunc);
elementById.onclick = eventFunc;
```

## TODO
For DOM elements that bind events directly in the <HTMLElement> tag, it should also be possible to hook them.

## Reverse Engineering Technical Exchange Group

Scan to join the reverse engineering technical exchange group:

<img src="./README.assets/image-20241016230653669.png" style="width: 200px">

If the group QR code has expired, you can add my personal WeChat and send [Reverse Engineering Group] to invite you to the group:

<img src="./README.assets/image-20231030132026541-7614065.png" style="width: 200px">

[Click here](https://t.me/jsreijsrei) or scan to join the TG exchange group:

<img src="./README.assets/image-20241016231143315.png" style="width: 200px">

Regarding the link you mentioned, I encountered some issues while trying to parse the webpage. This could be due to the link itself or network-related problems. I suggest checking the legitimacy of the web link and trying again if necessary. If you don't need the content of this specific link, feel free to ask any other questions you may have.

