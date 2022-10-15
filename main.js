/**
 * 用于Hook事件监听器，作为JS逆向开发基础组件，为更高级的功能做支撑
 */
class HookEventListener {

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
        this.object = object;
        this.addEventListenerAttributeName = addEventListenerAttributeName;
        this.addEventListenerMethodName = addEventListenerMethodName;
        this.eventNameArray = eventNameArray;
        this.eventListenerHookFunc = eventListenerHookFunc;

        // 事件名称和对应的Hook函数的对应关系
        this.eventNameToHookFuncMap = new Map();
    }

    /**
     * 根据传递的参数增加Hook
     */
    addHook() {

        // 属性名设置Hook的情况
        if (this.addEventListenerAttributeName) {
            this.addHookByAttributeName();
        }

        // 根据方法名来添加Hook
        if (this.addEventListenerMethodName) {
            this.addHookByMethodName();
        }
    }

    /**
     * 根据能够设置事件监听器的属性名来添加Hook，这样子后面使用这个属性来设置事件监听器的时候就会被拦截到
     */
    addHookByAttributeName() {
        const _this = this;
        // 通过属性设置
        Object.defineProperty(this.object, this.addEventListenerAttributeName, {
            set(eventListenerCallbackFunc) {
                // 把Hook描述符直接删除掉
                delete _this.object[_this.addEventListenerAttributeName];
                // 然后把新的值给赋值上，赋值的时候会把传入的参数包一层，悄悄的先执行Hook函数
                _this.object[_this.addEventListenerAttributeName] = function () {

                    // 执行回调函数
                    try {
                        const isContinue = _this.eventListenerHookFunc.apply(_this.object, arguments);
                        if (!isContinue) {
                            return;
                        }
                    } catch (e) {
                        console.error(e);
                    }

                    // 执行原来的函数
                    return eventListenerCallbackFunc.apply(_this.object, arguments)
                }
                // 把属性描述再添加上，这样当被多次赋值的时候也能够一直Hook得住
                _this.addHookByAttributeName();
            }, // 要能够删除，支持反复Hook
            configurable: true,
        });
    }

    /**
     * 根据方法名添加Hook
     */
    addHookByMethodName() {

        // 注册事件回调函数
        if (typeof this.eventNameArray === "string") {
            this.eventNameToHookFuncMap.set(this.eventNameArray, this.eventListenerHookFunc);
        } else if (Array.isArray(this.eventNameArray)) {
            for (let eventName of this.eventNameArray) {
                this.eventNameToHookFuncMap.set(eventName, this.eventListenerHookFunc);
            }
        } else {
            return;
        }

        // 避免重复Hook，一个元素搞一次就行了，后面的就只需要注册就可以了
        const hookDoneFlagName = "_cc11001100_event_listener_hook";
        if (this.object[this.addEventListenerMethodName][hookDoneFlagName]) {
            return;
        }
        this.object[this.addEventListenerMethodName][hookDoneFlagName] = true;

        // 为事件增加Hook
        const oldAddEventListenerMethod = this.object[this.addEventListenerMethodName];
        const _this = this;
        this.object[this.addEventListenerMethodName] = function () {

            // 不支持的调用约定，无法Hook，让其走本来的逻辑
            if (arguments.length < 2) {
                // TODO 2022-10-16 02:22:45 错误提示
                return oldAddEventListenerMethod.apply(_this.object, arguments);
            }

            let [eventName, eventListenerFunc] = arguments;
            // 把原本的函数包一层
            const oldEventFunc = eventListenerFunc;
            eventListenerFunc = function () {

                try {
                    if (_this.eventNameToHookFuncMap.has(eventName)) {
                        const isContinue = _this.eventNameToHookFuncMap.get(eventName).apply(_this.object, arguments);
                        if (!isContinue) {
                            return;
                        }
                    }
                } catch (e) {
                    console.error(e);
                }

                return oldEventFunc.apply(_this.object, arguments);
            }
            arguments[1] = eventListenerFunc;

            return oldAddEventListenerMethod.apply(_this.object, arguments);
        };
    }

}



