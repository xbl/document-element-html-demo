// Deprecated
var MyElement = document.registerElement("my-element", {
  prototype: Object.create(HTMLElement.prototype, {
    createdCallback: {
      value: function() {
        this.innerHTML = '<h1>hi</h1>';
        console.log("here I am ^_^ ");
        console.log("with content: ", this.textContent);
      }
    },
    attachedCallback: {
      value: function() {
        console.log("live on DOM ;-) ");
      }
    },
    detachedCallback: {
      value: function() {
        console.log("leaving the DOM :-( )");
      }
    },
    attributeChangedCallback: {
      value: function(name, previousValue, value) {
        if (previousValue == null) {
          console.log("got a new attribute ", name, " with value ", value);
        } else if (value == null) {
          console.log(
            "somebody removed ",
            name,
            " its value was ",
            previousValue
          );
        } else {
          console.log(name, " changed from ", previousValue, " to ", value);
        }
      }
    }
  })
});
