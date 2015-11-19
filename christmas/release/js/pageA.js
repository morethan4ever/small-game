/**
 * 第一副场景页面
 * http://louisremi.github.com/jquery.transform.js/index.html
 * http://www.html5tricks.com/demo/html5-css3-car-animation/index.html
 * http://www.gbtags.com/gb/demoviewer/4387/c9ebbe12-abab-487d-958a-aa79797ddcda/snow.html.htm
 * http://www.html5tricks.com/demo/pure-css3-weather-icon/index.html
 */

function PageA(element) {
    //根元素
    this.$root= element;
    //小男孩
    this.$boy = element.find(".chs-boy");
    //窗户
    this.$window = element.find(".window");    
    this.$leftWin  = this.$window.find(".window-left")
    this.$rightWin = this.$window.find(".window-right")

    //初始化一些场景
    this.init();
}


/**
 * 初始化一些场景
 * @return {[type]} [description]
 */
PageA.prototype.init = function() {
    this.createCloudyCircle();
    this.openWindow();
}


/**
 * 运行下一个动画
 * @return {Function} [description]
 */
PageA.prototype.next = function(options) {
    var dfd = $.Deferred();
    this.$boy.animate(options.styles, options.time, function() {
        dfd.resolve()
    });
    return dfd;
}


/**
 * 开窗
 * @return {[type]} [description]
 */
PageA.prototype.openWindow = function(callback) {
    var count = 1;
    var complete = function() {
        ++count
        if (count === 2) {
            callback && callback();
        }
    }
    var bind = function(data) {
        data.one(support.transitionEnd, function(event) {
            complete()
        })
    }
    bind(this.$leftWin.addClass("hover"))
    bind(this.$rightWin.addClass("hover"))
}

/**
 * 停止走路
 * @return {[type]} [description]
 */
PageA.prototype.stopWalk = function(){
    this.$boy.addClass("boy-stop-animate")
}


/**
 * 跑步
 * @return {[type]} [description]
 */
PageA.prototype.run = function(callback){
    // return
    var that = this;
    var next = function() {
        return this.next.apply(this, arguments)
    }.bind(this)

    next({
        "time": 6000,
        "styles": {
            "top"       : "0.2rem",
            "left"      : "0.5rem",
            "transform" : "rotateY(90deg)"
        }
    })
    .done(function(){
        that.$boy.css("z-index",10);
    })
    // .then(function() {
    //     return
    //     return next({
    //         "left"    : "4rem",
    //         "top"     : "1rem",
    //         "scale"   : 0.6,
    //         "time"    : 6000
    //     })
    // })
    // then(function() {
    //     return next({
    //         "left"  : "3rem",
    //         "top"   : "5em",
    //         "scale" : 0.8,
    //         "time"  : 2000
    //     })
    // }).
    // then(function() {
    //     return next({
    //         "left"  : "5rem",
    //         "top"   : "7em",
    //         "scale" : 1,
    //         "time"  : 2000
    //     })
    // }).
    // then(function() {
    //     return next({
    //         "left"  : "9rem",
    //         "scale" : 1,
    //         "time"  : 2000
    //     })
    // }).
    // then(function(){
    //     that.stopWalk();
    //     that.openWindow();
    //     that.change();
    //     // callback && callback();
    // })
}


/**
 * 创建半圆的云svg图
 * @return {[type]} [description]
 */
PageA.prototype.createCloudyCircle = function() {
    //创建SVG元素
    var svg = document.createElement("svg");
    svg.setAttribute("width", "100");
    svg.setAttribute("height", "100");
    //创建circle元素
    var rect = document.createElement("rect");
    rect.setAttribute("cx", "50");
    rect.setAttribute("cy", "50");
    rect.setAttribute("r", "40");
    svg.appendChild(rect);
    // $root.append(svg); 
}

 


/**
 *  css3关键帧算法
 * @param {[type]} row   [description]
 * @param {[type]} col   [description]
 * @param {[type]} count [description]
 */
function calculationKeyframes(col, row, count) {
    //矩阵生成step的处理
    //  0 1 2
    //  3 4 5
    //  6 7 8
    var keyframes = [];
    var base = 100 / count;
    //首次
    keyframes.push(0 + '% { background-position:0% 0%}')
    for (var i = 0; i < count; i++) {
        //当前行数
        var currRow = Math.ceil((i + 1) / col); //当前行数
        var currCol = Math.floor(i / col); //当前列数  
        var period = currCol * col; //每段数量  
        var x = 100 * (i - period)
        var y = 100 * currCol;
        x = x == 0 ? x : "-" + x;
        y = y == 0 ? y : "-" + y;
        keyframes.push(((i + 1) * base) + '% { background-position: ' + y + '% ' + x + '%}')
    }
    return keyframes.join("")
}