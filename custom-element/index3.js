class MyDom extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<h1>hello custom elements</h1>';
  }

  disconnectedCallback() {
    console.log('Custom square element removed from page.');
  }
  
  adoptedCallback() {
    console.log('Custom square element moved to new page.');
  }

  static get observedAttributes() {
    return ['country'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name + ':' + newValue);
  }
}

customElements.define('my-dom', MyDom);
// var md = new MyDom();
// md.setAttribute('test', 'nope');
// md.setAttribute('country', 'UK'); 