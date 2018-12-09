	//作成方針　canvasを重ねる形で実現　ipponグランプリ風動画イメージと音を作っておく
	//出来た画像とvideoを重ねる形で実現する
	//「コマンド＋Shift＋F」でchromeの全画面かつタブなし
	var video = document.getElementById("myVideo");
	var video2 = document.getElementById("myVideo2");
	var canvas = document.getElementById("myCanvas");
	var canvas2 = document.getElementById("myCanvas2");
	var canvas3 = document.getElementById("myCanvas3");
	var sound = document.getElementById('sound');
	var audio = document.getElementById("myAudio");
	var audio2 = document.getElementById("myAudio2");
	var button = document.getElementById("click_question");
	var text_question = document.getElementById("text_question");
	runCamera();
	//再生時間の長さを決定
	var timeEndTime = 15.0;

	button.addEventListener("click", function(){
		alert("問題文を変更しました");
		document.getElementById("q1").innerText = text_question.value;
	}, false);

	setInterval(function(){
		var ctx3 = canvas3.getContext('2d');
		ctx3.drawImage(video2, 0, 0, 320, 160);
	}, 1000 / 30);

	//再生時間取得
	video2.addEventListener("timeupdate", function() {
		if(video2.currentTime > timeEndTime){
			video2.pause();
		}
	}, true);

	//再生終了のイベント検知
	video2.addEventListener('ended', function(){
		//canvasの初期化を行うことによってカメラ映像が再度表示される状態にする
		resetAnimation(video2,canvas3);
		console.log('動画再生終了');
	});

	//キーボードが押されたら
	document.onkeydown = function (e){
		if(!e) e = window.event;
		//aを押した時 いっぽーん
		if(e.keyCode== 65){
			timeEndTime = 20.0;
			console.log("a 再生");
			video2.play();
		}
		//sを押した時　いっぽーん停止
		if(e.keyCode== 83){
			console.log("s 停止");
			video2.pause();
		}

		//1を押した時
		if(e.keyCode== 49){
			console.log("1 動作");
			timeEndTime = 0.1;
			video2.play();
		}

		//2を押した時
		if(e.keyCode== 50){
			console.log("2 動作");
			timeEndTime = 0.3;
			video2.play();
		}

		//3を押した時
		if(e.keyCode== 51){
			console.log("3 動作");
			timeEndTime = 0.5;
			video2.play();
		}

		//4を押した時
		if(e.keyCode== 52){
			console.log("4 動作");
			timeEndTime = 0.7;
			video2.play();
		}

		//0を押した時リセット 音・映像全て初期化
		if(e.keyCode== 48){
			video2.pause();
			audio.pause();
			audio2.pause();
			console.log("0 リセット");
			resetAnimation(video2,canvas3);
		}

		//qが1問目
		if(e.keyCode== 57){
			audio2.currentTime = 0;
			audio2.play();
		}

		//qが1問目
		if(e.keyCode== 81){
			document.getElementById("q2").style.display = "none";
			document.getElementById("picArea").style.display = "none";
			document.getElementById("q1").style.display = "block";

		}

		//wが2問目
		if(e.keyCode== 87){
			document.getElementById("q1").style.display = "none";
			document.getElementById("q2").style.display = "block";
			document.getElementById("picArea").style.display = "block";
		}

		//dを押した時ちーん音
		if(e.keyCode== 68){
			audio.currentTime = 0;
			audio.play();
		}
		//fを押した時にXXを非表示にする
		if(e.keyCode== 70){
			var ctx2 = canvas2.getContext('2d');
			ctx2.clearRect(0, 0, 1440, 900);

		}

		// 出力テスト
		console.log(e);
	};



	function resetAnimation(video, canvas){
		console.log('動画再生終了');
		//canvasの初期化を行うことによってカメラ映像が再度表示される状態にする
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 1440, 900);
		//指定位置に戻る
		video.currentTime = 0.0;
	}

	function runCamera(){
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || window.navigator.mozGetUserMedia;
		window.URL = window.URL || window.webkitURL;
		//参考　https://html5experts.jp/mganeko/5098/
		video = document.getElementById("myVideo");
		canvas = document.getElementById("myCanvas");
		var localStream = null;

		navigator.getUserMedia({video: true, audio: false},
			function(stream){
				console.log(stream);
				video.srcObject = stream;
				var canvasDrawTimer;
				var lastTime;

				canvasDrawTimer = setInterval(function() {
				var nowTime = Date.now();
				var diffTime = (nowTime - lastTime) / 1000;
				lastTime = nowTime;
				video.currentTime = video.currentTime + diffTime;

					// canvasへの描画を実行
					canvasDraw();
				}, 1000 / 30); // 24fpsで描画する
			},
			function(err) {
				console.log(err);
			}
		);
	}


	function canvasDraw() {
    // 動画の縦横サイズ・アスペクト比を取得しcanvasの縦横サイズを変更
    var aspectRatio = video.videoHeight / video.videoWidth;
    var canvasWidth = canvas.clientWidth;
    var canvasHeight = Math.floor(canvasWidth * aspectRatio);
    canvas.setAttribute("width", canvasWidth.toString());
    canvas.setAttribute("height", canvasHeight.toString());

    // canvasに描画
    var ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, video.videoWidth,
        video.videoHeight, 0, 0, canvasWidth, canvasHeight);
    // 総再生時間と現在の再生時間を比較し再生を終了
    var currentTime = (Math.round(parseFloat(video.currentTime) * 10000) / 10000);
    var duration = (Math.round(parseFloat(video.duration) * 10000) / 10000);
    if (duration >= 1 && currentTime >= duration) {
      clearInterval(canvasDrawTimer);
    }
  }
