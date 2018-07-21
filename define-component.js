(function(window) {
    const defineComponent = function (componentClazz) {
        const ElementTemplate = class extends HTMLElement {}
        const dom = new componentClazz();
        ElementTemplate.prototype.connectedCallback = function() {
            const documentFlagment = strToHtml(dom.template.trim());
            registerDefineProperty(dom);
            watcherData(documentFlagment, dom);
            this.appendChild(documentFlagment);
            bindEvent(this, dom);
        }
    
        ElementTemplate.observedAttributes = componentClazz.observedAttributes;
        ElementTemplate.prototype.attributeChangedCallback = function() {
            dom.attributeChangedCallback.apply(this, arguments);
        }
        const tagName = dom.tagName || getTagNameByClazzName(componentClazz.name);
        customElements.define(tagName, ElementTemplate);
    };
    
    const getTagNameByClazzName = function (clazzName) {
        return clazzName
                .replace(/[A-Z]/g, (match) => '-' + match.toLowerCase())
                .slice(1);
    };
    
    const strToHtml = function(str) {
        const template = document.createElement('template');
        template.innerHTML = str;
        return template.content;
    };
    
    const eventListener = event => event.currentTarget.events[event.type](event);
    
    const bindEvent = function(documentFragment, context) {
        documentFragment.childNodes.forEach((node) => {
            if (!node.tagName) return ;
            bindEvent(node, context);
            const { attributes } = node;
            for (let i = 0; i < attributes.length; i++) {
                let { name } = attributes[i];
                if (!name.startsWith('@')) continue;
                const methodName = node.getAttribute(name);
                name = name.slice(1);
                if (!node.events) {
                  node.events = {};
                }
                node.events[name] = function (event) {
                  if (context.methods) context.methods[methodName].call(context, event);
                };
                node.addEventListener(name, eventListener);
            }
        });
    };
    
    const strTemplateRegExp = /{{(.*)}}/g;
    
    const watcherData = function(documentFragment, context) {
        documentFragment.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const strTemplate = node.nodeValue;
                if (strTemplateRegExp.test(strTemplate)) {
                    strTemplate.replace(strTemplateRegExp, function(match, expression) {
                        console.log(arguments)
                        const protoNameArr = Object.keys(context.data);
                        const keys = protoNameArr.join(',');
                        const evalFn = new Function(`{${keys}}`, `return ${expression}`);
                        const refreshDom = function () {
                            node.nodeValue = strTemplate.replace(match, evalFn(context.data));
                        };
                        refreshDom();
                        protoNameArr.forEach((protoName) => {
                            if (!expression.includes(protoName)) return ;
                            let refreshDomArr = watcher[protoName];
                            if(!refreshDomArr) {
                                refreshDomArr = watcher[protoName] = [];
                            }
                            refreshDomArr.push(refreshDom);
                        });
                    });
                }
            }
            watcherData(node, context);
        });
    };
    
    const watcher = {};
    
    const registerDefineProperty = function(context) {
        Object.keys(context.data()).forEach((protoName) => {
            context.data['_' + protoName] = context.data()[protoName];
            Object.defineProperty(context.data, protoName, {
                set: function(newVal) {
                    if (context.data['_' + protoName] === newVal) return;
                    console.log(newVal)
                    context.data['_' + protoName] = newVal;
                    // newVal is Object
                    if(newVal instanceof Object)
                        register(newVal);
                    const refreshDomArr = watcher[protoName];
                    if(!refreshDomArr)
                        return ;
                    refreshDomArr.forEach((callback) => callback());

                },
                get: function() {
                    return context.data['_' + protoName];
                },
                enumerable: true,
                configurable: true
            });
            if(context.data[protoName] instanceof Object)
                register(context.data[protoName]);
        });
    };

    const register = function(obj) {
        Object.keys(obj).forEach((protoName) => {
            obj['_' + protoName] = obj[protoName];

            Object.defineProperty(obj, protoName, {
                set: function(newVal) {
                    if (obj['_' + protoName] === newVal) return;
                    obj['_' + protoName] = newVal;
                    console.log(newVal);
                },
                get: function() {
                    return obj['_' + protoName];
                },
                enumerable: true,
                configurable: true
            });
            if(obj[protoName] instanceof Object)
                register(obj[protoName]);
        });
    };

    window.defineComponent = defineComponent;
})(window);