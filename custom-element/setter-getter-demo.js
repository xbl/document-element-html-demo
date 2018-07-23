const obj = {
    data: {
        name: '谢小呆',
        age: 2,
        children: {
            name: 'hello',
            age: 1
        }
    }
};


const register = function(obj) {
    Object.keys(obj).forEach((protoName) => {
        obj['_' + protoName] = obj[protoName];

        Object.defineProperty(obj, protoName, {
            set: function(newVal) {
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
register(obj.data);
obj.data.children.age = 3
console.log(obj.data.children);