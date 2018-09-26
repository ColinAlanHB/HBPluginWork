!function(){"use strict";function t(e,o){function i(t,e){return function(){return t.apply(e,arguments)}}var r;if(o=o||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=o.touchBoundary||10,this.layer=e,this.tapDelay=o.tapDelay||200,this.tapTimeout=o.tapTimeout||700,!t.notNeeded(e)){for(var a=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],c=this,s=0,u=a.length;u>s;s++)c[a[s]]=i(c[a[s]],c);n&&(e.addEventListener("mouseover",this.onMouse,!0),e.addEventListener("mousedown",this.onMouse,!0),e.addEventListener("mouseup",this.onMouse,!0)),e.addEventListener("click",this.onClick,!0),e.addEventListener("touchstart",this.onTouchStart,!1),e.addEventListener("touchmove",this.onTouchMove,!1),e.addEventListener("touchend",this.onTouchEnd,!1),e.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(e.removeEventListener=function(t,n,o){var i=Node.prototype.removeEventListener;"click"===t?i.call(e,t,n.hijacked||n,o):i.call(e,t,n,o)},e.addEventListener=function(t,n,o){var i=Node.prototype.addEventListener;"click"===t?i.call(e,t,n.hijacked||(n.hijacked=function(t){t.propagationStopped||n(t)}),o):i.call(e,t,n,o)}),"function"==typeof e.onclick&&(r=e.onclick,e.addEventListener("click",function(t){r(t)},!1),e.onclick=null)}}var e=navigator.userAgent.indexOf("Windows Phone")>=0,n=navigator.userAgent.indexOf("Android")>0&&!e,o=/iP(ad|hone|od)/.test(navigator.userAgent)&&!e,i=o&&/OS 4_\d(_\d)?/.test(navigator.userAgent),r=o&&/OS [6-7]_\d/.test(navigator.userAgent),a=navigator.userAgent.indexOf("BB10")>0;t.prototype.needsClick=function(t){switch(t.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(t.disabled)return!0;break;case"input":if(o&&"file"===t.type||t.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(t.className)},t.prototype.needsFocus=function(t){switch(t.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!n;case"input":switch(t.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!t.disabled&&!t.readOnly;default:return/\bneedsfocus\b/.test(t.className)}},t.prototype.sendClick=function(t,e){var n,o;document.activeElement&&document.activeElement!==t&&document.activeElement.blur(),o=e.changedTouches[0],n=document.createEvent("MouseEvents"),n.initMouseEvent(this.determineEventType(t),!0,!0,window,1,o.screenX,o.screenY,o.clientX,o.clientY,!1,!1,!1,!1,0,null),n.forwardedTouchEvent=!0,t.dispatchEvent(n)},t.prototype.determineEventType=function(t){return n&&"select"===t.tagName.toLowerCase()?"mousedown":"click"},t.prototype.focus=function(t){var e;o&&t.setSelectionRange&&0!==t.type.indexOf("date")&&"time"!==t.type&&"month"!==t.type?(e=t.value.length,t.setSelectionRange(e,e)):t.focus()},t.prototype.updateScrollParent=function(t){var e,n;if(e=t.fastClickScrollParent,!e||!e.contains(t)){n=t;do{if(n.scrollHeight>n.offsetHeight){e=n,t.fastClickScrollParent=n;break}n=n.parentElement}while(n)}e&&(e.fastClickLastScrollTop=e.scrollTop)},t.prototype.getTargetElementFromEventTarget=function(t){return t.nodeType===Node.TEXT_NODE?t.parentNode:t},t.prototype.onTouchStart=function(t){var e,n,r;if(t.targetTouches.length>1)return!0;if(e=this.getTargetElementFromEventTarget(t.target),n=t.targetTouches[0],o){if(r=window.getSelection(),r.rangeCount&&!r.isCollapsed)return!0;if(!i){if(n.identifier&&n.identifier===this.lastTouchIdentifier)return t.preventDefault(),!1;this.lastTouchIdentifier=n.identifier,this.updateScrollParent(e)}}return this.trackingClick=!0,this.trackingClickStart=t.timeStamp,this.targetElement=e,this.touchStartX=n.pageX,this.touchStartY=n.pageY,t.timeStamp-this.lastClickTime<this.tapDelay&&t.preventDefault(),!0},t.prototype.touchHasMoved=function(t){var e=t.changedTouches[0],n=this.touchBoundary;return Math.abs(e.pageX-this.touchStartX)>n||Math.abs(e.pageY-this.touchStartY)>n?!0:!1},t.prototype.onTouchMove=function(t){return this.trackingClick?((this.targetElement!==this.getTargetElementFromEventTarget(t.target)||this.touchHasMoved(t))&&(this.trackingClick=!1,this.targetElement=null),!0):!0},t.prototype.findControl=function(t){return void 0!==t.control?t.control:t.htmlFor?document.getElementById(t.htmlFor):t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},t.prototype.onTouchEnd=function(t){var e,a,c,s,u,l=this.targetElement;if(!this.trackingClick)return!0;if(t.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(t.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=t.timeStamp,a=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,r&&(u=t.changedTouches[0],l=document.elementFromPoint(u.pageX-window.pageXOffset,u.pageY-window.pageYOffset)||l,l.fastClickScrollParent=this.targetElement.fastClickScrollParent),c=l.tagName.toLowerCase(),"label"===c){if(e=this.findControl(l)){if(this.focus(l),n)return!1;l=e}}else if(this.needsFocus(l))return t.timeStamp-a>100||o&&window.top!==window&&"input"===c?(this.targetElement=null,!1):(this.focus(l),this.sendClick(l,t),o&&"select"===c||(this.targetElement=null,t.preventDefault()),!1);return o&&!i&&(s=l.fastClickScrollParent,s&&s.fastClickLastScrollTop!==s.scrollTop)?!0:(this.needsClick(l)||(t.preventDefault(),this.sendClick(l,t)),!1)},t.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},t.prototype.onMouse=function(t){return this.targetElement?t.forwardedTouchEvent?!0:t.cancelable&&(!this.needsClick(this.targetElement)||this.cancelNextClick)?(t.stopImmediatePropagation?t.stopImmediatePropagation():t.propagationStopped=!0,t.stopPropagation(),t.preventDefault(),!1):!0:!0},t.prototype.onClick=function(t){var e;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===t.target.type&&0===t.detail?!0:(e=this.onMouse(t),e||(this.targetElement=null),e)},t.prototype.destroy=function(){var t=this.layer;n&&(t.removeEventListener("mouseover",this.onMouse,!0),t.removeEventListener("mousedown",this.onMouse,!0),t.removeEventListener("mouseup",this.onMouse,!0)),t.removeEventListener("click",this.onClick,!0),t.removeEventListener("touchstart",this.onTouchStart,!1),t.removeEventListener("touchmove",this.onTouchMove,!1),t.removeEventListener("touchend",this.onTouchEnd,!1),t.removeEventListener("touchcancel",this.onTouchCancel,!1)},t.notNeeded=function(t){var e,o,i,r;if("undefined"==typeof window.ontouchstart)return!0;if(o=+(/Chrome\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1]){if(!n)return!0;if(e=document.querySelector("meta[name=viewport]")){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(o>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(a&&(i=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),i[1]>=10&&i[2]>=3&&(e=document.querySelector("meta[name=viewport]")))){if(-1!==e.content.indexOf("user-scalable=no"))return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===t.style.msTouchAction||"manipulation"===t.style.touchAction?!0:(r=+(/Firefox\/([0-9]+)/.exec(navigator.userAgent)||[,0])[1],r>=27&&(e=document.querySelector("meta[name=viewport]"),e&&(-1!==e.content.indexOf("user-scalable=no")||document.documentElement.scrollWidth<=window.outerWidth))?!0:"none"===t.style.touchAction||"manipulation"===t.style.touchAction?!0:!1)},t.attach=function(e,n){return new t(e,n)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return t}):"undefined"!=typeof module&&module.exports?(module.exports=t.attach,module.exports.FastClick=t):window.FastClick=t}();

if (typeof Object.assign != 'function') {
  Object.assign = function(target) {
    'use strict';
    if (target == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    target = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source != null) {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
    }
    return target;
  };
}

var isPhone = !!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var isAndroid = (window.navigator.userAgent.indexOf('Android') >= 0) ? true : false;

document.addEventListener('DOMContentLoaded', function() {
  if (window.FastClick) window.FastClick.attach(document.body);
}, false);

;(function (window, undefined) {
  var corjs = {
    ready: function (cb) {           
      setTimeout(function () {
        if (window.corWidgetOne === undefined) {
          !window.isPC && initCorNative();
          window.isPC = true;
          cb();
        }
        
      }, 250);
      
      var oldCb = window.corOnload;
      if (typeof oldCb === 'function') {
        window.corOnload = function () {
          oldCb();
          cb();
        }
        return;
      }
      window.corOnload = cb;
    },

    setLocVal: function (key, val) {
      if (window.localStorage) {
        return window.localStorage.setItem(key, val);
      } else {
        console.log("浏览器不支持localStorage");
      }
    },
    //本地取值
    getLocVal: function (key) {
      return window.localStorage.getItem(key);
    },
    //清除本地值
    removeLocVal: function (key) {
      if (window.localStorage) {
        window.localStorage.removeItem(key);
      } else {
        console.log("浏览器不支持localStorage");
      }
    },
    //清除所有存储值
    getLocValKey: function () {
      if (window.localStorage) {
        var locArry = [];
        console.log(localStorage.length);
        for (var i = 0; i < window.localStorage.length; i++) {
          locArry.push(window.localStorage.key(i));
        }
        return locArry;
      } else {
        console.log("浏览器不支持localStorage");
      }
    },
    //清除所有存储值
    clearLocVal: function () {
      if (window.localStorage) {
        window.localStorage.clear();
      } else {
        console.log("浏览器不支持localStorage");
      }
    },

    //js基础能库
    //去掉字符串首尾空格
    trim: function (str) {
      if (String.prototype.trim) {
        return str == null ? "" : String.prototype.trim.call(str);
      } else {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      }
    },
    //去掉字符串所有空格
    trimAll: function (str) {
      return str.replace(/\s*/g, '');
    },
    //是否为数组
    isArray: function (obj) {
      if (Array.isArray) {
        return Array.isArray(obj);
      } else {
        return obj instanceof Array;
      }
    },
    //是否为对象{}
    isObject: function (obj) {
      if (typeof (obj) == "object" && !Array.isArray(obj)) {
        return true
      } else {
        return false
      }
    },
    //获取dom元素
    getDom: function (id) {
      return document.getElementById(id);
    },
    dom: function (el, selector) {
      if (arguments.length === 1 && typeof arguments[0] == 'string') {
        if (document.querySelector) {
          return document.querySelector(arguments[0]);
        }
      } else if (arguments.length === 2) {
        if (el.querySelector) {
          return el.querySelector(selector);
        }
      }
    },
    //获取dom元素的第一个子元素
    first: function (el) {
      var el = document.getElementById(el);
      if (arguments.length === 1) {
        return el.children[0];
      }
    },
    //选择dom元素的最后一个子元素
    last: function (el) {
      var el = document.getElementById(el);
      if (arguments.length === 1) {
        var children = el.children;
        return children[children.length - 1];
      }
    },
    //选择第几个子元素
    eq: function (el, index) {
      var el = document.getElementById(el);
      return this.dom(el, ':nth-child(' + index + ')');
    },
    //选择相邻的前一个元素
    prev: function (el) {
      var el = document.getElementById(el);
      var node = el.previousSibling;
      if (node.nodeType && node.nodeType === 3) {
        node = node.previousSibling;
        return node;
      }
    },
    //选择相邻的后一个元素
    next: function (el) {
      var el = document.getElementById(el);
      var node = el.nextSibling;
      if (node.nodeType && node.nodeType === 3) {
        node = node.nextSibling;
        return node;
      }
    },
    //移除dom元素
    remove: function (el) {
      var el = document.getElementById(el);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
    //获取或设置DOM元素的属性
    attr: function (el, name, value) {
      var el = document.getElementById(el);
      if (arguments.length == 2) {
        return el.getAttribute(name);
      } else if (arguments.length == 3) {
        el.setAttribute(name, value);
        return el;
      }
    },
    //移除dom元素属性
    removeAttr: function (el, name) {
      var el = document.getElementById(el);
      if (arguments.length === 2) {
        el.removeAttribute(name);
      }
    },
    //DOM元素是否含有某个class
    hasCls: function (el, cls) {
      var el = document.getElementById(el);
      if (el.className.indexOf(cls) > -1) {
        return true;
      } else {
        return false;
      }
    },
    //DOM元素增加class属性
    addCls: function (el, cls) {
      var el = document.getElementById(el);
      if ('classList' in el) {
        el.classList.add(cls);
      } else {
        var preCls = el.className;
        var newCls = preCls + ' ' + cls;
        el.className = newCls;
      }
      return el;
    },
    //DOM元素移除class属性
    removeCls: function (el, cls) {
      var el = document.getElementById(el);
      if ('classList' in el) {
        el.classList.remove(cls);
      } else {
        var preCls = el.className;
        var newCls = preCls.replace(cls, '');
        el.className = newCls;
      }
      return el;
    },
    //切换指定的className
    toggleCls: function (el, cls) {
      var el = document.getElementById(el);
      if ('classList' in el) {
        el.classList.toggle(cls);
      } else {
        if (this.hasCls(el, cls)) {
          this.removeCls(el, cls);
        } else {
          this.addCls(el, cls);
        }
      }
      return el;
    },
    //获取或设置表单元素的值
    val: function (el, val) {
      var el = document.getElementById(el);
      if (arguments.length === 1) {
        switch (el.tagName) {
          case 'SELECT':
            var value = el.options[el.selectedIndex].value;
            return value;
            break;
          case 'INPUT':
            return el.value;
            break;
          case 'TEXTAREA':
            return el.value;
            break;
        }
      }
      if (arguments.length === 2) {
        switch (el.tagName) {
          case 'SELECT':
            el.options[el.selectedIndex].value = val;
            return el;
            break;
          case 'INPUT':
            el.value = val;
            return el;
            break;
          case 'TEXTAREA':
            el.value = val;
            return el;
            break;
        }
      }
    },
    //在DOM元素内部，首个子元素前插入HTML字符串
    prepend: function (el, html) {
      var el = document.getElementById(el);
      el.insertAdjacentHTML('afterbegin', html);
      return el;
    },
    //在DOM元素内部，最后一个子元素后面插入HTML字符串
    append: function (el, html) {
      var el = document.getElementById(el);
      el.insertAdjacentHTML('beforeend', html);
      return el;
    },
    //在DOM元素前面插入HTML字符串
    before: function (el, html) {
      var el = document.getElementById(el);
      el.insertAdjacentHTML('beforebegin', html);
      return el;
    },
    //在DOM元素后面插入HTML字符串
    after: function (el, html) {
      var el = document.getElementById(el);
      el.insertAdjacentHTML('afterend', html);
      return el;
    },
    //获取或设置DOM元素的innerHTML
    html: function (el, html) {
      var el = document.getElementById(el);
      if (arguments.length === 1) {
        return el.innerHTML;
      } else if (arguments.length === 2) {
        el.innerHTML = html;
        return el;
      }
    },
    //设置或者获取元素的文本内容
    text: function (el, txt) {
      var el = document.getElementById(el);
      if (arguments.length === 1) {
        return el.textContent;
      } else if (arguments.length === 2) {
        el.textContent = txt;
        return el;
      }
    },
    //获取元素在页面中的位置与宽高
    offset: function (el) {
      var el = document.getElementById(el);
      var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
      var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
      var rect = el.getBoundingClientRect();
      return {
        l: rect.left + sl,
        t: rect.top + st,
        w: el.offsetWidth,
        h: el.offsetHeight
      };
    },
    //获取网页高度
    getHeight: function () {
      return document.documentElement.clientHeight;
    },
    //获取网页高度
    getWidth: function () {
      return document.body.clientWidth;
    },
    //设置所传入的DOM元素的样式，可传入多条样式
    css: function (el, css) {
      var el = document.getElementById(el);
      if (typeof css == 'string' && css.indexOf(':') > 0) {
        el.style && (el.style.cssText += ';' + css);
      }
    },
    //获取指定DOM元素的指定属性的完整的值，如20px
    cssVal: function (el, prop) {
      var el = document.getElementById(el);
      if (arguments.length === 2) {
        var computedStyle = window.getComputedStyle(el, null);
        return computedStyle.getPropertyValue(prop);
      }
    },
    //将标准的JSON 对象转换成字符串格式
    jsonToStr: function (json) {
      if (typeof json === 'object') {
        return JSON && JSON.stringify(json);
      }
      return json;
    },
    //将JSON字符串转换成JSON对象
    strToJson: function (str) {
      if (typeof str === 'string') {
        return JSON && JSON.parse(str);
      }
    },
    //获取当前日期时间 0：日期时间  1：日期  2时间
    getDate: function (type) {
      var time;
      switch (type) {
        case 0:
          time = this.format('yyyy-MM-dd hh:mm:ss');
          break;
        case 1:
          time = this.format('yyyy-MM-dd');
          break;
        case 2:
          time = this.format('hh:mm:ss');
          break;
        default:
          "";
          break
      }
      return time;
    },
    format: function (format) {
      var o = {
        "M+": new Date().getMonth() + 1, //month 
        "d+": new Date().getDate(), //day 
        "h+": new Date().getHours(), //hour 
        "m+": new Date().getMinutes(), //minute 
        "s+": new Date().getSeconds(), //second 
        "q+": Math.floor((new Date().getMonth() + 3) / 3), //quarter 
        "S": new Date().getMilliseconds() //millisecond 
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (new Date().getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    },
    //获取两个日期的天数差
    getDayNum: function (strDateStart, strDateEnd) {
      var strSeparator = "-"; //日期分隔符
      var oDate1;
      var oDate2;
      var iDays;
      oDate1 = strDateStart.split(strSeparator);
      oDate2 = strDateEnd.split(strSeparator);
      var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
      var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
      iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
      return iDays == 0 ? "1" : iDays;
    },
    //是否为手机号码
    isTelPhone: function (mobile) {
      if ((/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
        return true;
      } else {
        return false;
      }
    },
    //是否为固定电话
    isTel: function (mobile) {
      if (/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(mobile)) {
        return true;
      } else {
        return false;
      }
    },
    //是否为邮箱
    isEmail: function (email) {
      var sReg = /[_a-zA-Z\d\-\.]+@[_a-zA-Z\d\-]+(\.[_a-zA-Z\d\-]+)+$/;
      if (sReg.test(email)) {
        return true;
      } else {
        return false;
      }
    },
    //获取滚动条滚动距离
    getScrollTop: function () {
      return document.documentElement.scrollTop || document.body.scrollTop;
    },
    //滚动条回到顶部
    goScrollTop: function () {
      cancelAnimationFrame(timer);
      timer = requestAnimationFrame(function fn() {
        var oTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (oTop > 0) {
          scrollBy(0, -20);
          timer = requestAnimationFrame(fn);
        } else {
          cancelAnimationFrame(timer);
        }
      });
    },
    //android,ios传参数转化
    checkParams: function (param) {
      if (isAndroid) {
        return JSON.stringify(param);
      }
      return param;
    },
    /*转换参数为对象*/
    parseParams: function (param) {
      if (typeof (param) == "object") {
        return param;
      } else {
        return JSON.parse(param);
      }
    },
    //取文件类型字符串后缀
    suffix: function (str) {
      var str = str.split(".");
      return str[str.length - 1];
    },
    //获取当前文件目录
    currentDir: function () {
      return location.pathname.substring(0, location.pathname.lastIndexOf('/'));
    }
  }
  window.corJS = corjs;

  window.corOnload = function () {
    if(isPhone){
      document.getElementsByTagName("body")[0].className += " uh_ios7";
    }
    window.corNative = Object.assign(window.corNative || {}, {
      openFloatWindow: function (params) {
        corWindow.openPopover(params)
      },
      openWindow: function (params) {
        if(isPhone){
          var typeIo = params.animID;
          if((params.flag==1024&&params.animID==0)){
            typeIo = 1;
          }
          if((params.flag==1024&&params.animID==2)){
            typeIo = 0;
          }
          corWindow.open({
              name:params.name,
              data: params.data,
              animID:typeIo||0,
              flag:params.flag||0
           });
        }else{
          var typeAn = params.animID;
          if(params.flag==1024&&params.animID==0){
            typeAn = 0;
          }
          if(params.flag==1024&&params.animID==2){
            typeAn = 2;
          }
          corWindow.open({
              name:params.name, 
              data: params.data,
              animID:typeAn,
              flag:params.flag||0
           });
        }
      },
      //该接口打开一个位于最上层的window
      openTopWin: function (params) {
        corWindow.openPresentWindow(params);
      },
      //关闭当前窗口
      closeWindow: function (params) {
        if(params == undefined || params==null || params ==""){
            corWindow.close({
              animID:"",
              animDuration:"300"
            })
        }else{
            corWindow.close({
              animID: params.animID || "",
              animDuration: params.animDuration || "300"
            })
        }
        
      },
      //移动当前窗口位置
      moveWindowToPosition: function (params) {
        corWindow.setWindowFrame(params);
      },
      //移动浮动窗口位置
      moveFloatWindowToPosition: function (params) {
        corWindow.beginAnimition();
        corWindow.setAnimitionDuration(params.animDuration || 300)
        corWindow.makeTranslation(params.x || 0, params.y || 0, params.z || 0)
        corWindow.commitAnimition();
      },
      //执行主窗口js脚本
      evaluateScriptInMain: function (params) {
        corWindow.evaluateScript({
          name:params.name, 
          type:0, 
          js:params.script
        });
      },
      //执行浮动窗口js脚本
      evaluateScriptInFloat: function (params) {
        corWindow.evaluatePopoverScript({
          windowName:params.mainName, 
          popName:params.frameName, 
          js:params.script
        });
      },
      //在多页面浮动窗口中执行js脚本
      evaluteMultiFWindowScript: function (params) {
        corWindow.evaluateMultiPopoverScript({
          windowName:params.mainName, 
          popName:params.frameName, 
          pageName:params.pageName, 
          js:params.script
        });
      },
      //设置浮动窗口是否显示
      setFloatWindowVisbility: function (frameName, visible) {
        corWindow.setPopoverVisibility(frameName, visible);
      },
      //关闭浮动窗口
      closeFloatWindow: function (frameName) {
        corWindow.closePopover(frameName)
      },
      //更改浮动窗口的位置和大小
      setFloatWindowFrame: function (params) {
        corWindow.setPopoverFrame(params);
      },
      //打开一个多页面浮动窗口
      openMultiFloatWindow: function (params) {
        corWindow.openMultiPopover(params);
        corWindow.cbOpenMultiPopover = function(optId,dataType,res){
          if(optId == 0){
                  if(dataType != 1){
                      processMultiPopover(new Error('multi popover error'));
                  }else{
                      processMultiPopover(null,res);
                  }
              }
          }
      },
      //关闭多页面浮动窗口
      closeMultiFloatWindow: function (MultiFrameName) {
        corWindow.closeMultiPopover(MultiFrameName);
      },
      //设置跳转到多浮动窗口的索引
      setSelectedInMultiFWindow: function (params) {
        corWindow.setSelectedPopOverInMultiWindow({
          name: params.name || "",
          index: params.index || ""
        });
      },
      //监听多浮动窗口滑动到当前子窗口的索引 
      onchangeInMultiFWindow:function(cb){
          processMultiPopover = function(err,res){
              var res = corJS.parseParams(res);
              cb(res.multiPopSelectedIndex);
          }
      },
      //是否禁止多浮动窗口滑动
      setMultiFWindowFlippingEnbaled:function(enable){
          corWindow.setMultilPopoverFlippingEnbaled(enable);
      },
      // 更改多页面浮动窗口的位置和大小
      setMultiFWindowFrame: function (params) {
        corWindow.setMultiPopoverFrame(params);
      },
      //置顶当前浮动窗口
      bringFloatWindowToFront: function () {
        corWindow.bringToFront();
      },
      //置底当前浮动窗口
      sendFloatWindowToBack: function () {
        corWindow.sendToBack()
      },
      //置顶指定浮动窗口
      bringFloatWindowToFrontByName: function (frameName) {
        corWindow.bringPopoverToFront(frameName)
      },
      //置底指定浮动窗口
      sendFloatWindowToBackByName: function (frameName) {
        corWindow.sendPopoverToBack(frameName)
      },
      //将指定窗口插入到另一窗口之上
      insertWinAboveWin: function (winName1, winName2) {
        corWindow.insertWindowAboveWindow(winName1, winName2)
      },
      //将指定窗口插入到另一窗口之下
      insertWinBelowWin: function (winName1, winName2) {
        corWindow.insertWindowBelowWindow(winName1, winName2)
      },
      //设置当前窗口显示和隐藏
      setWindowVisibility: function (visible) {
        corWindow.setWindowHidden(visible);
      },
      //打开侧滑窗口
      toggleSlidingWindow: function (type) {
        var params  = {
            mark:type,
            reload:0
        };
        corWindow.toggleSlidingWindow(params);
      },
      //设置侧滑窗口
      setSlidingWindow: function (params) {
        corWindow.setSlidingWindow(params);
      },
      //设置侧滑窗口是否可用
      setSlidingWindowEnabled: function (enable) {
        corWindow.setSlidingWindowEnabled(enable);
      },
      //设置多浮动窗口是否响应滑动事件
      setMultiFrameSwipe: function (enable) {
        corWindow.setMultilPopoverFlippingEnbaled(enable)
      },
      //注册全局消息
      setGlobalNotification: function (callBack) {
        corWindow.onGlobalNotification = function (msg) {
          callBack(msg);
        }
      },
      //发送全局消息
      postGlobalNotification: function (msg) {
        corWindow.postGlobalNotification(msg);
      },
      //窗口之间的通信 注册一个通信id
      subscribeChannelNotification: function (id, callBack) {
        corWindow[id] = function (msg) {
          callBack(msg)
        };
        corWindow.subscribeChannelNotification(id, id);
      },
      //窗口之间的通信  调用注册的通信id方法
      publishChannelNotification: function (id, msg) {
        corWindow.publishChannelNotification(id, msg);
      },
      //获取当前窗口处于前台还是后台
      getWinState: function () {
        return corWindow.getState();
      },
      //获取window的宽度
      getWinWidth: function () {
        return corWindow.getWidth();
      },
      //获取window的高度
      getWinHeight: function () {
        return corWindow.getHeight();
      },
      //获取侧滑窗口显示情况
      getSlideWinState: function () {
        return corWindow.getSlidingWindowState();
      },
      //获取界面之间传递的参数
      getParams: function () {
        var params = {};
        var loc = String(document.location);
        if (loc.indexOf("?") > 0) 
            loc = loc.substr(loc.indexOf('?') + 1);
        else 
            loc = uexWindow.getUrlQuery();
        if(loc){
            loc = String(loc);
            if(loc.indexOf("&")>0){
                var pieces = loc.split('&');
            }else{
                var pieces = [loc];
            }
        params.keys = [];
        for (var i = 0; i < pieces.length; i += 1) {
            var keyVal = pieces[i].split('=');
            params[keyVal[0]] = decodeURIComponent(keyVal[1]);
            params.keys.push(keyVal[0]);
        }}
        return params;
      },
      //弹出只有一个确定按钮的对话框
      alertDlg: function (params) {
        corWindow.alert(params);
      },
      //弹出至少包含一个至多包含3个按钮的对话框
      confirmDlg: function (parmas, callBack) {
        corWindow.confirm(parmas, function (index) {
          callBack(index);
        });
      },
      //弹出包含两个按钮且带输入框的对话框
      promptDlg: function (parmas, callBack) {
        corWindow.prompt(parmas, function (index, data) {
          callBack(index, data);
        });
      },
      //弹出消息提示框
      toastDlg: function (parmas) {
        corWindow.toast(parmas);
      },
      //关闭消息提示框
      closeToastDlg: function () {
        corWindow.closeToast()
      },
      //从界面底部弹出按钮列表
      actionSheetMenu: function (parmas, callBack) {
        corWindow.actionSheet(parmas, function (index) {
          callBack(index);
        })
      },
      //设置屏幕方向
      setOrientation: function (orientation) {
        corWindow.setOrientation(orientation);
      },
      //设置滚动条的显示和隐藏
      setWindowScrollbarVisiblity: function (visible) {
        corWindow.setWindowScrollbarVisible(visible);
      },
      //设置当前页面是否拦截某个按键
      setReportKey: function (keyCode, enable) {
        corWindow.setReportKey(keyCode, enable);
      },
      //弹出Android设备软键盘
      showKeyboard: function () {
        corWindow.showSoftKeyboard();
      },
      //关Android设备软键盘
      hideKeyboard: function () {
        corWindow.hideSoftKeyboard();
      },
      //设置左右手势的灵敏度
      setSwipeRate: function (rate) {
        corWindow.setSwipeRate(rate)
      },
      //发送消息到状态栏
      sendStatusBarNotification: function (title, msg) {
        corWindow.statusBarNotification(title, msg)
      },
      //设置状态条上字体的颜色
      setStatusBarTitleColor: function (color) {
        corWindow.setStatusBarTitleColor(color);
      },
      //动态加载自定义启动画面
      setLoadingImagePath: function (params) {
        var paramStr = JSON.stringify(params);
        corWindow.setLoadingImagePath(paramStr);
      },
      //是否跟随设备自动旋转
      setAutorotateEnable: function (enable) {
        corWindow.setAutorotateEnable(enable);
      },
      //开启或关闭当前window的硬件加速
      setHardwareEnable: function (enable) {
        corWindow.setHardwareEnable(enable);
      },
      //开启或关闭当前popover的硬件加速
      setPopHardwareEnable: function (name, flag) {
        corWindow.setPopHardwareEnable(name, flag);
      },
      //获取网页弹动状态
      getBounce: function () {
        return corWindow.getBounce();
      },
      //设置是否支持网页弹动
      setBounceEnabled: function (flag) {
        corWindow.setBounce(flag);
      },
      //隐藏弹动效果
      hiddenBounceView: function (type) {
        corWindow.hiddenBounceView(type);
      },
      //显示弹动效果
      showBounceView: function (params) {
        corWindow.showBounceView(params);
      },
      setBounceParams:function(params,callBack){
          corWindow.notifyBounceEvent(0,1);
          corWindow.showBounceView({
              type:"0",
              color:params.bgColor, 
              flag:1
            });
            corWindow.setBounceParams(0, params);
            corWindow.onBounceStateChange = function(state){
                if(state==0){
                    callBack();
                }
            }
      },
      resetBounce:function(type){
          corWindow.resetBounceView(type);
      },
      //重载当前页面
      refresh: function () {
        corWindow.reload();
      },
      //自动下拉刷新效果
      autoTopBounceRefresh: function () {
        corWindow.topBounceViewRefresh()
      },
      //隐藏状态栏
      hideStatusBar: function () {
        corWindow.hideStatusBar();
      },
      //显示状态栏
      showStatusBar: function () {
        corWindow.showStatusBar();
      },
      //设置当前页面是否支持手势侧滑关闭
      setSwipeWinCloseEnabled: function (type) {
        var params = {
          enable: type,
        }
        var paramStr = JSON.stringify(params);
        corWindow.setSwipeCloseEnable(paramStr);
      },
      //滑到顶部的监听方法，内容超过一屏时有效
      onScrollToTop: function (callBack) {
        corWindow.onSlipedUpEdge = function () {
          callBack();
        }
      },
      //滑到底部的监听方法，内容超过一屏时有效
      onScrollToBottom: function (callBack) {
        corWindow.onSlipedDownEdge = function () {
          callBack();
        }
      },
      //设置网页是否支持左右滑动的监听方法
      setSwipeWinEnabled: function (type) {
        var param = {
          isSupport: type
        }
        corWindow.setIsSupportSwipeCallback(param);
      },
      //向右滑动的监听方法
      onSwipeRight: function (callBack) {
        corWindow.onSwipeRight = function () {
          callBack();
        }
      },
      //向左滑动的监听方法
      onSwipeLeft: function (callBack) {
        corWindow.onSwipeLeft = function () {
          callBack();
        }
      },
      //监听返回键方法
      onKeyPressed: function (type,callBack) {
        corWindow.onKeyPressed = function (keyCode) {
          callBack(keyCode);
        }
        corWindow.setReportKey(0,type)
      },
      onStateChange:function(callBack){
          corWindow.onStateChange=function(state){
              callBack(state);
        }
      },
      systemName: corWidgetOne.platformName,
      systemType: corWidgetOne.getPlatform(),
      systemVersion: corWidgetOne.platformVersion,
      isFullScreen: !!corWidgetOne.isFullScreen,
      exitApp: function (hasPopover) {
        if (hasPopover !== true) {
          hasPopover = 0;
        }
        corWidgetOne.exit(hasPopover);
      },
      restartApp: corWidgetOne.restart,

      cleanMainWidgetCache: corWidgetOne.cleanCache,
      mainWidgetID: corWidgetOne.getMainWidgetId(),
      currentWidgetInfo: corWidgetOne.getCurrentWidgetInfo(),
      engineVersionCode: corWidgetOne.getEngineVersionCode(),
      getEngineVersion: function (format) {
        var semver = corWidgetOne.getEngineVersion();
        if (!format) return semver;

        var splits = semver.splits('-')[0]
          .splits('.');

        if (splits.length !== 3) {
          return semver;
        }

        var keys = ['major', 'minor', 'patch'];
        var releases = Object.create(null);
        keys.map(function (key, i) {
          releases[key] = splits[i];
        });

        var regx = /0(\.?x{1,2})\1?/g;
        var match = format.match(regx);
        if (!match) {
          return corWidgetOne.getEngineVersionCode().toString();
        }
        var f = match[1];
        var hasDot = f.indexOf('.') === 0;
        var l = f.length - (hasDot ? 1 : 0);

        keys.every(function (key, i) {
          var release = releases[key];
          if (i === 0 || release.length >= l) {
            return true;
          }
          for (var j = l - release.length; j > 0; j--) {
            release[key] = '0' + release;
          }
        });
      },

      launchIOSApp: function (urlScheme) {
        corWidget.loadApp(urlScheme);
      },
      installAndroidApp: function (path) {
        corWidget.installApp(path);
      },
      /**
       * 是否安装 App （Android 包名 或者 iOS URL Scheme）
       */
      isInstalledApp: function (name) {
        var json = JSON.stringify({
          appData: name
        });
        corWidget.isAppInstalled(json);
      },
      suspendAndroidApp: function () {
        corWidget.moveToBack();
      },
      setKeyboardMode: function (type) {
        type = type ? 1 : 0;
        corWidget.setKeyboardMode({
          mode: type
        });
      },
      getMBaasHost: corWidget.getMBaasHost,

      /**
       * 在当前widget加载一个子widget
       */
      launchWidget: function (id, options, cb) {
        if (typeof options === 'function') {
          cb = options;
          options = Object.create(null);
        }

        var undef;
        var onClosed = options.onClosed;
        var setting = {
          appId: id.toString(),
          animId: options.animateID || 5,
          animDuration: options.duration || 200,
          info: options.message,
          funcName: typeof onClosed === 'function' ?
            onClosed.name : undef
        };
        if (typeof cb === 'function') {
          options.onLoaded = cb;
        }
        corWidget.startWidget(setting, options.onLoaded);
      },
      /**
       * 退出一个子widget
       */
      closeWidget: function (options) {        
        var opt = Object.create(null);
        
        if (typeof options === 'string') {
          opt.resultInfo = options;
        } else {
          opt.resultInfo = options.message;
        }

        if (options.notDestoryed === true) {
          opt.finishMode = 1;
        } else {
          opt.finishMode = 0;
        }
        opt.appId = options.id || undefined;

        corWidget.finishWidget(opt);
      },
      removeWidget: function (id) {
        return corWidget.removeWidget(id);
      },
      updateWidget: function (err, next) {
        corWidget.checkUpdate(function (error, data) {
          if (!error && data.result == 0 && typeof next === 'function') {
            data.result = arguments[arguments.length];
            next(data);
            return;
          }
          if (typeof err === 'function') {
            err();
          }
        })
      },
      reloadWidget: function (id) {
        corWidget.reloadWidgetByAppId(id);
      },
      getMessageFromOpener: function () {
        return corWidget.getOpenerInfo();
      },
      closeWidgetLoading: function () {
        corWidget.closeLoading();
      },

      set pushEnable(flag) {
        var enable = flag ? 1 : 0;
        corWidget.setPushState(enable);
      },
      get pushEnable() {
        return corWidget.getPushState();
      },
      setPushUser: function (user) {
        corWidget.setPushInfo({
          userId: user.id,
          userName: user.name
        });
      },
      getPushData: function (isJSON) {
        var flag = isJSON ? 1 : 0;
        return corWidget.getPushInfo(flag);
      },
      set onPushNotified(cb) {
        corWidget.setPushNotifyCallback(cb);
        corJS.pushCallback = cb;       
      },
      requestAjax: function (params, callBack) {
        var timeout = params.timeout || 30000;
        var method = params.method ? params.method.toUpperCase() : 'GET';
        var url = params.url;

        var data = params.data;
        var headers = params.headers;
        var cb = params["__callback"] || callBack;        

        if (data) {            
          var queryStr = '';
          for (var key in data) {
            var value = data[key];
            queryStr += '&' + key+ "=" +value;
          }
          queryStr = queryStr.slice(1);

          if (method === 'GET') url += '?' + queryStr;
          else if (method === 'POST') data = queryStr;
        }

        var req = corXmlHttpMgr.create({
          method:method,
          url:url,
          timeout:timeout
        }); 

        if (method === 'POST') {
          var header = {
            "Content-Type": "application/x-www-form-urlencoded"
          };
          var hasSet = false;
          hasSet = corXmlHttpMgr.setHeaders(req, JSON.stringify(header));
          hasSet = corXmlHttpMgr.setHeaders(req, JSON.stringify(headers));
          
          if (data) corXmlHttpMgr.setBody(req, data);
        }        
        
        var onreadyStateChange = function (state, resStr, resCode, resInfo) {          
          if (state === 0 || typeof cb !== 'function') return;

          if (state === -1) {
             cb({
               status: false,
               data: resStr,
               errorMsg: resInfo ? resInfo.responseError : "请求失败"
             });
          }

          if (state === 1) {
            corXmlHttpMgr.close(req);
            if (resCode == 404 || resCode == 403 || resCode == 500 || resCode == 401) {
              cb({
                status: false,
                data: resStr,
                errorMsg: "请求失败,请检查服务"
              });
            }
            
            if (resCode == 200 || resCode == 304) {
              if (corJS.isArray(resStr) && corJS.isObject(resStr)) {
                resStr = JSON.stringify(resStr);
              }

              cb({
                status: true,
                data: resStr,
                errorMsg: "请求失败,请检查服务"
              });
            }
          }
        } 
        
        corXmlHttpMgr.send(req, 0, onreadyStateChange);
      }
    });
  };

  function initCorNative() {
    var nativeList = ["setBounceParams","onKeyPressed","getLoginInfo","setGlobalNotification","postGlobalNotification","subscribeChannelNotification","publishChannelNotification","setMultiFWindowFlippingEnbaled","onchangeInMultiFWindow","setWindowFrame","setFloatWindowFrame","setMultiFWindowFrame","bringFloatWindowToFront","sendFloatWindowToBack","bringFloatWindowToFrontByName","sendFloatWindowToBackByName","moveFloatWindowToPosition","setFloatWindowVisbility","setSlidingWindow","setSlidingWindowEnabled","toggleSlidingWindow","refresh","setSwipeWinEnabled","setBounceEnabled","setTopBounceRefresh","resetBounce","autoTopBounceRefresh","showStatusBar","hideStatusBar","onSwipeLeft","onSwipeRight","onScrollToTop","setOrientation","setWindowScrollbarVisiblity","sendStatusBarNotification","setLoadingImagePath","onSwipeMultiIndex", "onStateChange", "addNotification", "removeNotification", "cleanCache", "sendNotification","call", "sms", "mail", "openSystemContacts", "setStatusBarStyle", "getPhoneNumber", "setAppBadge","setStatusBarStyle", "showL oading", "closeLoading", "openDateTimePicker", "getPicture", "saveToAlbum", "showPhotos", "playVideo", "startRecord", "stopRecord", "playAudio", "playVideo", "setBounce", "removeAllPrefData", "removePrefData", "getPrefData", "setPrefData", "upload", "download", "appInstalled", "openApp", "installApp", "prevPage", "publishChannelNotification", "subscribeChannelNotification", "getPageParams", "getHtmlRootDir", "getStatusBarAppearance", "getScreenHeight", "getScreenWidth", "getConnectionType", "getDeviceToken", "getDeviceName", "getDeviceModel", "getDeviceId", "getSystemVersion", "getAppName", "getAppKey", "getAppVersion", "getSystemType","confirmDlg","confirmDlg","promptDlg","toastDlg","closeToastDlg","actionSheetMenu"]
    var nativeInfo = "此方法请在手机端调试";
    window.corNative = {
      //打开窗口
      openWindow: function (params) {
        window.parent.location.href = params.data;
      },
      //关闭界面
      closeWindow: function () {
        window.history.back();
      },
      //打开浮动窗口
      openFloatWindow: function (params) {
        if (params.w == "auto" || params.w == "" || params.w == null || params.w == undefined) {
          var w = corJS.getWidth();
        } else {
          var w = params.w;
        }
        if (params.h == "auto" || params.h == "" || params.h == null || params.h == undefined) {
          var h = corJS.getHeight() - params.y;
        } else {
          var h = params.h;
        }
        var iframe = document.createElement('iframe');
        iframe.id = params.name;
        iframe.src = params.url;
        iframe.name = params.name;
        iframe.width = w;
        iframe.height = h;
        iframe.frameBorder = "0"
        iframe.scrolling = "yes";
        iframe.style.position = "absolute";
        iframe.style.left = params.x + "px";
        iframe.style.zIndex = "999";
        iframe.style.top = params.y + "px";
        document.documentElement.appendChild(iframe);
      },
      //关闭浮动窗口
      closeFloatWindow: function (name) {
        document.getElementById(name).parentNode.removeChild(document.getElementById(name));
      },
      //打开多浮动窗口
      openMultiFloatWindow: function (params) {
        if (params.w == "auto" || params.w == "" || params.w == null || params.w == undefined) {
          var w = corJS.getWidth();
        } else {
          var w = params.w;
        }
        if (params.h == "auto" || params.h == "" || params.h == null || params.h == undefined) {
          var h = corJS.getHeight() - params.y;
        } else {
          var h = params.h;
        }
        frameList = params.content.content;
        for (var i = 0; i < frameList.length; i++) {
          var iframe = document.createElement('iframe');
          iframe.id = frameList[i].inPageName;
          iframe.src = frameList[i].inUrl;
          iframe.name = frameList[i].inPageName;
          iframe.width = w;
          iframe.height = h;
          iframe.frameBorder = "0"
          iframe.scrolling = "yes";
          iframe.style.position = "absolute";
          iframe.style.left = params.x + "px";
          iframe.style.zIndex = "10";
          iframe.style.top = params.y + "px";
          document.documentElement.appendChild(iframe);
        }
        if (params.indexSelected == undefined) {
          document.getElementById(frameList[0].inPageName).style.zIndex = "11";
        } else {
          document.getElementById(frameList[params.indexSelected].inPageName).style.zIndex = "11";
        }
      },
      //关闭多页浮动窗口
      closeMultiFloatWindow:function(name){
        for (var i = 0; i < frameList.length; i++) {
          document.getElementById(frameList[i].inPageName).parentNode.removeChild(document.getElementById(frameList[i].inPageName));
        }
      },
      //设置多浮动窗口索引
      setSelectedInMultiFWindow: function (params) {
        var nameP = frameList[params.index].inPageName;
        var arr = [];
        for (var i = 0; i < frameList.length; i++) {
          arr.push(parseInt(document.getElementById(frameList[i].inPageName).style.zIndex));
        }
        var zNum = Math.max.apply(null, arr);
        document.getElementById(nameP).style.zIndex = zNum + 1;
      },
      //主窗口调用浮动窗口
      evaluateScriptInFloat: function (params) {
        var ifreame = window.frames[params.frameName];
        if (ifreame != null && ifreame != undefined) {
          document.getElementById(params.frameName).contentWindow.eval(params.script);
        }
      },
      //浮动窗口执行主窗口方法
      evaluateScriptInMain: function (params) {
        window.parent.eval(params.script);
      },
      //执行多浮动窗口的脚本
      evaluteMultiFWindowScript: function (params) {
        document.getElementById(params.frameName).contentWindow.eval(params.script);
      },
      //滚动到底部监听
      onScrollToBottom:function(callBack){
        window.onscroll = function(){
          var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
          if(document.documentElement.scrollHeight == document.documentElement.clientHeight + scrollTop ) {
            callBack();
          }  
        }
      },
      //网络请求
      requestAjax: function (params,callBack) {
        var xmlHttp;
        if (window.ActiveXObject) {
          xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
          xmlHttp = new XMLHttpRequest();
        }
        var timeout = params.timeout || "30000"; //保存超时时间，默认30秒  
        var method = params.method ? params.method.toUpperCase() : 'GET';
        var requestDone = false;

        if (method == "POST") {
          var postData = params.data;
          postData = (function (obj) { // 转成post需要的字符串.
            var str = "";
            for (var prop in obj) {
              str += prop + "=" + obj[prop] + "&"
            }
            return str;
          })(postData);
          xmlHttp.open("POST", params.url);
          xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
          if (params.headers && params.headers != {}) {
            for (var key in params.headers) {
              xmlHttp.setRequestHeader(key, params.headers[key]);
            }
          }
          xmlHttp.send(postData);
        } else if (method == "GET") {
          var urlP = params.url;
          if (params.data && params.data != {}) {
            var newP = [];
            for (var key in params.data) {
              newP.push({
                keys: key,
                values: params.data[key]
              });
            }
            for (var i = 0; i < newP.length; i++) {
              if (i == 0) {
                urlP += "?" + newP[i].keys + "=" + newP[i].values
              } else {
                urlP += "&" + newP[i].keys + "=" + newP[i].values
              }
            }

            params.url = urlP;
          }
          xmlHttp.open("GET", params.url);
          xmlHttp.send(null);
        }
        var setTime = setTimeout(function () {
          requestDone = true;
          callBack({
            status: false,
            data: "",
            errorMsg: "请求超时"
          })
          xmlHttp.close();
        }, timeout);
        xmlHttp.onreadystatechange = function () {
          //响应成功,并且没有超时
          if (xmlHttp.readyState == 4 && !requestDone) {
            clearTimeout(setTime);
            if (xmlHttp.status == 200 || xmlHttp.status == 304) {
                callBack({
                  status: true,
                  data: xmlHttp.responseText,
                  errorMsg: ""
                })
            }
            if (xmlHttp.status == 404 || xmlHttp.status == 403 || xmlHttp.status == 500 || xmlHttp.status == 401) {
              callBack({
                status: false,
                data: "",
                errorMsg: "请求失败,请检查网络或服务"
              })
            }
          }
        }
      },
      alertDlg: function (params) {
        vm.$messagebox.alert(params.message, params.title);
      },
      getParams: function () {
        var params = {};
        var loc = String(document.location);
        if (loc.indexOf("?") > 0) 
            loc = loc.substr(loc.indexOf('?') + 1);
        else 
            loc = uexWindow.getUrlQuery();
        if(loc){
            loc = String(loc);
            if(loc.indexOf("&")>0){
                var pieces = loc.split('&');
            }else{
                var pieces = [loc];
            }
        params.keys = [];
        for (var i = 0; i < pieces.length; i += 1) {
            var keyVal = pieces[i].split('=');
            params[keyVal[0]] = decodeURIComponent(keyVal[1]);
            params.keys.push(keyVal[0]);
        }}
        return params;
      }
    }
    for (var i = 0; i < nativeList.length; i++) {
      corNative[nativeList[i]] = function () {
        return nativeInfo;
      }
    }
  };
  setTimeout(function () {
    if (window.corWidgetOne === undefined) {
      !window.isPC && initCorNative();
      window.isPC = true;        
    }    
  }, 250);
})(window);
