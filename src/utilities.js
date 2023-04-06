export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`odihnit ${ms / 1000}sec`);
    }, ms);
  });
}

export function $(selector) {
  return document.querySelector(selector);
}

export function debounce(fn, ms) {
  let timer; // closure
  // console.warn("debounce", fn, ms);
  return function () {
    console.warn("inner fn", this);
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      console.info("timeout", arguments);
      // call back
      //fn(e);
      // fn.call(this, e);
      //fn.apply(this, arguments);
      fn.apply(context, args);
    }, ms);
  };
}
