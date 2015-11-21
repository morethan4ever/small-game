/**
 * 3d旋转木马
 * @param  {[type]} argument [description]
 * @return {[type]}          [description]
 */
function Carousel(carousel,options) {
	//图片
	var imgUrls   = options.imgUrls;
	//场景元素
	var $carousel = carousel;
	//容器元素
	var $spinner  =  carousel.find("#spinner");
	var angle     = 0;
	//图片数
	var numpics   = imgUrls.length;
	//角度
	var rotate    = 360 / numpics;
	var start     = 0;
	var current   = 1;

	//子元素
	var $contentElements;

	/**
	 * 创建结构
	 * @param  {[type]} imgUrl [description]
	 * @return {[type]}        [description]
	 */
	function createStr(imgUrl){
		var str = '<figure style="width:{0};transform:rotateY({1}deg) translateZ({2});position:absolute;">'
						 +'<img src="{3}" style="width:100%;height:100%;">' 
			   	 +'</figure>';

		return String.format(str,
			"2rem",
			start,
			"1.2rem",
			imgUrl
		)
	}

	/**
	 * 
	 * 初始化开始
	 * @return {[type]} [description]
	 */
	 function finishInit() {
		angle = angle - rotate;
		current = current - 1;
		if (current == 0) {
			current = numpics;
		}
		$spinner.css("transform", "rotateY(" + angle + "deg)")
	}

	/**
	 * 初始化样式
	 * @return {[type]} [description]
	 */
	function initStyle(){
		//场景元素
		$carousel.css({
			"transform":"scale(0.3)",
			"-webkit-perspective" : "500px",
			"position"            : "absolute",
			"left"                : "7rem",
			"top"                 : "5rem"
		})
		//容器
		$spinner.css({
			"width"           : "2rem",
			"transform-style" : "preserve-3d",
			"transition"      : "1s"
		})
	}

 	/**
 	 * 绘制页面节点
 	 * @return {[type]} [description]
 	 */
	function render() {
		//创建内容
		var contentStr = '';
		$.each(imgUrls, function(index, url) {
			contentStr += createStr(url);
			start = start + rotate;
		})
		$contentElements = $(contentStr);
		$spinner.append($contentElements)
	}

	//样式
	initStyle();
	//绘制节点
	render();


	//旋转次数
	//随机
	//3-10次
	var carouselCount = cursor = Math.floor(Math.random() * 5);
	//当前页码
	var currIndex;
	this.run = function(callback) {
		//开始旋转
		this.initTimer = setInterval(function() {
			if (cursor < 1) {
				//从0开始算计算
				currIndex = carouselCount%numpics;
				this.destroy();
				callback();
				return ;
			}
			//开始
			finishInit();
			--cursor;
		}.bind(this), 500);
	}

	/**
	 * 选中图片
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	this.selected = function(callback) {
		var $img = $contentElements.find("img");
		var count = $img.length;
		$img.transition({
			"scale": 1.5
		}, 2000, 'linear', function() {
			if(count===1){
				//回调只执行一次
				callback();
				return
			}
			count--;
		});

	}

	/**
	 * 销毁
	 * @return {[type]} [description]
	 */
	this.destroy = function(){
		clearInterval(this.initTimer);
		this.initTimer = null;
	}	


	/**
	 * 视频播放
	 * @param  {[type]} index   [description]
	 * @param  {[type]} element [description]
	 * @return {[type]}         [description]
	 */
	this.palyVideo = function(index, element) {

		var index   = index || currIndex % 3;
		var element = element || $contentElements.eq(index)
		var layer   = config.layer;

		/**
		 * vide标签
		 * @type {[type]}
		 */
		var $video = $('<video preload="auto" autoplay width="100%" height="100%"></video>');

		$video.css({
			"position" :"absolute",
			"z-index"  :"999"
		})

		//地址
		$video.attr('src', options.videoUrls[index]);

		//播放
		$video.on("loadeddata", function() {
			$video[0].play()
		})

		//停止
		$video.on("ended", function() {
			$video[0].pause()
			$video.remove();
		})

        $carousel.after($video)
	}

}



