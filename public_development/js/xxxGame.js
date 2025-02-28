

var text = [];// Array(10);
var isEnableClick = false;

//------------------------------
let style1,style2,style3,style4;
let outScreen=10;
let imgCardBack = Array(4);
let imgCardFront = Array(4);
let gameTexts;

let totalCashBackFont;
let totalCashbackAmount = 0;
let totalCashbackAmountFont;
let totalPointsFont;
let totalPointsAmountFont;
let totalPointsAmount = 0;
let tagLine;

let frameKeys = [];    
let frameKeysBG = [];  
let frameKeysStar1 = [];
let frameKeysStar2 = [];
let frameKeysStar3 = [];

let bgSound, cardSound, coinSound, cardDeckSound, sparkleSound;
let imgSoundOn, imgSoundOff;

let numberOfBG = 34;

let imgDestinyText;
let imgCongrats;
let placeHolderScale = 0.40;
let startX =-1.5, startY=-0.8;
let finalX = 0.0, finalY = -0.8; 
let card = [
    {x : -0.65, y : 0.0},
    {x :   0.0, y : 0.0},
    {x :  0.65, y : 0.0},
];    
let cardX = 0.0, cardY = 0.0;
let startingScale = 0.5;
let finalScale = 1.25;

let isShowCongrats = false;
let imgFillRed, imgFillWhite;

//------------------------
// ---------- server data --------------------
let isGoldCard = false; // update from server
let oldPoints = 0;
let oldCashBack = 15;
let messageText = '10000 Points';
let pointsEarned = 0;
//------------------------------
Game.TTTGame = function(game)
{
    this.ready = false;
};
Game.TTTGame.prototype = 
{

    init: function()
    {

        PAGE = GAMEPLAY;
        
    },
    preload : function()
    {
        
    },
    create :function()
    {
        game = this.game;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.background = '#2d2d2d';
        bgAnimation();
        bg = this.game.add.sprite(0, 0, 'bg');
        // coinShower();
        style1 = { font: '18pt DegularDisplay', fill: 'black', align: 'center', wordWrap: true, wordWrapWidth: 400 };
        style2 = { font: '18pt DegularDisplay', fill: 'red', align: 'center', wordWrap: true, wordWrapWidth: 420 };
        style3 = { font: '18pt DegularDisplay', fill: 'white', align: 'left', wordWrap: true, wordWrapWidth: 400 };
        style4 = { font: '30pt DegularDisplay', fill: 'white', align: 'center', wordWrap: true, wordWrapWidth: 400 };
        style5 = { font: '14pt DegularDisplay', fill: 'black', align: 'center', wordWrap: true, wordWrapWidth: 400 };
        style6 = { font: '28pt DegularDisplay', fill: '#f9e880', align: 'center', wordWrap: true, wordWrapWidth: 450 };
        
        
       


        
        
        pointBar(0);
        drawHUD();

        totalPointsAmountFont = game.add.text(XPos(-0.65),YPos(0.875), ""+totalPointsAmount, style2);
        totalPointsAmountFont.anchor.set(0.5,0.5);
        
        totalCashbackAmountFont = game.add.text(XPos(0.65),YPos(0.875), ""+totalCashbackAmount, style3);
        totalCashbackAmountFont.anchor.set(0.5,0.5);
        
        let cardKey = 'card-back-golden';
        for(var i=0;i<imgCardBack.length;i++)
        {
            switch(i)
            {
                case 0 : cardKey = 'card-back-red'; break;
                case 1 : cardKey = 'card-back-white'; break;
                case 2 : cardKey = 'card-back-golden'; break;
                case 3 : cardKey = 'card-back-golden'; break;
            }
            imgCardBack[i] = this.add.button(XPos(outScreen),YPos(0.0),cardKey); 
            imgCardBack[i].anchor.set(.5,.5);
            imgCardBack[i].scale.setTo(0.75,0.75);

            // imgCardFront[i]    = this.add.button(XPos(0.0),YPos(0.0),'card-front'); 
            // imgCardFront[i].anchor.set(.5,.5);
            // imgCardFront[i].scale.setTo(0.5,0.5);
        }    

        // tagLine = game.add.text(XPos(0.0),YPos(-0.6), `Choose Your Destiny`, style4);
        // tagLine.anchor.set(0.5,0.5);

        imgDestinyText = this.add.button(XPos(0.0),YPos(-0.525),'destiny'); //Choose Your Destiny
        imgDestinyText.anchor.set(.5,.5);
        imgDestinyText.scale.setTo(1.25,1.25);

        showTagLine(true);
        setTimeout(()=>{
            createDeck();        
        },2000);
        
        imgFillRed = this.add.button(XPos(-0.13),YPos(0.90),'red'); 
        imgFillRed.anchor.set(.5,.5);
        imgFillRed.scale.setTo(0.35,0.35);
        imgFillRed.visible = false;

        imgFillWhite = this.add.button(XPos(0.13),YPos(0.90),'white'); 
        imgFillWhite.anchor.set(.5,.5);
        imgFillWhite.scale.setTo(0.35,0.35);
        imgFillWhite.visible = false;

       /* snd_checkpoints = this.add.audio('sndcheckpoints');
        // snd_gameover = this.add.audio('sndgameover');
        snd_outtime = this.add.audio('sndouttime');
        snd_questionmedium = this.add.audio('sndquestionmedium');
        snd_questionmedium.loop = true;
        
        bgSound = this.add.audio('bgsound');
        bgSound.loop = true;
        bgSound.play();
        


        cardSound = this.add.audio('cardsound');

        coinSound = this.add.audio('coinsound');

        cardDeckSound = this.add.audio('carddecksound');
        
        sparkleSound = this.add.audio('sparklesound'); */
        
        imgSoundOn = this.add.button(XPos(0.8),YPos(-0.90),'soundon'); 
        imgSoundOn.anchor.set(.5,.5);
        imgSoundOn.scale.setTo(0.35,0.35);

        imgSoundOff = this.add.button(XPos(0.8),YPos(-0.90),'soundoff'); 
        imgSoundOff.anchor.set(.5,.5);
        imgSoundOff.scale.setTo(0.35,0.35);

        if(bgSound.isPlaying)
        {
            imgSoundOn.visible = true;
            imgSoundOff.visible = false;
        
        } 

        imgPopup = game.add.sprite(maxX/2,maxY/2,'popup');
        imgPopup.anchor.set(.5,.5);
        imgPopup.visible = false;

        imgCongrats = game.add.sprite(XPos(0.0),YPos(0.0),'congrats');
        imgCongrats.anchor.set(.5,.5);
        imgCongrats.visible = false;    

        imgPopupForPoints = game.add.sprite(maxX/2,maxY/2,'popupforpoints');
        imgPopupForPoints.anchor.set(.5,.5);
        imgPopupForPoints.visible = false;

        imgBtnClose = game.add.button(XPos(0.625),YPos(0.285),'btnclose');
        imgBtnClose.anchor.set(.5,.5);
        imgBtnClose.scale.setTo(0.75,0.75);
        imgBtnClose.visible = false;

        imgBtnClose.events.onInputDown.add(this.ClosePressed, this);
        imgBtnClose.events.onInputUp.add(this.CloseReleased, this);

        
        imgSoundOn.events.onInputDown.add(this.soundonPressed, this);
        imgSoundOn.events.onInputUp.add(this.soundonReleased, this);

        imgSoundOff.events.onInputDown.add(this.soundoffPressed, this);
        imgSoundOff.events.onInputUp.add(this.soundoffReleased, this);
        
        imgCardBack[0].events.onInputDown.add(this.openCard0Pressed, this);
        imgCardBack[0].events.onInputUp.add(this.openCard0Released, this);

        imgCardBack[1].events.onInputDown.add(this.openCard1Pressed, this);
        imgCardBack[1].events.onInputUp.add(this.openCard1Released, this);

        imgCardBack[2].events.onInputDown.add(this.openCard2Pressed, this);
        imgCardBack[2].events.onInputUp.add(this.openCard2Released, this);

         

            
        
    
    }, // end of create

    openCard0Pressed : function()
    {
            
    },
    openCard0Released : function()
    {
        if(isEnableClick)
        {
            isEnableClick = false;
            tweenSelectedCard(1); // red
        }    
    },

    openCard1Pressed : function()
    {
            
    },
    openCard1Released : function()
    {
        if(isEnableClick)
        {
            isEnableClick = false;
            tweenSelectedCard(2); // white
            
        }   
    },

    openCard2Pressed : function()
    {
            
    },
    openCard2Released : function()
    {
        if(isEnableClick)
        {
            isEnableClick = false;
            tweenSelectedCard(3); // gold
            
        }  
    },

    
    soundonPressed : function()
    {   
        imgSoundOn.scale.setTo(0.30);
    },
    soundonReleased : function()
    {
        imgSoundOn.scale.setTo(0.35);
        imgSoundOn.visible = false;
        imgSoundOff.visible = true;
        /*if(bgSound.isPlaying)
            bgSound.stop();   */
        
    },
    soundoffPressed: function()
    {
        imgSoundOff.scale.setTo(0.30);
    },
    soundoffReleased : function()
    {
        imgSoundOff.scale.setTo(0.35);
        imgSoundOn.visible = true;
        imgSoundOff.visible = false;
        /*if(!bgSound.isPlaying)
            bgSound.play();  */  
            
    },
    
    ClosePressed : function()
    {
        imgBtnClose.scale.setTo(0.8);
    },
    CloseReleased : function()
    {
        closePopup();  
    },
    update : function()
    {
                 
        
    },// end of update
  
}// end of prototype

//-------------------------- functions ----------------------------------------

let myCloseTimer = null;
let denominationArray = [];
/*
baseConfiguration(
    {
        gratification_denomination:[{"label":"20","amount":"10"},{"label":"75","amount":"20"}],
        closetimer:10
    }
)
*/
let startXOfMileStoneCoin = -0.725;
let gapX = 0.014;//0.015;
let deviation = 0.000028;
function baseConfiguration(baseConfigObj)
{
    //console.log(`baseConfigObj `,baseConfigObj);
    // (closetimer,gratification_denomination)
    /*
    sample object
    {
        gratification_denomination:[{"label":"20","amount":"10"},{"label":"25","amount":"20"}],
        closetimer:10 //ms if > 0 then timer work otherwise it will not work
    }
     */   
    if(baseConfigObj.closetimer > 0)
        myCloseTimer = 1000*baseConfigObj.closetimer;

    // denominationArray = JSON.parse(baseConfigObj.gratification_denomination);

    baseConfigObj.gratification_denomination.forEach((item, index) => {
        // Display the label and amount on the screen
        let text = `Label: ${item.label}, Amount: ${item.amount}`;
        console.log(`text: ${text}`);
        deviation = deviation*item.label;
        let xxx = startXOfMileStoneCoin+item.label*gapX+deviation;
        if(xxx > 0.725)
            xxx = 0.725;
        console.log('------- xxx = ',xxx);
        mileStoneCoinX.push(xxx); // = [-0.725,0.0,0.76];
        RsAmount.push(item.amount); 
        pointMileStone.push(item.label); 
        // game.add.text(50, 50 + (index * 30), text, { font: '16px Arial', fill: '#ffffff' });
    });
   
    pointBar(0);
}


//userDetails(50,30,0,1,1,"https://cdn.phaserfiles.com/v385/assets/sprites/bunny.png")
/*
userDetails(
{
    total_points:90,
    total_cashback:10,
    red_filled:0,
    white_filled:0,
    gold_filled:0,
    gold_image:"https://cdn.phaserfiles.com/v385/assets/sprites/bunny.png"
})
*/
function userDetails(userDetailsObj)
{
    //(total_points,total_cashback,red_filled,white_filled,gold_filled,gold_image)
    totalPointsAmount = userDetailsObj.total_points;
    totalPointsAmountFont.setText(`${totalPointsAmount}`);
    oldPoints = userDetailsObj.total_points;

    totalCashbackAmount = userDetailsObj.total_cashback;
    totalCashbackAmountFont.setText(`${totalCashbackAmount}`);
    pointBar(0);

    /*total_cashback:10,
    red_filled:1, // Possbile values  - 0,1
    white_filled:1, // Possbile values  - 0,1
    gold_filled:1, // Possbile values  - 0,1
    gold_image:""*/

    imgFillRed.visible = false;
    imgFillWhite.visible = false;

    if(userDetailsObj.red_filled == 1)
        imgFillRed.visible = true;
    if(userDetailsObj.white_filled == 1)
        imgFillWhite.visible = true;
    if(userDetailsObj.gold_filled == 1)
    {
        game.load.image('dynamicImage', userDetailsObj.gold_image); // gift.image is an url
        game.load.start();
        game.load.onLoadComplete.addOnce(() => {
            let reward = game.add.sprite(XPos(0.0), YPos(0.475), 'dynamicImage');
            reward.anchor.set(0.5); // Center the reward
            reward.scale.setTo(0.25);    
            showRewardTween(reward);
        }); 
    }
}


// currentGratification("points",null,5,60,"You will always receive a message")
/*
currentGratification({
    type:"gold_card",
    gift:{"image":"https://cdn.phaserfiles.com/v385/assets/sprites/bunny.png", name:"gratification name"},
    points:100,
    cashback:20,
    message:"You will always receive a message"
})
currentGratification({
    type:"points",
    gift:null,
    points:20,
    cashback:20,
    message:"You will always receive a message"
})
*/
let cashBackToBeAdd = 0;
function currentGratification(gratificationObj)
{
    //(type,gift,points,cashback,message)

    /*type:"red_card" // Possbile values  - "red_card","points","white_card","gold_card",
    gift:{"image":"Image Link", name:"gratification name"}, // Possible Values null
    points:100, // null
    cashback:20,//Total
    message:"You will always receive a message"*/

/*      case 1: rewardKey = 'won-red'; break; // red card
        case 2: rewardKey = 'won-white'; break;  // white card
        case 3: rewardKey = 'won-gold'; break;  // scratch card
        case 4: rewardKey = 'won-2'; break; // 2 points
        case 5: rewardKey = 'won-5'; break; // 5 points        
        case 6: rewardKey = 'won-10'; break; // 10 points            
        case 7: rewardKey = 'won-20'; break; // 20 points            
        case 8: rewardKey = 'won-40'; break; // 40 points    
*/
    cashBackToBeAdd = gratificationObj.cashback;
    // totalCashbackAmountFont.setText(`${totalCashbackAmount}`); 
    messageText = gratificationObj.message;
    switch(gratificationObj.type)
    {
        case "points": 
            pointsEarned = gratificationObj.points;
            switch(pointsEarned)
            {
                case 2:  rewardId = 4; break;
                case 5:  rewardId = 5; break;
                case 10: rewardId = 6; break;
                case 20: rewardId = 7; break;
                case 40: rewardId = 8; break;
            }
            openReward(rewardId);
        break; 
        case "red_card":rewardId = 1;   openReward(rewardId);   break; 
        case "white_card":rewardId = 2; openReward(rewardId);   break;  
        case "gold_card":rewardId = 3;
            game.load.image('dynamicImage', gratificationObj.gift.image); // gift.image is an url
            game.load.start();
            game.load.onLoadComplete.addOnce(() => {
                openReward(rewardId);
            }); 
            // messageText = gratificationObj.gift.name;
            isShowCongrats = true;
        break;      
    }
     
    
    // 

}
/*{
    // -----------------------------
    let imageUrl = gift.image;//'https://cdn.phaserfiles.com/v385/assets/sprites/bunny.png';
        game.load.image('dynamicImage', imageUrl);

        game.load.onLoadComplete.addOnce(() => {
            // Add the sprite only after the image is loaded
            
            imgScratchCover = game.add.sprite(game.world.centerX, game.world.centerY, 'dynamicImage');
            imgScratchCover.anchor.set(0.5); // Center the cover
            imgScratchCover.scale.setTo(0.95); //(0.25)
            
            openReward(rewardId);

        });

    // Start the loading process
        game.load.start();
   // -----------------------------  
}*/
function errorCase(errorText)
{
    // errorCase("ERROR Message will pass on")
    imgBtnClose.visible = true;
    imgPopup.visible = true;
    howToPlayFont = game.add.text(XPos(0.0),YPos(0.0), `${errorText}`, style3);
    howToPlayFont.anchor.set(0.5,0.5);    
}

let aniColor = 0xffffff;
let clrCounter = 0;
function lineAnimation(maxIterations,loopTime,cardX,cardY)
{
    let animatedSprite = game.add.sprite(cardX,cardY, 'lineani10');
        animatedSprite.anchor.set(0.5);
        animatedSprite.scale.setTo(0.5,0.5);

        
    for (let i = 0; i < 20; i++) {
        frameKeys.push(`lineani${i}`);
    }
    
    let cord = [
        {x: 0.0, y: 0.0},
        {x: -0.1, y: 0.1},
        {x: 0.2, y: -0.1},
        {x: 0.1, y: 0.2},
    ];
    
    

    let currentFrame = 0; // Start with the first frame
    let iterations = 0;
    
    let animationLoop = game.time.events.loop(loopTime, () => 
    { // Change frame every 100ms
        //console.log('frameKeys[currentFrame] ',frameKeys[currentFrame]);
        
        if(currentFrame == 0)
        {
            animatedSprite.tint = aniColor;
            /*if(iterations%2 == 0)
                animatedSprite.tint = 0xff0000;*/

            if (iterations < maxIterations) {
                // animatedSprite.x = XPos(cord[iterations%4].x);
                // animatedSprite.y = YPos(cord[iterations%4].y)
            }
            iterations++;
        } 
        
        if(currentFrame == 5)
        {
            sparkleSound.play();  
            // console.log(`sparkleSound currentFrame ${currentFrame}`);
            if(clrCounter%2 == 0)
                aniColor = 0xffffff;
            else
                aniColor = 0xff0000;
            clrCounter++;
            // console.log(`rrrrrr clrCounter  =  ${clrCounter}`);

        }   
        currentFrame = (currentFrame+1) % frameKeys.length; // Loop to next frame
        
        if (iterations > maxIterations) {
            game.time.events.remove(animationLoop); // Remove the loop
        }

        animatedSprite.loadTexture(`${frameKeys[currentFrame]}`);
    });

    
}
let forward = true;
function bgAnimation()
{
    // console.log(`numberOfBG ${numberOfBG}`)
    let animatedSpriteBG = game.add.sprite(XPos(0.0),YPos(0.0), 'bgani0');
        animatedSpriteBG.anchor.set(0.5);
        // animatedSprite.scale.setTo(0.25,0.25);

    let bgCover = game.add.sprite(XPos(0.0),YPos(0.0), 'bgcover');
        bgCover.anchor.set(0.5);    
        
       
    for (let i = 0; i < numberOfBG; i++) {
        frameKeysBG.push(`bgani${i}`);
    }
    
    let currentFrame = 0; // Start with the first frame
    
    let animationLoop = game.time.events.loop(50, () => 
    { // Change frame every 100ms
        //console.log('frameKeys[currentFrame] ',frameKeys[currentFrame]);
        // console.log(`currentFrame ${currentFrame}`);

        animatedSpriteBG.loadTexture(`${frameKeysBG[currentFrame]}`);
        currentFrame = (currentFrame+1) % frameKeysBG.length; // Loop to next frame

        /*if (forward) {
          currentFrame++;
          if (currentFrame === frameKeysBG.length - 1) {
            forward = false; // Reverse direction at the end
          }
        } else {
          currentFrame--;
          if (currentFrame === 0) {
            forward = true; // Forward direction at the start
            // iterations++; // Complete forward-reverse cycle
          }
        }*/



    });


    
}
function starAnimation1()
{
    let animatedSpriteStar1 = game.add.sprite(XPos(0.0),YPos(0.0), 'starani10');
        animatedSpriteStar1.anchor.set(0.5);
        animatedSpriteStar1.scale.setTo(0.95,0.95);
    
    animatedSpriteStar1.tint = Math.random() * 0xffffff;
    for (let i = 0; i < 16; i++) {
        frameKeysStar1.push(`starani${i}`);
    }
    let maxIterations = 32;
    let iterations = 0;
    let currentFrame = 0; // Start with the first frame
    
    let animationLoop = game.time.events.loop(100, () => 
    { 
        animatedSpriteStar1.loadTexture(`${frameKeysStar1[currentFrame]}`);
        currentFrame = (currentFrame+1) % frameKeysStar1.length; // Loop to next frame

        iterations++; // Complete forward-reverse cycle
        if (iterations > maxIterations) {
          game.time.events.remove(animationLoop); // Remove the loop
        }
    });
    sparkleSound.play();
}
function starAnimation2()
{
    let animatedSpriteStar2 = game.add.sprite(XPos(-0.3),YPos(0.0), 'starani10');
        animatedSpriteStar2.anchor.set(0.5);
        animatedSpriteStar2.scale.setTo(0.5,0.5);
    
    animatedSpriteStar2.tint = Math.random() * 0xffffff;
    for (let i = 0; i < 16; i++) {
        frameKeysStar2.push(`starani${i}`);
    }
    let maxIterations = 32;
    let iterations = 0;
    let currentFrame = 0; // Start with the first frame
    
    let animationLoop = game.time.events.loop(100, () => 
    { 
        animatedSpriteStar2.loadTexture(`${frameKeysStar2[currentFrame]}`);
        currentFrame = (currentFrame+1) % frameKeysStar2.length; // Loop to next frame
        iterations++; // Complete forward-reverse cycle
        if (iterations > maxIterations) {
          game.time.events.remove(animationLoop); // Remove the loop
        }
    });
    sparkleSound.play();
}
function starAnimation3()
{
    let animatedSpriteStar3 = game.add.sprite(XPos(0.3),YPos(0.0), 'starani10');
        animatedSpriteStar3.anchor.set(0.5);
        animatedSpriteStar3.scale.setTo(0.5,0.5);
    
    animatedSpriteStar3.tint = Math.random() * 0xffffff;
    for (let i = 0; i < 16; i++) {
        frameKeysStar3.push(`starani${i}`);
    }
    let maxIterations = 32;
    let iterations = 0;
    let currentFrame = 0; // Start with the first frame
    
    let animationLoop = game.time.events.loop(100, () => 
    { 
        animatedSpriteStar3.loadTexture(`${frameKeysStar3[currentFrame]}`);
        currentFrame = (currentFrame+1) % frameKeysStar3.length; // Loop to next frame
        iterations++; // Complete forward-reverse cycle
        if (iterations > maxIterations) {
          game.time.events.remove(animationLoop); // Remove the loop
        }
    });
    sparkleSound.play();
}


/*------------------------------------------------------*/



/*-------------------------------------------------------*/

function showTagLine(isShow)
{
    
    if(isShow)
    {
        imgDestinyText.alpha = 0;    
        game.add.tween(imgDestinyText).to(
            { alpha: 1 },
            2000,
            Phaser.Easing.Linear.None,
            true
        );
    }
    else
    {
        imgDestinyText.alpha = 1;    
        game.add.tween(imgDestinyText).to(
            { alpha: 0 },
            2000,
            Phaser.Easing.Linear.None,
            true
        );
    }    

    let yoyoTween = game.add.tween(imgDestinyText.scale).to(
        { x: 1.3, y: 1.3},
        1000,
        Phaser.Easing.Quadratic.InOut, // Easing function
        true, // Auto start
        1000, // Delay
        -1, // Infinite loop (-1)
        true // Enable yoyo (back and forth movement)
    )
}

function createDeck()
{
    getDeckOnScreen();
    
    setTimeout(()=>{
        throwCardFromDeck(imgCardBack[0], card[0].x,card[0].y);
        
    },1000);
    setTimeout(()=>{
        throwCardFromDeck(imgCardBack[1], card[1].x,card[1].y);
        
    },2000);
    setTimeout(()=>{
        throwCardFromDeck(imgCardBack[2], card[2].x,card[2].y);

    },3000);

    setTimeout(()=>{
        removeDeckFromScreen(imgCardBack[3]);
    
    },4000);

}

function getDeckOnScreen()
{
    cardDeckSound.play();
    for(var i=0;i<imgCardBack.length;i++)
    {
        imgCardBack[i].x = XPos(startX);
        imgCardBack[i].y = YPos(startY);
        //}
        game.add.tween(imgCardBack[i]).to(
          { x: XPos(finalX), y: YPos(finalY) },
          500, // Duration (ms)
          Phaser.Easing.Quadratic.Out, // Easing type
          true // Auto start
        );

        imgCardBack[i].alpha = 0.0;
        game.add.tween(imgCardBack[i]).to(
          { alpha: 1 },
          1000,
          Phaser.Easing.Linear.None,
          true
        );
    }
}
function throwCardFromDeck(card, destX, destY)
{
    cardDeckSound.play();
    game.add.tween(card).to(
          { x: XPos(destX), y: YPos(destY) },
          500, // Duration (ms)
          Phaser.Easing.Quadratic.Out, // Easing type
          true // Auto start
    );
    game.add.tween(card).to(
      { angle: 360 },
      500,
      Phaser.Easing.Linear.None,
      true
    );
    game.add.tween(card.scale).to(
      { x: 0.95, y: 0.95},
      300,
      Phaser.Easing.Linear.None,
      true
    );
}
function removeDeckFromScreen(card)
{
    cardDeckSound.play();
    game.add.tween(card).to(
        { x: XPos(-1.65)},
        500, // Duration (ms)
        Phaser.Easing.Quadratic.Out, // Easing type
        true // Auto start
    ).onComplete.add(() => {
      isEnableClick = true;
    });
}

let clickedOn = 1;
let selCardTween;
function tweenSelectedCard(_clickedOn)
{
    sparkleSound.play();
    const cardIndex = _clickedOn-1;
    clickedOn = _clickedOn;
    let cardType = 'xxx';
    switch(_clickedOn)
    {
        case 1: cardX = XPos(card[0].x); cardY = YPos(card[0].y); cardType = 'red';break;
        case 2: cardX = XPos(card[1].x); cardY = YPos(card[1].y); cardType = 'white';break;
        case 3: cardX = XPos(card[2].x); cardY = YPos(card[2].y); cardType = 'gold';break;            
    }
    
    sendGameEvent("cardOpen", { cardType: cardType });
    lineAnimation(2,50,cardX,cardY);
    
    selCardTween = game.add.tween(imgCardBack[cardIndex].scale).to(
        { x: 0, y: 1 }, // Shrink horizontally, slight vertical compression
        1000,
        // Phaser.Easing.Linear.None,
        Phaser.Easing.Quadratic.InOut, // Easing function
        true, // Auto start
        1000, // Delay
        -1, // Infinite loop (-1)
        true // Enable yoyo (back and forth movement)
    );

}

function openReward(rewardId)
{
    selCardTween.stop();      // Stops the tween
    selCardTween.onComplete.removeAll(); // Removes any event listeners

    sparkleSound.play();    
    let indexToBeRemove1,indexToBeRemove2; 
    const cardIndex = clickedOn-1;
    switch(cardIndex)
    {
        case 0: indexToBeRemove1 = 1, indexToBeRemove2 = 2; break;
        case 1: indexToBeRemove1 = 0, indexToBeRemove2 = 2; break;
        case 2: indexToBeRemove1 = 0, indexToBeRemove2 = 1; break;
    }
    // var rewardId = getRandomInt(4,5); // for testing
    let rewardKey;
    switch(rewardId)
    {
        case 1: rewardKey = 'won-red'; break; // red card
        //case 2: rewardKey = 'and'; break;
        case 2: rewardKey = 'won-white'; break;  // white card
        case 3: rewardKey = 'won-gold'; break;  // scratch card
        case 4: rewardKey = 'won-2'; break; // 2 points
        case 5: rewardKey = 'won-5'; break; // 5 points        
        case 6: rewardKey = 'won-10'; break; // 10 points            
        case 7: rewardKey = 'won-20'; break; // 20 points            
        case 8: rewardKey = 'won-40'; break; // 40 points            
    }
    // for(var i=0; i<40;i++)
    //     console.log(`getRandomInt(1,4) ${getRandomInt(1,3)}`);
    
    switch(clickedOn)
    {
        case 1: cardX = XPos(card[0].x); cardY = YPos(card[0].y); break;
        case 2: cardX = XPos(card[1].x); cardY = YPos(card[1].y); break;
        case 3: cardX = XPos(card[2].x); cardY = YPos(card[2].y); break;            
    }
    
    //console.log(`cardY ${cardY}, card[0].y ${card[0].y}`);
    // showFrillEmmiter(20,cardX,cardY,2);

    lineAnimation(2,50,cardX,cardY);//(maxIterations,loopTime,cardX,cardY);

/*
    game.add.tween(imgCardBack[cardIndex].scale).to(
      { x: 0 },
      300,
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
      imgCardBack[cardIndex].loadTexture('card-front'); // Change to card's back
      game.add.tween(imgCardBack[cardIndex].scale).to({ x: 0.75, y: 0.75 }, 300, Phaser.Easing.Linear.None, true);
        setTimeout(()=>{
            placeInCenter(imgCardBack[cardIndex]);  
            showCoinAnimation();
        },1000);
    });*/


    // Step 1: Animate scale.x to 0 (shrink horizontally with slight scale.y adjustment for tilt)
  let shrinkTween = game.add.tween(imgCardBack[cardIndex].scale).to(
    { x: 0, y: 0.35 }, // Shrink horizontally, slight vertical compression
    300,
    Phaser.Easing.Linear.None,
    true
  );

  // Step 2: At the midpoint, change the texture
  shrinkTween.onComplete.addOnce(() => {
    imgCardBack[cardIndex].loadTexture(rewardKey);//('card-front'); // Swap to the new texture
    
    //('card-front'); // Swap to the new texture

    // Step 3: Animate scale.x back to 1 (expand horizontally with reverse tilt)
    game.add.tween(imgCardBack[cardIndex]).to(
      { angle: 0 },
      500,
      Phaser.Easing.Linear.None,
      true
    );
    game.add.tween(imgCardBack[cardIndex].scale).to(
      { x: 1, y: 1 }, // Reset both scale.x and scale.y
      300,
      Phaser.Easing.Linear.None,
      true
    );
    setTimeout(()=>{
        removeOther2Cards(imgCardBack[indexToBeRemove1],imgCardBack[indexToBeRemove2]);
        placeSelectedCardInCenter(imgCardBack[cardIndex],rewardId);  
        showTagLine(false);
        if(rewardId >= 4) // 4 5 6
            showCoinAnimation(rewardId);
    },2500);
  });

}
function removeOther2Cards(card1, card2)
{
    game.add.tween(card1).to(
        { alpha: 0 }, // Move, fade, and shrink
        500, // Duration
        Phaser.Easing.Exponential.In,
        true
    );
    game.add.tween(card2).to(
        { alpha: 0 }, // Move, fade, and shrink
        500, // Duration
        Phaser.Easing.Exponential.In,
        true
    );

}
function showCoinAnimation(rewardId)
{
    let startX1 = XPos(-Math.random());
    let startY1 = YPos(-0.0);

    // Define the target position (e.g., coin counter at top-right)
    const targetX = XPos(-0.70);
    const targetY = YPos(0.90);

    // Call the function with the desired number of coins
    let path = [
      { x: XPos(0.07), y: YPos(0.1) },
      { x: XPos(0.02), y: YPos(0.3) },
      { x: XPos(-0.1), y: YPos(0.45) },
      { x: XPos(-0.25), y: YPos(0.60) },
      { x: XPos(-0.40), y: YPos(0.75) },
      { x: XPos(-0.7), y: YPos(0.90) },
      
    ];

    let loopCounter = 2;

    
    switch(rewardId)
    {
        case 4: loopCounter = 2; break; // 2 points
        case 5: loopCounter = 5; break; // 5 points
        case 6: loopCounter = 10; break; // 10 points
        case 7: loopCounter = 20; break; // 20 points
        case 8: loopCounter = 40; break; // 40 points
    }

    for(var i=0;i<loopCounter;i++){
        setTimeout(()=>{
            const max =  0.05;
            const min = -0.05;
            startX1 = XPos(Math.random() * (max - min) + min); //Math.random() * (max - min) + min   -0.5  -0.4
            startY1 = YPos(Math.random() * (max - min) + min);
            createMagneticCoinEffect(startX1, startY1, targetX, targetY, 10,path); 
            // createCoins(); 
            showFrillEmmiter(5,XPos(0.0),YPos(0.0),1);
        },1000+i*100);
    }

    // Optionally, update the coin counter after the animation
    setTimeout(() => {
        increaseCoins(rewardId,loopCounter);
    }, 3500); // Delay to match animation
}

// Math.random() * (max - min) + min

function createMagneticCoinEffect(startX3, startY3, targetX, targetY, numberOfCoins,path) {
  // Create a group to hold all the coins
  const coinGroup = game.add.group();

  for (let i = 0; i < numberOfCoins; i++) {
    // Create a coin at the start position
    const coin = game.add.sprite(startX3, startY3, 'coin');
    coin.anchor.set(0.5); // Center the coin
    coin.scale.setTo(0.5); // Initial scale
    coinGroup.add(coin);

    // Generate random offset for the starting position (for a burst effect)
    const offsetX = 0;//Math.random();//* 50 - 25; // Random offset between -25 and 25
    const offsetY = 0;//Math.random();//* 50 - 25;

    // console.log(`offsetX ${offsetX}, offsetY ${offsetY}`);

    // Create a tween to move the coin to the random offset
    coin.alpha = 0;
    const burstTween = game.add.tween(coin).to(
      { x: startX3 + offsetX, y: startY3 + offsetY, alpha: 1},
      100, // Burst duration
      Phaser.Easing.Quadratic.Out,
      true
    );

    // After the burst effect, move the coin to the target
    burstTween.onComplete.add(() => 
    {
        game.add.tween(coin).to(
            { angle: 45}, 
            3000, // Duration
            Phaser.Easing.Exponential.In, //Phaser.Easing.Linear.None,//
            true
        );        
        game.add.tween(coin.scale).to(
            { x: 0.1, y: 0.1}, 
            2500, // Duration
            Phaser.Easing.Exponential.In, //Phaser.Easing.Linear.None,//
            true
        );
        // const moveTween = 
        game.add.tween(coin).to(
                { x: path.map(p => p.x), y: path.map(p => p.y), alpha: 0 },
            //{ x: targetX, y: targetY, alpha: 0}, // Move, fade, and shrink
                3000, // Duration
                Phaser.Easing.Quadratic.InOut,//Phaser.Easing.Exponential.In,
                true
        ).onComplete.add(() => {
            coin.destroy();


            /*const moveTween = game.add.tween(coin).to(
                { x: targetX, y: targetY, alpha: 0}, // Move, fade, and shrink
                1000, // Duration
                Phaser.Easing.Exponential.In,
                true
            ).onComplete.add(() => {
                coin.destroy();
            }); */   
        });    
        
        // moveTween.interpolation(Phaser.Math.bezierInterpolation);
        
      // Destroy the coin after reaching the target
        /*moveTween.onComplete.add(() => {
            coin.destroy();
        });*/
    });
  }

  

}

function increaseCoins(rewardId,maxExecutions)
{
    // Update the coin counter (example)
    let incrementCounter = 1;
    /*let maxExecutions = 10; // Maximum number of times to run
    console.log(`rewardId: ${rewardId}`);
    switch(rewardId)
    {
        case 4: incrementCounter = 1; maxExecutions = 2;break; // 2 points
        case 5: incrementCounter = 1; maxExecutions = 5;break; // 5 points
        case 6: incrementCounter = 1; maxExecutions = 10;break; // 10 points
        case 7: incrementCounter = 1; maxExecutions = 20;break; // 20 points
        case 8: incrementCounter = 1; maxExecutions = 40;break; // 40 points
    }*/
    
    let counter = 0; // Counter to track executions
    
    // Define the interval function
    const intervalId = setInterval(() => {
      // console.log(`This is execution number ${counter + 1}`);
      coinSound.play();
      counter++; // Increment the counter
      
      totalPointsAmount += incrementCounter;
      /*oldPoints = totalPointsAmount;
      localStorage.setItem('oldPoints1',oldPoints);*/
      totalPointsAmountFont.setText(`${totalPointsAmount}`);
      
      /*// check points(20/50/100) for cash back 10/30/100
      //  
        if(totalPointsAmount >= 20 && totalPointsAmount < 50)
        {
            totalCashbackAmount = 10;
        }
        else if(totalPointsAmount >= 50 && totalPointsAmount < 100)
        {
            totalCashbackAmount = 40;
        }
        else if(totalPointsAmount >= 100)
        {
            totalCashbackAmount = 100;
        }    
        totalCashbackAmountFont.setText(`₹${totalCashbackAmount}`);*/


      if (counter >= maxExecutions) {
        clearInterval(intervalId); // Stop the interval after 10 executions
        // console.log('Interval cleared!');
        pointBar(totalPointsAmount);
        increaseCashBackAmount();
      }
    }, 100); // Runs every 1000ms (1 second)
    
}
function increaseCashBackAmount()
{

    // bhupesh has to pass a param if its true then only i have to increase the cashback amount
    let counter2 = 0; 
    let maxExecutions2 = cashBackToBeAdd; //10/30/100  
    /*if(totalPointsAmount >= 20 && totalPointsAmount < 50)
    {
        maxExecutions2 = 10;
    }
    else if(totalPointsAmount >= 50 && totalPointsAmount < 100)
    {
        maxExecutions2 = 30;
    }
    else if(totalPointsAmount >= 100)
    {
        maxExecutions2 = 100;
    } */

    if(maxExecutions2 > 0)
    {    
        const intervalId2 = setInterval(() => {
          
            coinSound.play();
            counter2++; // Increment the counter
            totalCashbackAmount += 1;
            totalCashbackAmountFont.setText(`${totalCashbackAmount}`);

            if (counter2 >= maxExecutions2) {
                clearInterval(intervalId2);
            }
        }, 100); // Runs every 1000ms (1 second)
    }    
}
function gameOver()
{
    console.log(`in gameOver`);
    showTagLine(true);
    // showFrillEmmiter(20,XPos(0.0),YPos(0.0),3);
    // showFrillEmmiter(20,XPos(-0.4),YPos(0.0),3);
    // showFrillEmmiter(20,XPos(0.4),YPos(0.0),3);

    starAnimation1();
    starAnimation2();
    starAnimation3();

    setTimeout(()=>{
        showCongratulations();
    },2000);

    if(bgSound.isPlaying)
        bgSound.stop(); 
}
function showFrillEmmiter(totalParticals,x,y,frillId)
{
    let emitter = game.add.emitter(x, y, 100); // Create emitter

    let frillPartical;
    
    switch(frillId)
    {
        case 1: frillPartical = 'frill1'; break;  // coin
        case 2: frillPartical = 'frill2'; break;  // long leaf
        case 3: frillPartical = 'frill3'; break;  // star
    }
    // Define the texture key for the particles
    emitter.makeParticles(frillPartical); // Load particle texture (as a key)

    // Customize particle properties
    emitter.setAlpha(1, 0, 2000); // Fade out particles over time
    emitter.setScale(0.5, 1, 0.5, 1, 2000); // Scale particles
    emitter.gravity = 0; // Optional: No gravity for the particles

    // Apply random colors to particles

    if(frillId == 2)
    {    
        emitter.forEach((particle) => {
                //particle.tint = Math.random() * 0xffffff; // Apply random tint to each particle
            if(Math.random() > 0.5)
                particle.tint = 0xff0000;
            // let r = Math.floor(200 + Math.random() * 55); // Red component (200–255)
            // let g = Math.floor(200 + Math.random() * 55); // Green component (200–255)
            // let b = Math.floor(200 + Math.random() * 55); // Blue component (200–255)
            // particle.tint = (r << 16) | (g << 8) | b; // Combine RGB into a single hex value
        });
    }
    if(frillId == 3)
    {    
        emitter.forEach((particle) => {
               particle.tint = Math.random() * 0xffffff; // Apply random tint to each particle
        });
    }
    // Start emitting particles
    emitter.start(true, 2000, null, totalParticals); // Emit 10 particles for 2 seconds
}
function placeSelectedCardInCenter(card,rewardId)
{
    sparkleSound.play();
    game.add.tween(card).to(
        { x: XPos(0.0), y: YPos(0.0) },
        500, // Duration (ms)
        Phaser.Easing.Quadratic.Out, // Easing type
        true // Auto start
    );
    game.add.tween(card.scale).to(
      { x: 2.0, y: 2.0},
      500,
      Phaser.Easing.Linear.None,
      true
    );

    setTimeout(()=>{
       
        if(rewardId <= 2) // 1/2 i.e. red/white
        {
            const i = rewardId-1;
            const targetX = XPos(-0.13+i*0.26);
            const targetY = YPos(0.90);
            if(rewardId == 1)
                card.loadTexture('red');
            else
                card.loadTexture('white');
            game.add.tween(card).to(
                { x: targetX, y: targetY },
                1500, // Duration (ms)
                Phaser.Easing.Quadratic.Out, // Easing type
                true // Auto start
            );
            game.add.tween(card.scale).to(
              { x: 0.35, y: 0.35},
              1500,
              Phaser.Easing.Linear.None,
              true
            );
            gameOver();
        }
        else if(rewardId == 3) // golden ...reward and mask
        {
            removeGoldenCard(card);
            launchScratchCard();
        }
        //if(rewardId == 1)
            
    },2000);

    setTimeout(()=>{
        if(rewardId >= 4) // 4 5 6 20/50/100 points
        {
            game.add.tween(card).to(
                { alpha: 0},
                1500,
                Phaser.Easing.Linear.None,
                true
            )
            gameOver();
        }
    },6000);
    
    /*if(rewardId < 3) // 1 || 2
    {
        resetGame(7000);
    }
    if(rewardId == 3)
    {    
        resetGame(25000);
    }
    else
    {
        resetGame(12000);
    }*/    
}
function resetGame(delay)
{
    setTimeout(()=>{

        location.reload();
        // game.state.start('AssetLoader');
    },delay);
}
function removeGoldenCard(card)
{
    game.add.tween(card).to(
        { alpha: 0 },
        1500, // Duration (ms)
        Phaser.Easing.Quadratic.Out, // Easing type
        true // Auto start
    );
    game.add.tween(card.scale).to(
      { x: 0.25, y: 0.25},
      1500,
      Phaser.Easing.Linear.None,
      true
    );
}
let totalArea = 0; // To calculate the total scratched area
let scratchThreshold = 0.3; // 80% of the card needs to be scratched
let imgScratchCover;
function launchScratchCard()
{
    // Add the reward layer (bottom layer)
    let reward = game.add.sprite(game.world.centerX, game.world.centerY, 'reward');
    reward.anchor.set(0.5); // Center the reward
    reward.scale.setTo(0.25);

    // Add the cover layer (top layer)
    let imgScratchCover = game.add.sprite(game.world.centerX, game.world.centerY, 'dynamicImage');//'cover');
    imgScratchCover.anchor.set(0.5); // Center the cover
    imgScratchCover.scale.setTo(0.25);

    // imgScratchCover.anchor.set(0.5);
    // imgScratchCover.scale.setTo(0.25);

    let reward2 = game.add.sprite(game.world.centerX, game.world.centerY, 'reward2');
    reward2.anchor.set(0.5); // Center the reward
    reward2.alpha = 1;

    // Create a mask
    let mask = game.add.graphics(0, 0);

    // Apply the mask to the cover
    imgScratchCover.mask = mask;
    totalArea = imgScratchCover.width * imgScratchCover.height;

    //function resetScratch() 
    {
      // Clear the mask
      mask.clear();

      // Reset scratchedImage to the original state
      imgScratchCover.mask = null; // Remove the mask
      imgScratchCover.mask = mask; // Reapply the (cleared) mask
    }


    game.add.tween(reward.scale).to(
      { x: 1.75, y: 1.75},
      500,
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
        game.add.tween(reward.scale).to(
          { x: 1.5, y: 1.5},
          100,
          Phaser.Easing.Linear.None,
          true
        );
    });  
    
    game.add.tween(imgScratchCover.scale).to(
      { x: 1.75, y: 1.75},
      500,
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
        game.add.tween(imgScratchCover.scale).to(
          { x: 1.5, y: 1.5},
          100,
          Phaser.Easing.Linear.None,
          true
        ).onComplete.add(() => {
            // showFrillEmmiter(20,XPos(0.0),YPos(0.0),2);
            // showFrillEmmiter(20,XPos(-.2),YPos(0.2),2);
            // showFrillEmmiter(20,XPos(0.1),YPos(-0.3),2);

            lineAnimation(1,50,XPos(0.0),YPos(0.0));
            lineAnimation(1,50,XPos(-.2),YPos(0.2));
            lineAnimation(1,50,XPos(0.1),YPos(-0.3));
        });
    });


    game.add.tween(reward2.scale).to(
      { x: 1.75, y: 1.75},
      500,
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
        game.add.tween(reward2.scale).to(
          { x: 1.5, y: 1.5},
          100,
          Phaser.Easing.Linear.None,
          true
        );
    });

    // Enable input for scratching
    game.input.addMoveCallback((pointer, x, y) => {
        if (pointer.isDown && !isScratchComplete) {
            reward2.alpha = 0;
            // Draw a circle at the pointer's position to reveal the reward
            mask.beginFill(0xffffff); // Fill color for the mask
            mask.drawCircle(x, y, 90); // Adjust the circle's size for scratching effect
            mask.endFill();

            checkScratchCompletion(mask,imgScratchCover,reward);
        }
    });


}
let isScratchComplete = false;
let scratchedArea = 0;
let myCounter = 0;
function checkScratchCompletion(mask,cover,reward) {
  // Calculate the scratched area
  /*mask.graphicsData.forEach((shape) => {
    if (shape.shape.type === Phaser.Circle) {
      let radius = shape.shape.radius;
      scratchedArea += Math.PI * radius * radius; // Area of the circle
    }
    // Add other shape types if needed
  });*/

  scratchedArea += Math.PI * 3 * 3; // Area of the circle
  // Check if the scratched area exceeds the threshold
  if (scratchedArea / totalArea > scratchThreshold && (myCounter == 0)) 
  {
    myCounter = 1;
    lineAnimation(1,50,XPos(0.0),YPos(0.0));
    mask.inputEnabled = false;

    // showFrillEmmiter(2,XPos(0.0),YPos(0.0),2);
    // showFrillEmmiter(2,XPos(-.2),YPos(0.2),2);
    // showFrillEmmiter(2,XPos(0.1),YPos(-0.3),2);

    // lineAnimation(1,50,XPos(-.2),YPos(0.2));
    // lineAnimation(1,50,XPos(0.1),YPos(-0.3));

    setTimeout(()=>{
        mask.clear();
        // cover.mask = null; // Unmask the sprite // Remove the mask
        // cover.mask = mask;

        cover.mask = null; // Unmask the sprite // Remove the mask
        mask.destroy(); // Optional: Clean up the mask
        isScratchComplete = true;
        cover.anchor.set(0.5,0.0);
        game.add.tween(cover.scale).to(
          { x: 0.25, y: 0.25},
          2000,
          Phaser.Easing.Linear.None,
          true
        );
        
        game.add.tween(cover).to(
          { x: XPos(0.0), y: YPos(0.525)},
          2000,
          Phaser.Easing.Linear.None,
          true
        ).onComplete.addOnce(() => {
            setTimeout(()=>{
                showRewardTween(cover);
                gameOver();
            },2000);
        });
            
        game.add.tween(reward).to(
          { alpha: 0.0},
          500,
          Phaser.Easing.Linear.None,
          true
        );

    },2000);

  }
  //  game.time.events.add(5000, () => {
  //   reward.mask = null; // Unmask the sprite
  //   mask.inputEnabled = false;
  //   mask.destroy(); // Optional: Clean up the mask
  // });
  
}
function showRewardTween(cover)
{
    let swingAngle = 0;
    cover.angle = -swingAngle;
    let isCover1 = false;
    let duration = 2000;

    let yoyoTween = game.add.tween(cover.scale).to(
        { x: 0, y: 0.25},
        duration,
        Phaser.Easing.Quadratic.InOut, // Easing function
        true, // Auto start
        1000, // Delay
        -1, // Infinite loop (-1)
        true // Enable yoyo (back and forth movement)
    )

    // Track which image is currently applied
    // onRepeat     onLoop
    // yoyoTween.onRepeat.add(() => {
    //     isCover = !isCover; // Toggle the flag
    //     console.log(`isCover ${isCover}`);
    //     cover.loadTexture(isCover ? 'cover' : 'reward'); // Switch the texture
    // });

    game.time.events.loop(duration*2, () => {
        isCover1 = !isCover1;
        cover.loadTexture(isCover1 ? 'dynamicImage' : 'reward'); // cover
        
    });

    
    game.add.tween(cover).to(
        { angle: swingAngle},
        500,
        Phaser.Easing.Quadratic.InOut, // Easing function
        true, // Auto start
        10, // Delay
        -1, // Infinite loop (-1)
        true // Enable yoyo (back and forth movement)
    );
   /* game.add.tween(cover).to(
        { x: game.world.width - 100 }, // Move to the right edge
        2000, // Duration (2 seconds)
        Phaser.Easing.Quadratic.InOut, // Easing function
        true, // Auto start
        0, // Delay
        -1, // Infinite loop (-1)
        true // Enable yoyo (back and forth movement)
    );*/
}
function getNumber() {
  // Number to display
  let number = 789;
  
  // Convert the number to a string to iterate through its digits
  let numberStr = number.toString();

  // X-position for the first digit
  let startX = game.world.centerX - (numberStr.length * 25) / 2; // Adjust spacing

  // Loop through each digit
  for (let i = 0; i < numberStr.length; i++) {
    let digit = numberStr[i]; // Get the current digit as a string
    let xPos = startX + i * 50; // Calculate position for each digit
    let yPos = game.world.centerY;

    // Add the digit as a sprite
    let digitSprite = game.add.sprite(xPos, yPos, `digit${digit}`);
    digitSprite.anchor.set(0.5); // Center the anchor
  }
}
//*******************************************************

//**************************************************
let mileStoneCoinX=[];
let RsAmount = [];
let pointMileStone = [];
function pointBar(pointsGain)
{
    // denominationArray
    const barY = 0.600;
    // const mileStoneCoinX = [-0.45,0.3,0.76];
    let items = mileStoneCoinX.length;
    let RsWithSymbol = Array(items);
    // let RsAmount = 20;
    for(var i=0;i<RsWithSymbol.length;i++)
    {
        // // ₹ Rs symbol
        /*switch(i)
        {
            case 0: RsAmount = 10; break;
            case 1: RsAmount = 30; break;
            case 2: RsAmount = 100; break;
        }*/
        RsWithSymbol[i] = game.add.text(XPos(mileStoneCoinX[i]),YPos(barY+0.065), `₹${RsAmount[i]}`, style3);
        RsWithSymbol[i].anchor.set(0.5,0.5);
    }    
    const pointsBar = game.add.sprite(XPos(0.0), YPos(barY), 'pointsbar');
    pointsBar.anchor.set(0.5,0.5);
    //pointsBar.scale.setTo(1,1);

    /*let pointsGain = 0;
    switch(rewardId)
    {
        case 4: pointsGain = 2; break; // 2 points
        case 5: pointsGain = 5; break; // 5 points
        case 6: pointsGain = 10; break; // 10 points
        case 7: pointsGain = 20; break; // 20 points
        case 8: pointsGain = 40; break; // 40 points
    }*/
    if(pointsGain > 0)
        fillTheBar(pointsGain);

    if(oldPoints > 0)
        fillTheBar(oldPoints);


    // console.log(`in pointBar() oldPoints ${oldPoints}`);
    

    // let pointMileStone = 0;
    
    for(var i=0;i<RsWithSymbol.length;i++)    
    {
        const mileStoneCoin = game.add.sprite(XPos(mileStoneCoinX[i]), YPos(barY/*+0.005*/), 'mile-stone-coin');
        mileStoneCoin.anchor.set(0.5,0.5);
        mileStoneCoin.scale.setTo(0.55);

        const RsFont = game.add.text(XPos(0.0),YPos(0.0), `10`, style5);
        RsFont.anchor.set(0.5,0.5);
    
        /*switch(i)
        {
            case 0: pointMileStone = 20;  break;
            case 1: pointMileStone = 50;  break;
            case 2: pointMileStone = 100; break;
        }*/

        RsFont.x = XPos(mileStoneCoinX[i]);
        RsFont.y = YPos(barY-0.005);    
        RsFont.setText(`${pointMileStone[i]}`); 
    }    

    // newPointBar();
}

// create an image with text only "Choose Your Destiny" with glossy effect in transparent png format
function fillTheBar(rs)
{
    // console.log(`in fillTheBar() rs ${rs}`);
    
    const barY = 0.600;

    let scl = rs-pointsEarned;
    if(scl <= 0)
        scl = 1;

    let duration = 2000;
    if(rs > 50)
        duration = 5000;
    

    const fillBar0 = game.add.sprite(XPos(0.0), YPos(barY), 'fillbar0');
    fillBar0.anchor.set(0.5,0.5);
    // fillBar0.scale.setTo(0.65,1);

    const fillBar1 = game.add.sprite(XPos(-0.75), YPos(barY), 'fillbar1');
    fillBar1.anchor.set(0.0,0.5);
    fillBar1.scale.setTo(scl,1);
    fillBar1.alpha = 0;

    const fillBar2 = game.add.sprite(XPos(0.0), YPos(barY), 'fillbar0');
    fillBar2.anchor.set(0.5,0.5);
    // fillBar2.scale.setTo(0.65,1);

    // pointsEarned
    scl = scl+pointsEarned;
    if(scl >= 50)
        scl = scl+5;

    if(scl >=100)
        scl = 105;

    let fillBarTween;
    if(rs > 2)
    {    
        fillBar1.alpha = 1;
        fillBarTween = game.add.tween(fillBar1.scale).to(
            { x: scl}, 
            duration, // Duration
            Phaser.Easing.Linear.None,//Phaser.Easing.Exponential.In, //
            true
        );
    }

    if(rs >= 100)
    {    
        fillBarTween.onComplete.addOnce(() => {
            fillBar2.scale.x *= -1;
        });
    }    
    
}
function drawHUD()
{
    /*const coin = game.add.sprite(XPos(0.8), YPos(0.85), 'coin');
    coin.anchor.set(0.5);
    coin.scale.setTo(0.75);*/
    // for(var i=0;i<2;i++)
    {
        const pointsBG = game.add.sprite(XPos(-0.65), YPos(0.9), 'pointsbg');
        pointsBG.anchor.set(0.5,0.5);
        pointsBG.scale.setTo(0.95);

        const cashBackBG = game.add.sprite(XPos(0.65), YPos(0.9), 'cashbackbg');
        cashBackBG.anchor.set(0.5,0.5);
        cashBackBG.scale.setTo(0.95);
    }
    /*console.log(`${gameTexts}`);
    totalPointsFont = game.add.text(XPos(-0.65),YPos(0.925), `${gameTexts.totalPointsText}`, style1);
    totalPointsFont.anchor.set(0.5,0.5);*/

    /*oldPoints = Math.floor(localStorage.getItem('oldPoints1'));

    if(oldPoints == null || oldPoints==undefined)
        oldPoints = 0;*/
    // localStorage.setItem('oldPoints100',oldPoints);

    // console.log(`in drawHUD() oldPoints ${oldPoints}`);
    // totalPointsAmount = oldPoints;
    // totalPointsAmountFont = game.add.text(XPos(-0.65),YPos(0.875), ""+totalPointsAmount, style2);
    // totalPointsAmountFont.anchor.set(0.5,0.5);

    /*totalCashBackFont = game.add.text(XPos(0.65),YPos(0.925), `${gameTexts.totalCashBackText}`, style1);
    totalCashBackFont.anchor.set(0.5,0.5);*/

    // totalCashbackAmount = oldCashBack;
    // totalCashbackAmountFont = game.add.text(XPos(0.65),YPos(0.875), ""+totalCashbackAmount, style3);
    // totalCashbackAmountFont.anchor.set(0.5,0.5);


    for(var i=0;i<2;i++)
    {
        const redAndWhitePlaceholder = game.add.sprite(XPos(-0.13+i*0.26), YPos(0.90), 'redandwhiteplaceholder');
        redAndWhitePlaceholder.anchor.set(0.5,0.5);
        redAndWhitePlaceholder.scale.setTo(placeHolderScale);
    }    
}

function coinShower()
{
  // Add the emitter
  let coinEmitter = game.add.emitter(game.world.centerX, -50, 50); // At the top of the screen

  // Load coin texture
  coinEmitter.makeParticles('coin'); // Replace 'coin' with your coin texture key
  // Configure emitter properties
  coinEmitter.width = game.world.width; // Spread coins across the screen width
  coinEmitter.gravity = 100; // Add gravity to make coins fall
  coinEmitter.setYSpeed(10, 30);//(100, 300); // Random vertical speed for falling coins
  coinEmitter.setXSpeed(-50, 50); // Slight horizontal drift for randomness
  coinEmitter.setScale(0.15, 0.5, 0.15, 0.5); // Random scaling for coin sizes
  coinEmitter.setRotation(0, 360); // Random rotation for coins

  // Start emitting coins
  coinEmitter.start(false, 5000, 100); // Continuous emission: lifetime=2000ms, frequency=100ms
}

function flipCard(card, newTextureKey) {
  // Step 1: Animate scale.x to 0 (shrink horizontally with slight scale.y adjustment for tilt)
  let shrinkTween = game.add.tween(card.scale).to(
    { x: 0, y: 0.9 }, // Shrink horizontally, slight vertical compression
    300,
    Phaser.Easing.Linear.None,
    true
  );

  // Step 2: At the midpoint, change the texture
  shrinkTween.onComplete.addOnce(() => {
    card.loadTexture(newTextureKey); // Swap to the new texture

    // Step 3: Animate scale.x back to 1 (expand horizontally with reverse tilt)
    game.add.tween(card.scale).to(
      { x: 1, y: 1 }, // Reset both scale.x and scale.y
      300,
      Phaser.Easing.Linear.None,
      true
    );
  });
}


/***********************************************************/
function createCoins() {
  // Add the target (destination point for coins)
  let target = game.add.sprite(100, 100, 'logo');
  target.anchor.set(0.5);
  target.alpha = 0.0;
  // Create a group for the coins
  let coinGroup = game.add.group();

  // Generate coins at random positions
  for (let i = 0; i < 10; i++) {
    let startX = game.rnd.integerInRange(500, game.width);
    let startY = game.rnd.integerInRange(500, game.height);
    let coin = coinGroup.create(startX, startY, 'coin');
    coin.anchor.set(0.5);

    // Create a curvy path for each coin
    let controlPoint1X = 500;//(startX + target.x) / 2 + game.rnd.integerInRange(-100, 100); // Random control point
    let controlPoint1Y = 500;//(startY + target.y) / 2 + game.rnd.integerInRange(-100, 100);

    let controlPoint2X = 50;//(startX + target.x) / 2 + game.rnd.integerInRange(250, 300); // Random control point
    let controlPoint2Y = 50;//(startY + target.y) / 2 + game.rnd.integerInRange(50, 100);


    let path = [
      { x: startX, y: startY },
      { x: controlPoint1X, y: controlPoint1Y },
      { x: controlPoint2X, y: controlPoint2Y },
      { x: target.x, y: target.y },
    ];

    // Trigger the curvy movement
    animateCoin(coin, path);
  }
}

function animateCoin(coin, path) {
  let tween = game.add.tween(coin).to(
    { x: path.map(p => p.x), y: path.map(p => p.y) }, // Use x and y arrays for curvy motion
    1000, // Duration
    Phaser.Easing.Quadratic.InOut, // Smooth movement
    true // Start immediately
  );

  tween.interpolation(Phaser.Math.bezierInterpolation); // Use bezier interpolation for the curve

  // Add a scale tween for shrinking effect
  let scaleTween = game.add.tween(coin.scale).to(
    { x: 0, y: 0 },
    1000,
    Phaser.Easing.Linear.None,
    true
  );

  // Destroy the coin once it reaches the target
  tween.onComplete.add(() => {
    coin.destroy();
  });
}

function showCongratulations()
{
    // isShowCongrats = true;
    if(isShowCongrats)
    {        
        /*game.add.tween(imgCongrats.scale).to(
           { x: 1, y: 1}, // Use x and y arrays for curvy motion
            1000, // Duration
            Phaser.Easing.Quadratic.InOut, // Smooth movement
            true, // Start immediately
        ).onComplete.add(()=>{
            const messageFont = game.add.text(XPos(0.0),YPos(-0.1), `${messageText}`, style6);
            messageFont.anchor.set(0.5,0.5);
        });*/
        imgCongrats.visible = true;
    }    
    else
    {
        imgPopupForPoints.visible = true;
    }   
    lineAnimation(1,50,XPos(-0.1),YPos(0.1));
    setTimeout(()=>{
        lineAnimation(1,50,XPos(0.1),YPos(-0.1));
    },500);    

    imgBtnClose.visible = true; 
    console.log(`${messageText}`);
    // messageText = 'You have won a bike, enjoy the ride!'
    howToPlayFont = game.add.text(XPos(0.0),YPos(0.0), `${messageText}`, style6);
    howToPlayFont.anchor.set(0.5,0.5);

    if(myCloseTimer != null)
    {
        setTimeout(()=>{
            closePopup();  
        },myCloseTimer);
    }
}

function closePopup()
{
    imgBtnClose.scale.setTo(0.75);
    imgBtnClose.destroy();
    imgPopup.destroy();
    howToPlayFont.destroy();
    imgPopupForPoints.destroy();
    imgCongrats.destroy();
    sendGameEvent("closePopup");
    console.log(`closing after : ${myCloseTimer}`);
}
/***********************************************************/

/*````````````````*/
function flipLike8(){

    let card = game.add.sprite(game.world.centerX, game.world.centerY+200, 'won-white');
  card.anchor.set(0.5); // Center the card for smooth scaling
  card.inputEnabled = true; // Enable input for interaction

  // Add a click listener to flip the card
  card.events.onInputDown.add(() => {
    flipCard8(card);
  });

   
}

function flipCard8(card) {
  // Step 1: Shrink horizontally to 0 width
    let expandTween;
    let shrinkTween;
  shrinkTween = game.add.tween(card.scale).to(
    { x:0, y: 0 }, // Shrink to 0 width
    2000, // Duration in ms
    Phaser.Easing.Linear.None, // Easing type
    true // Start immediately
  );
  // game.add.tween(card).to({ angle: 90 }, 2000, Phaser.Easing.Linear.None, true);


  // Step 2: Swap the texture when the card is fully "hidden"
  shrinkTween.onComplete.add(() => {
    card.loadTexture('won-red'); // Change texture to the reward

    // Step 3: Expand horizontally back to full width
    expandTween = game.add.tween(card.scale).to(
      { x:1, y: 1 }, // Expand back to original width
      2000,
      Phaser.Easing.Quadratic.InOut,//Phaser.Easing.Bounce.Out,//Phaser.Easing.Linear.None,
      true
    );
    // game.add.tween(card).to({ angle: 180 }, 2000, Phaser.Easing.Linear.None, true);

  });

    // shrinkTween.to({ angle: 90 }, 300, Phaser.Easing.Linear.None, true);
    // expandTween.to({ angle: 180 }, 300, Phaser.Easing.Linear.None, true);
}
/*````````````````*/
/*
game.camera.shake(0.02, 500); // Shake the screen


let emitter = game.add.emitter(XPos(0.0), YPos(0.0), 100); // Create emitter
emitter.makeParticles('btn_down'); // Load particle texture
emitter.start(true, 2000, null, 10); // Emit 10 particles for 2 seconds


*/

/* game.add.tween(imgCardBack[0]).to(
      { angle: 180 },
      600,
      Phaser.Easing.Linear.None,
      true
    );*/

   /* game.add.tween(imgCardBack[0].scale).to(
      { x: 0 },
      300,
      Phaser.Easing.Linear.None,
      true
    ).onComplete.add(() => {
      imgCardBack[0].loadTexture('card-front'); // Change to card's back
      game.add.tween(imgCardBack[0].scale).to({ x: 1 }, 300, Phaser.Easing.Linear.None, true);
    });*/