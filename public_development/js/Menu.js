var isSound =true;
var isToggleSound = true; 
///////////////////////////////////////

var gameRatio = window.innerWidth/window.innerHeight;
var maxX  = 720;
var maxY  = 1280;

//////////////////////////////////

let sndWin, sndLose, sndDraw, sndP1Move, sndP2Move;

let userPoints=1000, p2pPoints = 50;
let isDesktop = false;
////////////////////////////////////////////////////////////////////////////////////////

let tempUserName = 'Player X';
let userName = tempUserName;

let tempUserAvatarImgUrl = `url('./assets/avatar/avatar_none.png')`;
let userAvatarImgUrl = tempUserAvatarImgUrl;

let oppoAvatarImgUrl = `url('./assets/avatar/avatar_none.png')`;

let isAI = false; 

let gameMode = 'playerVsAI';//'playerVsPlayer';//'multiplayer';
////////////////////////////////////////////////////////////////////////////////////////


window.onload = function()
{
    if(detectDevice())
        isDesktop = true;
    else
        isDesktop = false;

    var encodedURL = window.location;//parent.window.location.href;//window.location;//.href;
    url_string = decodeURIComponent(encodedURL);

    var url = new URL(url_string);

    var paramValue = url.searchParams.get("jfTds4sls");

    // if(paramValue == "julGtFrDS")
    {
        document.getElementById("loader").style.display = "none";  
        setTimeout(()=>{
                hideLogo();
                showSplash(); 
        },2000);
        setTimeout(()=>{
                hideSplash(); 
                showMenu();  
        },4000);

        handleEvents();
        loadSounds();
    }


    // ?jfTds4sls=julGtFrDS

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
        if(detectDevice())
            isDesktop = true;
        else
            isDesktop = false;

        console.log("User is on:", detectDevice());
    
    } 


};

///////////////////////////////////////////////////////////////////////////////
function loadSounds(){
    sndWin = new Audio("assets/media/win.mp3");
    sndLose = new Audio("assets/media/lose.mp3");
    sndDraw = new Audio("assets/media/draw.mp3");
    sndP1Move = new Audio("assets/media/p1move.mp3");
    sndP2Move = new Audio("assets/media/p2move.mp3");
    
}

function hideLogo() {
    document.getElementById("logo").style.display = "none"; 
}
function showSplash() {
    document.getElementById("splash").style.display = "block";  
}
function hideSplash() {
    document.getElementById("splash").style.display = "none";  
}
function showMenu()
{
    document.getElementById('menu-point').innerHTML = "Available points: "+userPoints;
    document.getElementById("main-menu").style.display = "flex";  
    document.getElementById("restart").style.display = "block"; 
    document.getElementById("playAgain").style.display = "block"; 
    
}
function hideMenu()
{
    document.getElementById("main-menu").style.display = "none";  
}
function showProfile()
{
    document.getElementById('profile-container').style.display= "flex";
}
function hideProfile()
{
    document.getElementById('profile-container').style.display= "none";
}
function showInfo()
{
    str1 = `You have ${userPoints} points`;
    document.getElementById("sub-title").innerHTML = str1;
    str2 = `${p2pPoints} points will be deducted.`;
    document.getElementById("text-content").innerHTML = str2
    document.getElementById("info").style.display = "flex"; 
}
function hideInfo()
{
    str1 = ` `;
    document.getElementById("sub-title").innerHTML = str1;
    str2 = ` `;
    document.getElementById("text-content").innerHTML = str2
    document.getElementById("info").style.display = "none"; 

}
function showConfig()
{
    console.log(`Available Pointssssss: ${userPoints}`);
    document.getElementById("config-point").innerHTML = `Available Points: ${userPoints}`;
    document.getElementById("main").style.display="block";
    console.log(`userName = ${userName}`);
}
function cancelSetting()
{
	document.getElementById('selected-avatar').style.backgroundImage = userAvatarImgUrl;
	// userName = tempUserName = "";	
	document.getElementById("player1_name").value = userName;
	document.getElementById("user-name").value = userName;
	
}
function saveSetting()
{
	userAvatarImgUrl = tempUserAvatarImgUrl;
	document.getElementById('player1Avatar').style.backgroundImage = userAvatarImgUrl;
    document.getElementById('player2Avatar').style.backgroundImage = oppoAvatarImgUrl;

    userName = tempUserName;
    document.getElementById("player1_name").value = userName;
    
}
//-------------------------------------------------------------------------------------------------------
function handleEvents()
{
	document.querySelector('#btn-player-vs-player').addEventListener('click', handlePvsP);
	// document.querySelector('#btn-player-vs-ai').addEventListener('click', handlePvsAi); 
    // document.querySelector('#btn-multiplyer').addEventListener('click', handleMultiplayer);

	document.querySelector('#btn-sound').addEventListener('click', handleSound);
	// document.querySelector('#btn-profile').addEventListener('click', handleProfile);
	
	document.querySelector('#btn-info-continue').addEventListener('click', handleInfoContinue); 
	document.querySelector('#btn-back').addEventListener('click', handleInfoBack); 

	document.querySelector('#btn-save').addEventListener('click', handleSave); 
	document.querySelector('#btn-profile-continue').addEventListener('click', handleProfileContinue); 
	document.querySelector('#btn-profile-back').addEventListener('click', handleProfileBack);

	document.querySelector('#avatar_0').addEventListener('click', handleAvatarSel);
	document.querySelector('#avatar_1').addEventListener('click', handleAvatarSel);
	document.querySelector('#avatar_2').addEventListener('click', handleAvatarSel);
	document.querySelector('#avatar_3').addEventListener('click', handleAvatarSel);
	document.querySelector('#avatar_4').addEventListener('click', handleAvatarSel);
	document.querySelector('#avatar_5').addEventListener('click', handleAvatarSel);

	document.getElementById("user-name").addEventListener("focus", function() {
        this.value = "";
    });
    document.getElementById("user-name").addEventListener("blur", function () {
        var value = this.value.trim();
        tempUserName = value;
        
    });
}
function handlePvsAi() {
    gameMode = 'playerVsAI';
	isAI = true;
	hideMenu();
    showInfo();
}
function handlePvsP()
{
    gameMode = 'playerVsPlayer';
	isAI = false;
    hideMenu();
    showInfo();
}
function handleMultiplayer()
{
    document.getElementById("restart").style.display = "none"; // hide back button on gameplay screen
    document.getElementById("playAgain").style.display = "none"; // hide playAgain button on gameplay screen
    gameMode = 'multiplayer';
    isAI = false;
    hideMenu();
    showInfo();

}

function handleInfoContinue()
{
    if(gameMode === 'multiplayer')
    {
        hideInfo();
        showConfig();
        isStepValueValid = isColValueValid = isRowValueValid = true;
        handleStart();
        socket = io();
        multiplayer();
    }    
    else
    {
        hideInfo();
        showConfig();
    }    
}
function handleInfoBack() {
    hideInfo();
    showMenu();
}
function handleProfile() {
    hideMenu();
    showProfile();
}
function handleProfileBack()
{
	cancelSetting();
    hideProfile();
    showMenu();
}
function handleSave()
{
	saveSetting();	
}
function handleProfileContinue()
{
	hideProfile();
    showInfo();
}
let handleAvatarSel = (event) => {
    // console.log("Clicked image source:", event.srcElement.id);
    tempUserAvatarImgUrl = `url('./assets/avatar/${event.srcElement.id}.png')`;
    document.getElementById('selected-avatar').style.backgroundImage = tempUserAvatarImgUrl;
   
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
    //return this.game.rnd.integerInRange(min,max);
}

function detectDevice() {
    if (window.innerWidth <= 768 || /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        return "Mobile";
    }
    isDesktop = true;
    return "Desktop";
}

