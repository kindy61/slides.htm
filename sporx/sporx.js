
if(typeof console != 'undefined'){
window._log=function(){console.log.apply(console, arguments);};
window._profile=function(){(arguments.length?console.profile:console.profileEnd).apply(console, arguments);};
}else{
window._log=function(){};
window._profile=function(){};
}

function addEv(elm, typ, fn) {
    if ( elm.nodeType == 3 || elm.nodeType == 8 )
		return;

    if (elm && elm.addEventListener) {
        elm.addEventListener(typ, fn, false);
    } else if (elm && elm.attachEvent) {
        elm.attachEvent('on' + typ, fn);
    } else {
        try {
            elm['on' + typ] = fn;
        } catch(ex) {}
    }
    return fn;
}

function rmEv(elm, typ, fn) {
    if ( elm.nodeType == 3 || elm.nodeType == 8 )
		return;

    if (elm && elm.removeEventListener) {
        elm.removeEventListener(typ, fn, false);
    } else if (elm && elm.detachEvent) {
        elm.detachEvent('on' + typ, fn);
    } else {
        try {
            elm['on' + typ] = null;
        } catch(ex) {}
    }
    return fn;
}


function l_i(a){if(a in l_ma)return l_ma[a];return l_ma[a]=navigator.userAgent.toLowerCase().indexOf(a)!=-1}
var l_ma={};
function l_h(){return l_i("msie")&&!window.opera}
function l_ha(){return l_i("safari")||l_i("konqueror")}

var l_ra={Xa:function(a){return a.document.body.scrollTop},Ya:function(a){return a.document.documentElement.scrollTop},Va:function(a){return a.pageYOffset}};
var l_sa={Xa:function(a){return a.document.body.scrollLeft},Ya:function(a){return a.document.documentElement.scrollLeft},Va:function(a){return a.pageXOffset}};
var l_ta={Xa:function(a){return a.document.body.clientHeight},Ya:function(a){return a.document.documentElement.clientHeight},Va:function(a){return a.innerHeight}};
function l_r(a,b){try{if(!window.opera&&"compatMode"in a.document&&a.document.compatMode=="CSS1Compat")return b.Ya(a);else if(l_h())return b.Xa(a)}catch(c){}return b.Va(a)}

function get_pageHeight(w){
    return l_r(w || window,l_ta)
}
function get_pageOffsetX(w){
    return l_r(w || window,l_sa)
}
function get_pageOffsetY(w){
    return l_r(w || window,l_ra)
}

var l_ua=/&/g,l_va=/</g,l_wa=/>/g;
var l_xa=/\"/g;
var l_ws=/ /g;
function escape_html_(a){if(!a)return"";return a.replace(l_ua,"&amp;").replace(l_va,"&lt;").replace(l_wa,"&gt;").replace(l_xa,"&quot;").replace(l_ws,"&nbsp;")}

function escape_html(a){
    if(!a)return '';

    var m = {'&': '&amp;', '>': '&gt;', '<': '&lt;', ' ': '&nbsp;'};
    return a.replace(/[&<> ]/g,function(a){
            return m[a];
        });
}


// Sporx
var Sporx = window.Sporx = function() {};

Sporx.prototype = {
    start: function() {

        this.size = 9;

        this._offset  = 0;
        // 存储显示区域
        this.canvas   = document.getElementById('canvas');

        addEv(this.canvas, 'click', function(ev){ sporx.onPresentationClick(ev); });
        // addEv(this.canvas, 'dblclick', function(ev){ sporx.prevSlide(); });

        //addEv(document.body, 'contextmenu', function(ev){return false;alert(1);});

        function resize_canvas(){
            sporx.canvas.style.height = (get_pageHeight() - 40) + 'px';
            sporx.adjustCanvasSize();
        }
        resize_canvas();
        addEv(window, 'resize', resize_canvas);

        // 存储显示数据
        this.content  = document.getElementById('content');

        // 编辑用
        /*
        this.textbox  = document.getElementById('textField');
        this.deck     = document.getElementById('deck');
        */
        this.scroller = document.getElementById('scroller');

        this.toolbar         = document.getElementById('canvasToolbar');
        this.toolbarHeight   = this.toolbar.offsetHeight;
        this.hide_toolbar();

        var slides_text = document.getElementById('builtinCode').value;

        this.slides = this.splitSlides(slides_text);

        this.current = 0;
        if (String(location).match(/#(\d+)$/)) {
            this.current = RegExp.$1;
        }

        document.getElementById("max_page").innerHTML = this.slides.length;

        if (this.slides.length) {
            if (!document.title) {
                document.title = this.slides[0].
                    replace(/[\r\n]/g, ' ').
                    replace(/\{\{(.*\|)?\s*/g, '').
                    replace(/\s*\}\}/g, '');
            }

            this.dataFolder = ('' + location.href).split('?')[0].replace(/[^\/]+$/, '');
            this.takahashi();
        }
    },

    updateUrl: function() {
        location.hash = '#' + this.current;
    },

    hide_toolbar: function() {
        this.toolbar.style.top = (0-this.toolbarHeight) + 'px';
        this.isToolbarHidden = true;
    },

    onPresentationClick: function(aEvent) {
        aEvent = aEvent || window.event;
        if (!this.isToolbarHidden)
            this.showHideToolbar();

        var uri = aEvent.target.getAttribute('href');
        if (uri) {
            window.open(uri);
        } else {
            this.nextSlide();
        }

    },

    fix_pre: function(text) {
        return text;

        return text.replace(
            /((^ .*\n)+)/mg, function(m, $1) {
                return '.pre\n' + $1 + '.pre\n';
            }
        );
    },

    takahashi: function() {
        var num = this.current;
        this.updateUrl();

        document.getElementById("current_page").value = num + 1;

        //this.scroller.setAttribute('maxpos', this.data().length - 1);
        //this.scroller.setAttribute('curpos', this.offset);

        this.canvas.rendering = true;

        var text = this.slides[num].
            replace(/^[\r\n]+/g,"").
            replace(/[\r\n]+$/g,"").
            replace(/(\r\n|[\r\n])/g,"\n").
            split('\n');

        this.content.innerHTML = '';
        this.content.style.top = '';

        var line;

        var labelId = 0;

        //for (var i = 0; i < text.length; i++) {

        while (line = text.shift()) {
            this.content.appendChild(document.createElement('div'));
            this.content.lastChild.setAttribute('align', 'center');
            //this.content.lastChild.setAttribute('pack', 'center');

            //line = text[i];
            image_width  = 0;
            image_height = 0;

            if (line.match(/^\*\s+/)) {
                var ul = document.createElement('ul');
                while (line.match(/^\*\s+/)) {
                    var li = document.createElement('li');
                    var line_text = line.replace(/^\*\s+/, '');
                    // li.appendChild(document.createTextNode(line_text));
                    li.appendChild(document.createElement('div'));
                    this.inlineMarkupMess(line_text, li);
                    ul.appendChild(li);
                    //i++;
                    //line = text[i];
                    line = text.shift();
                    if (! line) line = '';
                }
                this.content.appendChild(ul);
                continue;
            }

            if (line.match(/^ /)) {
                this.content.lastChild.setAttribute('align', 'left');
                this.content.lastChild.setAttribute('class', 'pre-big');
                line = line.substring(1);
                _log('"' + line + '"');
                //line = line.replace(/  /g, '    ');
            }

            this.inlineMarkupMess(line, this.content);

            image_total_width = Math.max(image_total_width, image_width);
            image_total_height += image_height;
        }


        // 调整 slide 适应屏幕尺寸
        this.adjustCanvasSize();

        this.canvas.rendering = null;
    },

    adjustCanvasSize: function() {

        if (!this.content) {
            return;
        }

        this.content.style.fontSize = '12px';

        if (this.content.offsetHeight) {
            var canvas_w  = this.canvas.offsetWidth;
            var canvas_h  = this.canvas.offsetHeight - image_total_height;

            this.canvas.style.width = '9999px';
            this.content.style.cssFloat = 'left';

            var content_w = this.content.offsetWidth;
            var new_fs = Math.floor((canvas_w/content_w) * this.size);

            this.content.style.fontSize = new_fs + "px";

            if (this.content.offsetWidth < image_total_width) {
                content_w = image_total_width;
                new_fs = Math.floor((canvas_w/content_w) * this.size);
                this.content.style.fontSize = new_fs + "px";
            }

            this.canvas.style.width = '';
            this.content.style.cssFloat = '';

            var content_h = this.content.offsetHeight;
            if (content_h >= canvas_h) {
                content_h = this.content.offsetHeight;
                new_fs = Math.ceil((canvas_h/content_h) * new_fs);
                this.content.style.fontSize = new_fs + "px";
            }
            content_h = this.content.offsetHeight;
            canvas_h  = this.canvas.offsetHeight;
            if (canvas_h - content_h > 20) {
                this.content.style.top = (canvas_h - content_h)/2.8 + 'px';
            }
        }
    },

    inlineMarkupMess: function(line, content) {

        var uri;
        image_total_width  = 0;
        image_total_height = 0;
        var image_src;
        //alert("HERE!");
        /* + + + + + + + + + + + + + +
        ^
        ((?:
            [^\{]
            |
            \{[^\{]
        )+)?
        (
            \{\{ima?ge? +src="([^"]+)" +width="([0-9]+)" +height="([0-9]+)"[^\}]*\}\}       -> {{img src width height}}
            |                                                                               -> {{image src width height}}
            \{\{(([^\|]+)?\||)(.+?)\}\}     -> {{abc||def}}
        )
        (.+)?


        $1  -> 普通文本
        $2  -> 图像和特殊标记
        $3  -> 图像地址
        $4  -> 图像宽度
        $5  -> 图像高度
        $6  -> abc||def 这样标记中的 abc||
        $7  -> abc||def 这样标记中的 abc
        $8  -> abc||def 这样标记中的 def
        $9  -> 剩余数据
        + + + + + + + + + + + + + + */

        var m;
        while (m = line.match(/^((?:[^\{]|\{[^\{])+)?(\{\{ima?ge? +src="([^"]+)" +width="([0-9]+)" +height="([0-9]+)"[^\}]*\}\}|\{\{(([^\|]+)?\||)(.+?)\}\})(.+)?/)) {
            if (RegExp.$1) {
                content.lastChild.appendChild(
                    document.createElement('span')
                );
                content.lastChild.lastChild.innerHTML = escape_html(RegExp.$1);

                this.fixPre(content.lastChild);
            }

            //_log(line, m);

            // Images
            if (/^((?:[^\{]|\{[^\{])+)?\{\{ima?ge? +src="([^\"]+)" +width="([0-9]+)" +height="([0-9]+)"[^\}]*\}\}/.test(line)) {
                content.lastChild.
                    appendChild(document.createElement('img'));

                var image_src = RegExp.$2;
                if (image_src.indexOf('http://') < 0 &&
                    image_src.indexOf('https://') < 0)
                    image_src = this.dataFolder + image_src;
                content.lastChild.lastChild.src = image_src;
                content.lastChild.lastChild.width = parseInt(RegExp.$3 || '0');
                content.lastChild.lastChild.height = parseInt(RegExp.$4 || '0');
                image_width  += parseInt(RegExp.$3 || '0');
                image_height = Math.max(image_height, parseInt(RegExp.$4 || '0'));

                this.fixPre(content.lastChild);

            }

            // Styles 普通带 class 文本，不是 link
            else if (/^((?:[^\{]|\{[^\{])+)?\{\{(#([^\|]+)?\|)(.+?)\}\}/.test(line)) {
                uri = RegExp.$4;    // 误导的变量名
                content.lastChild.
                    appendChild(document.createElement('span'));
                content.lastChild.lastChild.innerHTML = escape_html(uri);
                content.lastChild.lastChild.className = RegExp.$3;
                this.fixPre(content.lastChild);
            }

            // Links
            else if (/^((?:[^\{]|\{[^\{])+)?\{\{(([^\|]+)?\||)([^\}]+)\}\}/.test(line)) {
                uri = RegExp.$4;
                if (uri.indexOf('://') < 0)
                    uri = this.dataFolder + uri;
                content.lastChild.
                    appendChild(document.createElement('a'));

                content.lastChild.lastChild.innerHTML = escape_html(RegExp.$3 || RegExp.$4);
                content.lastChild.lastChild.href = uri;
                content.lastChild.lastChild.title = uri;
                content.lastChild.lastChild.target = '_blank';
                content.lastChild.lastChild.className = 'link-text';
                this.fixPre(content.lastChild);
            }

            line = m[9] || '';
        }

        if (line) {
            _log("text node: " + line);
            _log("parent class name: " + content.lastChild.className);
            content.lastChild.appendChild(document.createElement('span'));
            content.lastChild.lastChild.innerHTML = escape_html(line);
            this.fixPre(content.lastChild);
        }

    },

    fixPre: function (node) {
        if (/\bpre-big\b/.test(node.className)) {
            _log("found pre!!! " + node.className);
        }
        if (node.lastChild.className) {
            //node.lastChild.className += ' pre';
        } else {
            //node.lastChild.className = 'pre';
        }
    },

    nextSlide: function() {
        if (this.current < (this.slides.length - 1)) {
            this.current++;
            this.takahashi();
        }
    },

    prevSlide: function() {
        if (this.current > 0) {
            this.current--;
            this.takahashi();
        }
    },

    firstSlide: function() {
        if (this.current != 0) {
            this.current = 0;
            this.takahashi();
        }
    },

    lastSlide: function() {
        if (this.current != this.slides.length - 1) {
            this.current = this.slides.length - 1;
            this.takahashi();
        }
    },

    showSlide: function(n) {
        n = Math.min(this.slides.length - 1, Math.max(0, n));

        if (this.current != n) {
            this.current = n;
            this.takahashi();
        }
    },

    splitSlides: function(text) {
        var slides = text.
            replace(/\n__END__\r?\n[\s\S]*/m, '\n').
            replace(/&amp;/g, '&').
            replace(/&lt;/g, '<').
            split('----');

        for (var i = 0; i < slides.length; i++) {
            var slide = slides[i];

            // 去除 # 开头的 slide
            if (slide.match(/^\n*$/) || slide.match(/^\s*#/)) {
                slides.splice(i, 1);
                i--;
                continue;
            }

            // + 开头的 条目 单独分到页面里去
            var set = [];
            if (slide.match(/^([\s\S]*?\n)\+/)) {
                while (slide.match(/^([\s\S]*?\n)\+/)) {
                    set.push(RegExp.$1);
                    slide = slide.replace(/\n\+/, '\n');
                }
                set.push(slide);
            }
            if (set.length) {
                slides.splice(i, 1, set[0]);
                for (var j = 1; j < set.length; j++) {
                    slides.splice(++i, 0, set[j]);
                }
            }
        }

        for (i = slides.length - 1; i >= 0; i--) {
            slides[i] = slides[i].replace(/\\(["\\])/g, '$1');
        }

        return slides;
    },

    onToolbarArea: false,
    toolbarHeight: 0,
    toolbarDelay: 300,
    toolbarTimer: null,
    isToolbarHidden: false,

    onMouseMoveOnCanvas: function(aEvent) {
        this.onToolbarArea = (aEvent.clientY < this.toolbarHeight);

        if (this.isToolbarHidden == this.onToolbarArea) {
            if (this.toolbarTimer)
                window.clearTimeout(this.toolbarTimer);

            this.toolbarTimer = window.setTimeout(
                function() {
                    sporx.onMouseMoveOnCanvasCallback();
                },
                this.toolbarDelay
            );
        }
    },

    onMouseMoveOnCanvasCallback: function() {
        if (this.isToolbarHidden == this.onToolbarArea)
            this.showHideToolbar();
    },

    toolbarAnimationDelay: 100,
    toolbarAnimationSteps: 5,
    toolbarAnimationInfo: null,
    toolbarAnimationTimer: null,

    showHideToolbar: function() {
        if (this.toolbarAnimationTimer)
            window.clearTimeout(this.toolbarAnimationTimer);

        this.toolbarAnimationInfo = { count : 0 };
        if (this.isToolbarHidden) {
            this.toolbarAnimationInfo.start = 0;
            this.toolbarAnimationInfo.end   = this.toolbarHeight;
        }
        else {
            this.toolbarAnimationInfo.start = this.toolbarHeight;
            this.toolbarAnimationInfo.end   = 0;
        }
        this.toolbarAnimationInfo.current = 0;

        this.toolbar.style.top =
                (0-(this.toolbarHeight-this.toolbarAnimationInfo.start)) + 'px';

        this.toolbarAnimationTimer = window.setTimeout(
            function() {
                sporx.animateToolbar();
            },
            this.toolbarAnimationDelay/this.toolbarAnimationSteps
        );
    },

    animateToolbar: function() {
        this.toolbarAnimationInfo.current +=
            parseInt(this.toolbarHeight/this.toolbarAnimationSteps);

        var top, bottom;
        if (this.toolbarAnimationInfo.start < this.toolbarAnimationInfo.end) {
            top    = this.toolbarHeight-this.toolbarAnimationInfo.current;
            bottom = this.toolbarAnimationInfo.current;
        }
        else {
            top    = this.toolbarAnimationInfo.current;
            bottom = this.toolbarHeight-this.toolbarAnimationInfo.current;
        }

        top    = Math.min(Math.max(top, 0), this.toolbarHeight);
        bottom = Math.min(Math.max(bottom, 0), this.toolbarHeight);

        this.toolbar.style.top = (0-top) + 'px';

        if (this.toolbarAnimationInfo.count < this.toolbarAnimationSteps) {
            this.toolbarAnimationInfo.count++;
            this.toolbarAnimationTimer = window.setTimeout(
                function() {
                    sporx.animateToolbar();
                },
                this.toolbarAnimationDelay/this.toolbarAnimationSteps
            );
        }
        else
            this.isToolbarHidden = !this.isToolbarHidden;
    }
}

//------------------------------------------------------------------------------
// Initialization code
//------------------------------------------------------------------------------
addEv(window, 'load', function(){
    sporx = new Sporx();
    sporx.start();

    addEv(document.body, 'mousemove', function(e){
        sporx.onMouseMoveOnCanvas(e);
    });

    addEv(document, 'keypress', function(e){
        if (String(location.hash).match(/^#edit$/))
            return true;

        if (e.altKey || e.ctrlKey) {
            return true
        }

        key = (e || event).keyCode

        //_log(key);
        switch(key) {
            case 8:
            case 37:
            case 112:
                sporx.prevSlide();
                break;
            case 13:
            case 32:
            case 39:
            case 110:
                sporx.nextSlide();
                break;
            default:
                //xxx(e.which)
                break;
        }
        return false;
    });

    rmEv(window, 'load', arguments.callee);
});

//------------------------------------------------------------------------------
// Sporx String Filters
//------------------------------------------------------------------------------
String.prototype.convertPerl5ToPerl6 = function() {
    return this.replace(/print/g, 'say');
}

String.prototype.current = function(regexp) {
    return this.replace(regexp, '{{#c|$1}}');
}

String.prototype.color = function(regexp) {
    return this.current(regexp);
}

//------------------------------------------------------------------------------
// Debugging Support
//------------------------------------------------------------------------------

function XXX(msg) {
    if (! confirm(msg))
        throw("terminated...");
    return msg;
}

function JJJ(obj) {
    XXX(JSON.stringify(obj));
    return obj;
}

//------------------------------------------------------------------------------
// JSON Support
//------------------------------------------------------------------------------

/*
Copyright (c) 2005 JSON.org
*/
var JSON = function () {
    var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        s = {
            'boolean': function (x) {
                return String(x);
            },
            number: function (x) {
                return isFinite(x) ? String(x) : 'null';
            },
            string: function (x) {
                if (/["\\\x00-\x1f]/.test(x)) {
                    x = x.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = m[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return '\\u00' +
                            Math.floor(c / 16).toString(16) +
                            (c % 16).toString(16);
                    });
                }
                return '"' + x + '"';
            },
            object: function (x) {
                if (x) {
                    var a = [], b, f, i, l, v;
                    if (x instanceof Array) {
                        a[0] = '[';
                        l = x.length;
                        for (i = 0; i < l; i += 1) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) {
                                        a[a.length] = ',';
                                    }
                                    a[a.length] = v;
                                    b = true;
                                }
                            }
                        }
                        a[a.length] = ']';
                    } else if (x instanceof Object) {
                        a[0] = '{';
                        for (i in x) {
                            v = x[i];
                            f = s[typeof v];
                            if (f) {
                                v = f(v);
                                if (typeof v == 'string') {
                                    if (b) {
                                        a[a.length] = ',';
                                    }
                                    a.push(s.string(i), ':', v);
                                    b = true;
                                }
                            }
                        }
                        a[a.length] = '}';
                    } else {
                        return;
                    }
                    return a.join('');
                }
                return 'null';
            }
        };
    return {
        copyright: '(c)2005 JSON.org',
        license: 'http://www.crockford.com/JSON/license.html',
        stringify: function (v) {
            var f = s[typeof v];
            if (f) {
                v = f(v);
                if (typeof v == 'string') {
                    return v;
                }
            }
            return null;
        },
        parse: function (text) {
            try {
                return !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                        text.replace(/"(\\.|[^"\\])*"/g, ''))) &&
                    eval('(' + text + ')');
            } catch (e) {
                return false;
            }
        }
    };
}();


/*

<commandset>
 <command id="cmd_forward" oncommand="if (Sporx.isPresentationMode) Sporx.forward();"/>
 <command id="cmd_back" oncommand="if (Sporx.isPresentationMode) Sporx.back();"/>
 <command id="cmd_home" oncommand="if (Sporx.isPresentationMode) Sporx.home();"/>
 <command id="cmd_end" oncommand="if (Sporx.isPresentationMode) Sporx.end();"/>
</commandset>

<keyset>
 <key key=" "                   command="cmd_forward"/>
 <key keycode="VK_ENTER"        command="cmd_forward"/>
 <key keycode="VK_RETURN"       command="cmd_forward"/>
 <key keycode="VK_PAGE_DOWN"    command="cmd_forward"/>
 <key keycode="VK_RIGHT"        command="cmd_forward"/>
 <key keycode="VK_DOWN"         command="cmd_forward"/>
 <!--key keycode="VK_BACK_SPACE"   command="cmd_back"/-->
 <key keycode="VK_UP"           command="cmd_back"/>
 <key keycode="VK_PAGE_UP"      command="cmd_back"/>
 <!--<key keycode="VK_BACK_UP"    command="cmd_back"/>-->
 <!--<key keycode="VK_BACK_LEFT"  command="cmd_back"/>-->
 <key keycode="VK_HOME"         command="cmd_home"/>
 <!--<key keycode="VK_END"        command="cmd_end"/>-->

 <key key="n" modifiers="accel" oncommand="Sporx.addPage();"/>
 <key key="r" modifiers="accel" oncommand="window.location.reload();"/>
 <key key="e" modifiers="accel" oncommand="Sporx.toggleEditMode();"/>
 <key key="a" modifiers="accel" oncommand="Sporx.toggleEvaMode();"/>
</keyset>



<!-- ***** BEGIN LICENSE BLOCK *****
   - Version: MPL 1.1
   -
   - The contents of this file are subject to the Mozilla Public License Version
   - 1.1 (the "License"); you may not use this file except in compliance with
   - the License. You may obtain a copy of the License at
   - http://www.mozilla.org/MPL/
   -
   - Software distributed under the License is distributed on an "AS IS" basis,
   - WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
   - for the specific language governing rights and limitations under the
   - License.
   -
   - The Original Code is the Takahashi-Method-based Presentation Tool in XUL.
   -
   - The Initial Developer of the Original Code is SHIMODA Hiroshi.
   - Portions created by the Initial Developer are Copyright (C) 2005
   - the Initial Developer. All Rights Reserved.
   -
   - Contributor(s): SHIMODA Hiroshi <piro@p.club.ne.jp>
   -
   - ***** END LICENSE BLOCK ***** -->

*/
