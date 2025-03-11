
var isSound =true;
var isToggleSound = true; 
///////////////////////////////////////

var LoadCnt = 0;
var Game = {};
var game;
var firstRunLandscape;
var gameRatio = window.innerWidth/window.innerHeight;
var maxX  = 720;
var maxY  = 1280;
var scaleRatioX = 1,scaleRatioY=1;

//////////////////////////////////

var img_Logo;
let isShowMenu = false;

let sndWin, sndLose, sndDraw, sndP1Move, sndP2Move;

////////////////////////////////////////////



window.onload = function()
{
        	   
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    function handleVisibilityChange() 
    {
	  	if (document.hidden) 
	  	{
	    	//game.paused = true;
	  	} 
	  	else  
	  	{
	    	//game.paused = false;
	  	}
	}
	// init();
    var gameRatio = window.innerWidth/window.innerHeight;
    window.scrollTo(0,1);
    var game = new Phaser.Game(maxX,maxY,Phaser.CANVAS,'GameCanvas'); // 480,800   

    game.state.add('Assets',Game.Assets);

    game.state.add('TTTGame',Game.TTTGame);

    game.state.start('Assets');

    // getDataFromUrl();
//////////////////////////////////////////////////////

  	

};

////////////////////////////////////////////////////////////////////////////////////////////////////////////
Game.Assets = function(game)
{
	
};
Game.Assets.prototype = 
{
	init:function(){
		
	},
	preload : function()
	{
		firstRunLandscape = this.game.scale.isGameLandscape;
		 if(!this.game.device.desktop)
		 {
		 	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;//EXACT_FIT;
		 	this.game.scale.forceOrientation(false,false);//(false,true);
		 	// window.scrollTo(0, 1);
		 	
		 }
		 else
		 {
		 	
		 	this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		 	this.game.scale.forceOrientation(false,false);
		 }
		 // this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
		 
 		 
		 this.game.scale.enterIncorrectOrientation.add(handleIncorrect);
      	 this.game.scale.leaveIncorrectOrientation.add(handleCorrect);

		 this.game.scale.pageAlignHorizontally = true;
 	   	 this.game.scale.pageAlignVertically = true;
 	 	 this.scale.setScreenSize = true;
 	 	// this.stage.disableVisibilityChange = false;
		 this.game.scale.refresh();
		
///////////////////////////////////////////////////////////////////////////////////////
		this.load.image('ImgLogo'		,'assets/logo.png');
		this.load.image('splash'		,'assets/splash.png');
		this.load.image('menubg'			,'assets/menubg.png');

		this.load.image('btn-p-p'			,'assets/p-p.png');
		this.load.image('btn-p-ai'			,'assets/p-ai.png');
		this.load.image('btn-multiplayer'			,'assets/multiplayer.png');
		this.load.image('btn-help'			,'assets/help.png');
		this.load.image('btn-sound-on'			,'assets/sound-on.png');
		this.load.image('btn-sound-off'			,'assets/sound-off.png');
		this.load.image('btn-back'			,'assets/back.png');

		this.load.image("helpbg","assets/helpbg.png");
		this.load.image("infobg","assets/infobg.png");
		this.load.image('btn-start','assets/start.png');
		
		

///////////////////////////////////////////////////////////////////////////////////////

		this.game.load.audio('media-win','assets/media/win.mp3');
		this.game.load.audio('media-draw','assets/media/draw.mp3');
		this.game.load.audio('media-lose','assets/media/lose.mp3');
		this.game.load.audio('media-p1move','assets/media/p1move.mp3');
		this.game.load.audio('media-p2move','assets/media/p2move.mp3');
		
		/*------------------------------------------------------------------------------------------*/
		

	}, 
	create :function()
	{
		
		
		style1 = { font: '32pt DegularDisplay', fill: '#f9e880', align: 'center', wordWrap: true, wordWrapWidth: 450 };
		style2 = { font: '24pt DegularDisplay', fill: '#f9e880', align: 'left', wordWrap: true, wordWrapWidth: 450 };

		

		document.getElementById("loader").style.display = "none";
		



		this.add.text(XPos(-1.6),YPos(0.2), `.`, style2); // there is a font issue therefor this is written


		sndWin = this.add.audio('media-win');
		sndLose = this.add.audio('media-lose');
		sndDraw = this.add.audio('media-draw');
		sndP1Move = this.add.audio('media-p1move');
		sndP2Move = this.add.audio('media-p2move');
		
		ImgLogo = this.add.sprite(maxX/2,maxY/2,'ImgLogo');
		ImgLogo.anchor.set(.5,.5);

		setTimeout(()=>{
			displaySplash(this);
		},1000);

		setTimeout(()=>{
			displayMenu(this);
		},3000);

	},

	PlayerVsPlayerPressed : function()
  {
  	BtnPtoP.scale.setTo(1.2);
  },
  PlayerVsPlayerReleased : function()
  {
    BtnPtoP.scale.setTo(1.0); 
    // loadScript('js/playerVsPlayer.js','MyScriptP2P','handleRestart');
    showInfoScreen(this);
    isAI = false;
  },

  PlayerVsAIPressed : function()
  {
  	BtnPtoAI.scale.setTo(1.2);
  },
  PlayerVsAIReleased : function()
  {
    BtnPtoAI.scale.setTo(1.0);
    // loadScript('js/playerVsAI.js','MyScriptP2AI','handleRestartAI');
    // showInfoScreen(this);
    // isAI = true;
  },

  MultiplayerPressed : function()
  {
  	BtnMultiplayer.scale.setTo(1.2);
  },
  MultiplayerReleased : function()
  {
    BtnMultiplayer.scale.setTo(1.0); 
  },

  HelpPressed : function()
  {
  	BtnHelp.scale.setTo(1.2);
  },
  HelpReleased : function()
  {
    BtnHelp.scale.setTo(1.0); 
    showHelpScreen(this);
  },
  SoundOnPressed : function()
  {
  	BtnSoundOn.scale.setTo(1.2);
  },
  SoundOnReleased : function()
  {
    BtnSoundOn.scale.setTo(1.0); 
    BtnSoundOff.x = XPos(0.0);
    BtnSoundOn.x = XPos(-2.0);
    console.log('sound is now off');
    isSound = false;

  },
  SoundOffPressed : function()
  {
  	BtnSoundOff.scale.setTo(1.2);
  },
  SoundOffReleased : function()
  {
    BtnSoundOff.scale.setTo(1.0); 
    BtnSoundOn.x = XPos(0.0);
    BtnSoundOff.x = XPos(-2.0);
    console.log('sound is now on');
    isSound = true;

  },

  BtnStartPressed : function()
  {
  	BtnStart.scale.setTo(1.2);
  },
  BtnStartReleased : function()
  {
    BtnStart.scale.setTo(1.0); 
    gameConfigScreen();
  },


  BtnBackPressed : function()
  {
  	BtnBack.scale.setTo(1.2);
  },
  BtnBackReleased : function()
  {
    BtnBack.scale.setTo(1.0); 
    displayMenu(this);
    destroyInfoScreen();
  },
  
	update : function()
	{
		if(isLaunchGame)
		{
			this.state.start('TTTGame');
		}
		if(isShowMenu)
		{
			displayMenu(this);
		}	

	},
	
}
let isLaunchGame = false;
function displaySplash(_this)
{
	ImgLogo.destroy();
	ImgSplash = _this.add.sprite(maxX/2,maxY/2,'splash');
 	ImgSplash.anchor.set(.5,.5);	
}

function destroyMenu(_this)
{
	MenuBG.destroy();
 	BtnPtoP.destroy();
	BtnPtoAI.destroy();
	BtnMultiplayer.destroy();
	BtnHelp.destroy();
	BtnSoundOn.destroy();
	BtnSoundOff.destroy();
}
function displayMenu(_this)
{
	isShowMenu = false;
	ImgSplash.destroy();	

	MenuBG = _this.add.sprite(XPos(0.0),YPos(0.0),'menubg');
 	MenuBG.anchor.set(.5,.5);

 	BtnPtoP = _this.add.button(XPos(0.0),YPos(0.400),'btn-p-p');
	BtnPtoP.anchor.set(.5,.5);
	BtnPtoAI = _this.add.button(XPos(0.0),YPos(0.250),'btn-p-ai');
	BtnPtoAI.anchor.set(.5,.5);
	BtnMultiplayer = _this.add.button(XPos(0.0),YPos(0.100),'btn-multiplayer');
	BtnMultiplayer.anchor.set(.5,.5);
	BtnHelp = _this.add.button(XPos(0.0),YPos(-0.050),'btn-help');
	BtnHelp.anchor.set(.5,.5);
	BtnSoundOn = _this.add.button(XPos(0.0),YPos(-0.200),'btn-sound-on');
	BtnSoundOn.anchor.set(.5,.5);
	BtnSoundOff = _this.add.button(XPos(-2.0),YPos(-0.200),'btn-sound-off');
	BtnSoundOff.anchor.set(.5,.5);
	
  BtnPtoP.events.onInputDown.add(_this.PlayerVsPlayerPressed, _this);
	BtnPtoP.events.onInputUp.add(_this.PlayerVsPlayerReleased, _this);

	BtnPtoAI.events.onInputDown.add(_this.PlayerVsAIPressed, _this);
	BtnPtoAI.events.onInputUp.add(_this.PlayerVsAIReleased, _this);

	BtnMultiplayer.events.onInputDown.add(_this.MultiplayerPressed, _this);
	BtnMultiplayer.events.onInputUp.add(_this.MultiplayerReleased, _this);

	BtnHelp.events.onInputDown.add(_this.HelpPressed, _this);
	BtnHelp.events.onInputUp.add(_this.HelpReleased, _this);

	BtnSoundOn.events.onInputDown.add(_this.SoundOnPressed, _this);
	BtnSoundOn.events.onInputUp.add(_this.SoundOnReleased, _this);

	BtnSoundOff.events.onInputDown.add(_this.SoundOffPressed, _this);
	BtnSoundOff.events.onInputUp.add(_this.SoundOffReleased, _this);

}
function destroyInfoScreen()
{
	infoBG.destroy();
 	BtnStart.destroy();
	BtnBack.destroy();
}
function showInfoScreen(_this)
{
	destroyMenu();

	infoBG = _this.add.sprite(XPos(0.0),YPos(0.0),'infobg');
 	infoBG.anchor.set(.5,.5);

 	BtnStart = _this.add.button(XPos(0.0),YPos(-0.650),'btn-start');
 	BtnStart.anchor.set(.5,.5);

	BtnBack = _this.add.button(XPos(0.0),YPos(-0.800),'btn-back');
 	BtnBack.anchor.set(.5,.5);
 	
 	BtnStart.events.onInputDown.add(_this.BtnStartPressed, _this);
	BtnStart.events.onInputUp.add(_this.BtnStartReleased, _this);

	BtnBack.events.onInputDown.add(_this.BtnBackPressed, _this);
	BtnBack.events.onInputUp.add(_this.BtnBackReleased, _this);
}
function showHelpScreen(_this)
{
	destroyMenu();

	helpBG = _this.add.sprite(XPos(0.0),YPos(0.0),'helpbg');
 	helpBG.anchor.set(.5,.5);

	BtnBack = _this.add.button(XPos(0.0),YPos(-0.800),'btn-back');
 	BtnBack.anchor.set(.5,.5);
 	

	BtnBack.events.onInputDown.add(_this.BtnBackPressed, _this);
	BtnBack.events.onInputUp.add(_this.BtnBackReleased, _this);

  
}

function gameConfigScreen()
{
	// destroyInfoScreen();
	// document.getElementById("controls").style.display="block";
	document.getElementById("main").style.display="block";
}


function loadScript(filename,namespace, callback) {
    // Remove existing script if it exists
    let existingScript = document.getElementById("dynamicScript");
    if (existingScript) {
    		console.log('removed existingScript');
        existingScript.remove();
    }

    // Delete the module to allow reloading without conflicts
    delete window[namespace];  // Remove previous reference
    // Create and add new script
    let script = document.createElement("script");
    script.id = "dynamicScript"; // Set an ID to track it
    script.src = filename;
    script.onload = function () {
        if (callback && window[namespace] && typeof window[namespace][callback] === "function") {
            window[namespace][callback]();  // Call function after loading
        }
    };
    document.body.appendChild(script);

    /************************************************/

}

//----------------------------------------------------------------------------------------------------
function handleIncorrect() 
{
	//if(!this.game.device.desktop)
	{
		document.getElementById("turn").style.display="block";
	}
}
function handleCorrect()
{
	//if(!this.game.device.desktop)
	{
		// if(firstRunLandscape)
		// {
		// 	aspectRatio = window.innerWidth/window.innerHeight;		
		// 	this.game.width = 800;//Math.ceil(800*gameRatio);
		// 	this.game.height = 480;
		// 	this.game.renderer.resize(this.game.width,this.game.height);
		// 	// game.state.start("Play");		
		// }
		document.getElementById("turn").style.display="none";
	}
}


function RandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
	//return this.game.rnd.integerInRange(min,max);
}
function randomBoolean() {
	var r = Math.abs(RandomInt(0,1)%2);
	if (r < 1)
		return false;
	else
		return true;
} 


function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
}
function checkOverlap(spriteA, spriteB) {

	var boundsA = spriteA.getBounds();
	var boundsB = spriteB.getBounds();

	return Phaser.Rectangle.intersects(boundsA, boundsB);
}
function CirCir(cx1,cy1,r1,cx2,cy2,r2)
{
	var bVectMag = Math.sqrt(((cx1-cx2)*(cx1-cx2)) + ((cy1-cy2)*(cy1-cy2)));
	if (bVectMag<(r1+r2))
	   return true;
   return false ;
}
function XPos(x) {
	return Math.floor(((1 + x)*maxX)/2);
}	
function YPos(y) {
	return Math.floor(((1-(y))*maxY)/2);
}
function floatHeight(Height)
{
  return(Height/maxY)*2;
}
function floatWidth(Width)
{
  return(Width/maxX)*2;
}
function screen2worldX(a)
{
	 c = ((a / maxX)- 0.5)*2;
	return c;
}
function screen2worldY(a)
{
	c = ((a/maxY)-0.5)*(-2);
	// console.log('------screen2worldY-------- c = '+c);
	return c;
}
function Rect2RectIntersection(ax,ay,adx,ady,bx,by,bdx,bdy)
{
		ax -= adx/2;
		ay += ady/2;
		bx -= bdx/2;
		by += bdy/2;
		if( ax+adx > bx  && ay-ady < by && bx+bdx > ax && by-bdy< ay)
		{
			return true;
		}
		return false;
}
function CircRectsOverlap(CRX,CRY,CRDX,CRDY,centerX,centerY,radius)
{
	if ((Math.abs(centerX - CRX) <= (CRDX + radius)) && (Math.abs(centerY - CRY) <= (CRDY + radius)))
	   return true;
	return false ;

}
function check_touch(x1, y1, x, y, dx, dy)
{
	if (x1 > x && x1 < x + dx) {
		if (y1 > y && y1 < y + dy) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function abs(x) 
{
	return x > 0 ? x : -x;
}


var ballno = 0;
var j = 0;
ballX = 160;


function pickRandomImages() {
  //  console.log("in pick random method");
   var i = Math.floor(Math.random() * Img_pathballs.length);
   ballno = i;
  // console.log("ballno=" + ballno);
   ballX= Math.floor(Math.random() *180+30);
 
	j = Math.floor(Math.random() * 5);
 //  console.log("j....=" + j);
   
 //  console.log("i=" + i);
   return ballno;

}
function randomBackground() {
	bgno = Math.floor(Math.random() * mpathImg_BG.length);
  
	return bgno;

}



function DrawTextureR(img, x, y, r) {
	var hex = (255 * 0x010000) + (255 * 0x000100) + (255 * 0x000001);
	img.tint = hex;
	img.angle = r;
	img.scale.setTo(1, 1);
	bmd.draw(img, XPos(x), YPos(y));
}




/////////////////////////////////////////////

function DrawTexture(img,x,y)
{
	this.bmd.draw(img,XPos(x),YPos(y));
}