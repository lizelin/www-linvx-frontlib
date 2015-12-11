/**
 * Created by lizelin on 2015/8/3.
 * 一，常用的函数
 *      Linvx.utils.merge(obj, obj1....)：合并对象
 *      Linvx.utils.createUUID: 创建唯一标志
 *      Linvx.utils.os.*: 判断浏览器类型
 *          iso, android, iphone, ipad, ipod, wx, version, wxversion
 *      Linvx.utils.type(obj): 判断变量类型
 *          boolean number string function array date regexp object error
 *      Linvx.utils.dumpObject(obj): 调测使用
 *      Linvx.http.*: http相关，包括cookie、htmlEncode, htmlDecode, addParam, getParam, goUrl等
 *      Linvx.ui.*: ui相关，包括css等
 */

(function (root, factory) {

    /* CommonJS */
    if (typeof module == 'object' && module.exports) module.exports = factory()

    /* AMD module */
    else if (typeof define == 'function' && define.amd) define(factory)

    /* Browser global */
    else root.Linvx = factory()
}(this, function () {
    "use strict"
    var Linvx = {
        version: "1.0.0",
        author: "Li Ze Lin"
    }

    /**
     * 一，常用的函数
     */
    Linvx.utils = {

        /**
         * 合并对象
         * @param obj
         * @returns {*}
         */
        merge: function (obj) {
            for (var i = 1; i < arguments.length; i++) {
                var def = arguments[i]
                for (var n in def) {
                    if (obj[n] === undefined) obj[n] = def[n]
                }
            }
            return obj
        },

        /*
         * 获取唯一的UUID
         * Returns RFC4122, version 4 ID
         */
        createUUID : (function (uuidRegEx, uuidReplacer) {
            return function () {
                return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
            };
        })(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == "x" ? r : (r & 3 | 8);
            return v.toString(16);
        }),

        isArray : function(object){
            return Linvx.utils.type(object)=='array';
        },

        isFunction: function(object){
            return Linvx.utils.type(object)=='function';
        }

    };

    /**
     * 以下是获取变量的类型
     * 摘自jquery部分代码
     */
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    // Populate the class2type map
    var types = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
    for (var item in types) {
        class2type[ "[object " + types[item] + "]" ] = types[item].toLowerCase();
    }

    Linvx.utils.type = function( obj ) {
        if ( obj == null ) {
            return obj + "";
        }
        return typeof obj === "object" || typeof obj === "function" ?
            class2type[ toString.call(obj) ] || "object" :
            typeof obj;
    };

    Linvx.utils.dumpObject = function(obj) {
        if (!obj)
            return "EMPTY OBJ";
        if (Linvx.utils.type(obj)==="object"){
            var s="";
            for (var name in obj){
                s+= "[" + name + ":"+ obj[name] + "]\n";
            }
            return s;
        }
        if (Linvx.utils.type(obj)==="array"){
            var s="";
            var i=0;
            for (var name in obj){
                s+= "[" + (i++) + ":"+ obj[name] + "]\n";
            }
            return s;
        }
        return obj;
    };

    /**
     * 以下是获取浏览器类型
     */
    Linvx.utils.os = {
        ios: false,
        iphone: false,
        ipad: false,
        ipod: false,
        android: false,
        version: false,
        wx: false,
        wxversion: false
    };

    (function() {
        var ua = navigator.userAgent;
        var browser = {},
            weixin = ua.match(/MicroMessenger\/([^\s]+)/),
            webkit = ua.match(/WebKit\/([\d.]+)/),
            android = ua.match(/(Android)\s+([\d.]+)/),
            ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
            ipod = ua.match(/(iPod).*OS\s([\d_]+)/),
            iphone = !ipod && !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
            webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
            touchpad = webos && ua.match(/TouchPad/),
            kindle = ua.match(/Kindle\/([\d.]+)/),
            silk = ua.match(/Silk\/([\d._]+)/),
            blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
            mqqbrowser = ua.match(/MQQBrowser\/([\d.]+)/),
            chrome = ua.match(/CriOS\/([\d.]+)/),
            opera = ua.match(/Opera\/([\d.]+)/),
            safari = ua.match(/Safari\/([\d.]+)/);
        if (weixin) {
            Linvx.utils.os.wx = true;
            Linvx.utils.os.wxVersion = weixin[1];
        }
        if (android) {
            Linvx.utils.os.android = true;
            Linvx.utils.os.version = android[2];
        }
        if (iphone) {
            Linvx.utils.os.ios = Linvx.utils.os.iphone = true;
            Linvx.utils.os.version = iphone[2].replace(/_/g, '.');
        }
        if (ipad) {
            Linvx.utils.os.ios = Linvx.utils.os.ipad = true;
            Linvx.utils.os.version = ipad[2].replace(/_/g, '.');
        }
        if (ipod) {
            Linvx.utils.os.ios = Linvx.utils.os.ipod = true;
            Linvx.utils.os.version = ipod[2].replace(/_/g, '.');
        }
    })();

    /**
     * 二，http相关
     */
    Linvx.http = {
        cookie : {
            getCookie: function(name) {
                var cookie_start = document.cookie.indexOf(name + '=');
                var cookie_end = document.cookie.indexOf(";", cookie_start);
                return cookie_start == -1 ? '' : unescape(document.cookie.substring(cookie_start + name.length + 1, (cookie_end > cookie_start ? cookie_end : document.cookie.length)));
            },
            setCookie: function(cookieName, cookieValue, seconds, path, domain, secure) {
                var expires = new Date();
                if (seconds)
                    expires.setTime(expires.getTime() + seconds * 1000);
                document.cookie = escape(cookieName) + '=' + escape(cookieValue) + (seconds ? '; expires=' + expires.toGMTString() : '') + (path ? '; path=' + path : '/') + (domain ? '; domain=' + domain : '') + (secure ? '; secure' : '');
            }
        },
        htmlEncode : function(text) {
            return text.replace(/&/g, '&amp').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
        htmlDecode : function(text) {
            return text.replace(/&amp;/g, '&').replace(/&quot;/g, '/"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        },
        goUrl : function(url, isReplace){
            if (isReplace){
                window.location.replace(url);
            }else{
                window.location.href = url;
            }
        },
        parseUrl: function(url){
            if (!url) url = document.location.toString();
            var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
            var result = parse_url.exec(url);
            var names = ['url','scheme','slash','host','port','path','query','hash'];
            var ret = {};
            for(var i=0;i<names.length;i++){
                ret[names[i]] = result[i];
//                console.log(names[i] + ":" + result[i]);
            }
            return ret;
        },
        getWebSiteRootUrl : function(url) {
            if (!url) url = document.location.toString();
            var parts = Linvx.http.parseUrl(url);
            var host = parts['host'];
            var port = (parts['port'] && parts['port']!="80")?(":"+parts['port']):"";
            var entryUrl = parts['scheme']+'://'+host+port;
            return entryUrl;
        },
        getEntirePath : function(url){
            var parts = Linvx.http.parseUrl(url);
            var path = parts['path'];
            return Linvx.http.getWebSiteRootUrl(url) + '/'+ path;
        },
        getQueryString : function (url) {
            var parts = Linvx.http.parseUrl(url);
            return parts['query']||'';
        },
        getHash: function(url) {
            var parts = Linvx.http.parseUrl(url);
            return parts['hash']||'';
        },
        getParams : function (url) {
            var args = {};                             // Start with an empty object
            var query = Linvx.http.getQueryString(url);  // Get query string, minus '?'
            var pairs = query.split("&");              // Split at ampersands
            for(var i = 0; i < pairs.length; i++) {    // For each fragment
                var pos = pairs[i].indexOf('=');       // Look for "name=value"
                if (pos == -1) continue;               // If not found, skip it
                var name = pairs[i].substring(0,pos);  // Extract the name
                var value = pairs[i].substring(pos+1); // Extract the value
                value = decodeURIComponent(value);     // Decode the value
                args[name] = value;                    // Store as a property
            }
            return args;                               // Return the parsed arguments
        },
        getParam : function (name, url) {
            var args = Linvx.http.getParams(url);
            return args[name]||'';
        },
        addParam : function(name, value, url) {
            if (!url) url = document.location.toString();
            var args = Linvx.http.getParams(url);
            var parts = Linvx.http.parseUrl(url);
            args[name] = value;
            var q = '';
            var first = true;
            for (var k in args) {
                if (first){
                    first = false;
                    q+=k+"="+encodeURIComponent(args[k]);
                }else{
                    q+="&"+k+"="+encodeURIComponent(args[k]);
                }
            }
            var ret = Linvx.http.getEntirePath(url) + '?' + q;
            if (parts['hash']) {
                ret = ret + '#' + parts['hash'];
            }
            return ret;
        },
        null: null
    };

    /**
     * 三，设置ui
     */
    Linvx.ui = {
        css : function(ele, props) {
            if (!ele || !props) return;
            for (var key in props) {
                ele.style[key] = props[key];
            }
        },
        preLoadImages : function(imgs, onComplete/*imagesElements, successCount, errorCount, abortCount*/) {
            var imageElements = [];
            if (!Linvx.utils.isArray(imgs) || !Linvx.utils.isFunction(onComplete)) {
                console.log("wrong args! the first arg must be array and the second arg must function");
                onComplete(imageElements, 0, 0, 0);
            }
            var len = imgs.length;
            var successCount=0, errorCount=0, abortCount=0;
            var checkAllDone = function(){
                if (successCount + errorCount + abortCount == len ) {
                    onComplete(imageElements, successCount, errorCount, abortCount);
                }
            }
            for (var i=0; i<len; i++) {
                var img = document.createElement("img");
                //img.style.display = "none";
                img.onabort = function(result) {
                    abortCount++;
//                    console.log(result);
                    checkAllDone();
                }
                img.onload = function(result) {
                    successCount++;
                    imageElements.push(this);
//                    console.log(result);
                    checkAllDone();
                }
                img.onerror = function(result) {
                    errorCount++;
//                    console.log(result);
                    checkAllDone();
                }
                img.src = imgs[i];
            }
        },

        isSupportTouch:function(){
            return "ontouchend" in document ? true : false;
        },

        /**
         * 封装触屏事件
         * @param obj
         * @param _events
         *      json object, keys: start, move, left, right, top, down, long, click, end
         */
        touchEventWrapper : function(obj, _events){
            var hasTouch = Linvx.ui.isSupportTouch();
            var start = hasTouch?"touchstart":"mousedown";
            var end = hasTouch?"touchend":"mouseup";
            var move = hasTouch?"touchmove":"mousemove";
            var _isMouseDown = false;

            var getPos = function(event){
                var touch = hasTouch?event.targetTouches[0]:event;
                return {clientX:touch.clientX, clientY:touch.clientY};
            }

            //滑动范围在5x5内则做点击处理，s是开始，e是结束
            var init = {x:5,y:5,sx:0,sy:0,ex:0,ey:0,dx:0,dy:0};
            var sTime = 0, eTime = 0;

            obj.addEventListener(start,function(e){
                _isMouseDown = true;
                var event = e || window.event;
                event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
                event.stopPropagation();
//                console.log(event);
                sTime = new Date().getTime();
                var pos = getPos(event);
                init.sx = pos.clientX;
                init.sy = pos.clientY;
                init.ex = init.sx;
                init.ey = init.sy;
                if(_events.start) _events.start(init, event);
            }, false);

            obj.addEventListener(move,function(e) {
                var event = e || window.event;
                event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
                event.stopPropagation();
                if (_isMouseDown) {
//                    var event = e || window.event;
//                    event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
//                    event.stopPropagation();
//                    console.log(event);
                    var pos = getPos(event);
                    init.dx = pos.clientX - init.ex;
                    init.dy = pos.clientY - init.ey;
                    init.ex = pos.clientX;
                    init.ey = pos.clientY;
                    if(_events.move) _events.move(init, event);
                }
            }, false);

            function _onEnd(e) {
                _isMouseDown = false;
                var event = e || window.event;
                event.preventDefault();//阻止触摸时浏览器的缩放、滚动条滚动
                event.stopPropagation();
//                console.log(event);
                var changeX = init.sx - init.ex;
                var changeY = init.sy - init.ey;
                if(Math.abs(changeX)>Math.abs(changeY)&&Math.abs(changeY)>init.y) {
                    //左右事件
                    if(changeX > 0) {
                        if(_events.left) _events.left();
                    }else{
                        if(_events.right) _events.right();
                    }
                }
                else if(Math.abs(changeY)>Math.abs(changeX)&&Math.abs(changeX)>init.x){
                    //上下事件
                    if(changeY > 0) {
                        if(_events.top) _events.top();
                    }else{
                        if(_events.down) _events.down();
                    }
                }
                else if(Math.abs(changeX)<init.x && Math.abs(changeY)<init.y){
                    eTime = new Date().getTime();
                    //点击事件，此处根据时间差细分下
                    if((eTime - sTime) > 300) {
                        if(_events.long) _events.long(); //长按
                    }
                    else {
                        if(_events.click) _events.click(); //当点击处理
                    }
                }
                if(_events.end) {
                    _events.end(init, event);
                }
            }
            obj.addEventListener(end,_onEnd, false);
            if (!hasTouch) {
                obj.addEventListener("mouseout", _onEnd, false);
            }
        }

    };
    Linvx.ui.resizeMe = function(displayHeight, displayWidth) {
        // iphone5 : 1136x640, height-40头尾
        //Standard dimensions, for which the body font size is correct
        var preferredHeight = 480;
        var preferredWidth = 320;

        if (displayHeight < preferredHeight || displayWidth < preferredWidth) {
            var heightPercentage = (displayHeight * 100) / preferredHeight;
            var widthPercentage = (displayWidth * 100) / preferredWidth;
            var percentage = Math.min(heightPercentage, widthPercentage);
            var newFontSize = percentage.toFixed(2);

            $("body").css('font-size', newFontSize + '%');
        } else {
            $("body").css('font-size', '100%');
        }
//    console.log("call resizeMe H:" + displayHeight + " and W:" + displayWidth);
    }

    if (!window.console) {
        window.console = {log:function(){}};
    }

    return Linvx

}));
