var Player =
{
	AVPlayer : null,
    state : -1,
    skipState : -1,
    stopCallback : null,    /* Callback function to be set by client */
    originalSource : null,
    
    STOPPED : 0,
    PLAYING : 1,
    PAUSED : 2,  
    FORWARD : 3,
    REWIND : 4
};

var bufferingCB = {
	onbufferingstart : function () {
//		console.log("buffering started");
		Player.setTotalTime();
		Player.onBufferingStart();
    },
    onbufferingprogress: function (percent) {
//        console.log("on buffering : " + percent);
        Player.onBufferingProgress(percent);
    },
    onbufferingcomplete: function () {
//        console.log("buffering completely");
        Player.onBufferingComplete();
    }
};

var playCB = {
    oncurrentplaytime: function (time) {
//        console.log("playing time : " + time);
        Player.setCurTime(time);
    },
    onresolutionchanged: function (width, height) {
//        console.log("resolution changed : " + width + ", " + height);
    },
    onstreamcompleted: function () {
//        console.log("streaming completed");
    },
    onerror: function (error) {
        console.log(error.name);
    }
};

Player.init = function()
{
    var success = true;
    alert("success vale :  " + success);    
    this.state = this.STOPPED;
    try{
		var playerInstance = webapis.avplay;
		webapis.avplay.getAVPlay(Player.onAVPlayObtained, Player.onGetAVPlayError);
		
		//playerInstance는 단순히 AVPlayer의 인스턴스를 가져와서 getAVPlay 함수를 호출하는데 사용할뿐.
		//getAVPlay함수가 정상적으로 호출되면, 함께 전달한 onAVPlayerObtained라는 콜백함수도 호출되며,
		//이 함수에서 실제적인 AVPlayer 모듈을 불러온다.
		//추가로 AVPlayer모듈을 불러올 때 발생할 수 있는 에러를 처리할 수 있는 콜백함수도 함께 전달한다.
		
	}catch(e){
		alert('######getAVplay Exception :[' +e.code + '] ' + e.message);
	}      
    return success;
};

Player.onAVPlayObtained = function(avplay) {
	//AVPlayer 모듈을 초기화하는 콜백함수
	//모듈을 호출하는 onAVPlayObtained 함수는 AVPlay 인스턴스를 인자로 받는다.
	alert('Getting avplay object successfully');
	Player.AVPlayer = avplay;
	Player.AVPlayer.init({
		containerID : 'player_container',
		bufferingCallback : bufferingCB, 
		playCallback : playCB,
		displayRect: {
		  top: 0,
		  left: 0,
		  width: 960,
		  height: 540
		},
		autoRatio: true, 
	});
	console.log(Player.AVPlayer);
	//Display.hide();
	
	//이를 화면 레이어 전역에서 제어할 수 있게끔 로컬에 선언된 변수에 바인딩해서 AVPlayer 객체를 생성한 후 init 함수를 호출해 플레이어 구동 준비를 완료한다.
	//Initializes avplay with the specified option parameter. This has to be called before any ather avplay function.
};

Player.onGetAVPlayError = function() {
	//AVPlayer 모듈을 초기화할 때 발생하는 에러를 처리하기 위한 함수
	alert('######onGetAVPlayError: ' + error.message);
};

Player.onError = function(){
	alert('######onError: ');
};

Player.onSuccess = function(){
	alert('######onSuccess: ');
};

Player.deinit = function()
{
	alert("Player deinit !!! " );
}

Player.setWindow = function()
{
    //this.plugin.Execute("SetDisplayArea",458, 58, 472, 270);
	Player.AVPlayer.setDisplayRect({
		top: 58,
		left: 458,
		width: 472,
		height: 270
	});
};

Player.setFullscreen = function()
{
    //this.plugin.Execute("SetDisplayArea",0, 0, 960, 540);
	Player.AVPlayer.setDisplayRect({
		top: 0,
		left: 0,
		width: 960,
		height: 540
	});
};

Player.setVideoURL = function(url)
{
    this.url = url;
    alert("URL = " + this.url);
}

Player.playVideo = function()
{
    if (this.url == null)
    {
        alert("No videos to play");
    }
    else
    {
        this.state = this.PLAYING;
        // document.getElementById("play").style.opacity = '0.2';
        // document.getElementById("stop").style.opacity = '1.0';
        // document.getElementById("pause").style.opacity = '1.0';
        // document.getElementById("forward").style.opacity = '1.0';
        // document.getElementById("rewind").style.opacity = '1.0';
        // Display.status("Play");
        // this.setWindow();
        //this.plugin.Execute("Play",this.url );
        
        try{
			//jQuery('#player_container').addClass('show'); //화면상에 player_container(스크린이라고 생각) 나타냄 
        	Player.AVPlayer.open(this.url); 	// 재생할 미디어 콘텐츠 설정
        	Player.AVPlayer.play(Player.onSuccess, Player.onError); // 콘텐츠 재생
			//index_saver = content_index; //현재 재생한 영상의 index를 기억하게 하기위해 변수 index_saver에 할당
			
		}catch(e){
			alert(e.message);
		}
        
        Audio.plugin.Execute("SetSystemMute",false); 
    }
}

Player.pauseVideo = function()
{
    this.state = this.PAUSED;
    // document.getElementById("play").style.opacity = '1.0';
    // document.getElementById("stop").style.opacity = '1.0';
    // document.getElementById("pause").style.opacity = '0.2';
    // document.getElementById("forward").style.opacity = '0.2';
    // document.getElementById("rewind").style.opacity = '0.2';
    // Display.status("Pause");
    Player.AVPlayer.pause();
}

Player.stopVideo = function()
{
    if (this.state != this.STOPPED)
    {
        // this.state = this.STOPPED;
        // document.getElementById("play").style.opacity = '1.0';
        // document.getElementById("stop").style.opacity = '0.2';
        // document.getElementById("pause").style.opacity = '0.2';
        // document.getElementById("forward").style.opacity = '0.2';
        // document.getElementById("rewind").style.opacity = '0.2';
        // Display.status("Stop");
        Player.AVPlayer.stop();
        // Display.setTime(0);
        
        if (this.stopCallback)
        {
            this.stopCallback();
        }
    }
    else
    {
        alert("Ignoring stop request, not in correct state");
    }
}

Player.resumeVideo = function()
{
    this.state = this.PLAYING;
    // document.getElementById("play").style.opacity = '0.2';
    // document.getElementById("stop").style.opacity = '1.0';
    // document.getElementById("pause").style.opacity = '1.0';
    // document.getElementById("forward").style.opacity = '1.0';
    // document.getElementById("rewind").style.opacity = '1.0';
    // Display.status("Play");
    Player.AVPlayer.resume();
}

Player.skipForwardVideo = function()
{
    this.skipState = this.FORWARD;  
    Player.AVPlayer.jumpForward(5);
}

Player.skipBackwardVideo = function()
{
    this.skipState = this.REWIND;
    Player.AVPlayer.jumpBackward(5);
}

Player.getState = function()
{
    return this.state;
}

// Global functions called directly by the player 

Player.onBufferingStart = function()
{
    // Display.status("Buffering...");
    // switch(this.skipState)
    // {
    //     case this.FORWARD:
    //         document.getElementById("forward").style.opacity = '0.2';
    //         break;
        
    //     case this.REWIND:
    //         document.getElementById("rewind").style.opacity = '0.2';
    //         break;
    // }
}

Player.onBufferingProgress = function(percent)
{
    Display.status("Buffering:" + percent + "%");
}

Player.onBufferingComplete = function()
{
    Display.status("Play");
    switch(this.skipState)
    {
        case this.FORWARD:
            document.getElementById("forward").style.opacity = '1.0';
            break;
        
        case this.REWIND:
            document.getElementById("rewind").style.opacity = '1.0';
            break;
    }
}

Player.setCurTime = function(time)
{
	Display.setTime(time);
}

Player.setTotalTime = function()
{
	console.log('setTotalTime : ' + Player.AVPlayer.getDuration());
    // Display.setTotalTime(Player.AVPlayer.getDuration());
}

onServerError = function()
{
    Display.status("Server Error!");
}

OnNetworkDisconnected = function()
{
    Display.status("Network Error!");
}

getBandwidth = function(bandwidth) { alert("getBandwidth " + bandwidth); }

onDecoderReady = function() { alert("onDecoderReady"); }

onRenderError = function() { alert("onRenderError"); }

stopPlayer = function()
{
    Player.stopVideo();
}

setTottalBuffer = function(buffer) { alert("setTottalBuffer " + buffer); }

setCurBuffer = function(buffer) { alert("setCurBuffer " + buffer); }
