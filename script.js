
let blackjackGame = {
    "you": {'div': "#yourBox", "scoreSpan": "#yourResult", "score": 0},
    "dealer": {'div': "#dealerBox", "scoreSpan": "#dealerResult", "score": 0},
    "card": {0: {"source" : "images/2.png", "score": 2}, 1:{"source": "images/3.png", "score": 3}, 2: {"source": "images/4.png", "score": 4},
    3: {"source": "images/5.png", "score":5}, 4: {"source": "images/6.png", "score": 6}, 5: {"source": "images/7.png", "score": 7}, 
    6: {"source": "images/8.png", "score": 8}, 7: {"source": "images/9.png", "score": 9},
    8: {"source": "images/10.png", "score": 10}, 9: {"source": "images/A.png", "score": [1, 11]}, 10: {"source": "images/jack.png", "score": 10},
    11: {"source": "images/king.png", "score": 10}, 12:{"source": "images/Q.png", "score": 10}},
    "wins": 0,
    "losses": 0,
    "draws": 0,

}

let randomNum = 0;
let randomSource = "";
let randomScore = "";
let countYou = 0;
let countDealer = 0;
let yourTurnDone = false;
let dealerTurnDone = false;
let isStand = false;
let messege, messegeColor;

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const CARD = blackjackGame["card"];


const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const lostSound = new Audio('sounds/aww.mp3');

$(document).ready(function(){
    $("button#blackjackHitButton").bind('click', function(){
        if (YOU['score'] < 21 && dealerTurnDone === false && yourTurnDone === false){
            selectRandomCard(YOU);
            showCard(YOU);
            yourTurnDone = true;
        }
    });

    $("button#blackjackDealButton").bind('click', function(){
        
        blackjackDeal();

    });

    $("button#blackjackStandButton").bind('click', function(){
        if (yourTurnDone === true && isStand === false) {    
            isStand = true;
            dealerTurn();
            
        }
        
 
    });
});

async function dealerTurn() {
    while (yourTurnDone === true && dealerTurnDone === false) {
        dealerLogic();
        await sleep(1000)
    }
}

function showCard (activePlayer) {    
    let cardImage = document.createElement('img');
    cardImage.src = randomSource;
        
    if (activePlayer === YOU) {
        countYou ++
        if (countYou === 1 || countYou === 5) {
            $(cardImage).addClass("image-class-normal");
        }else{
            $(cardImage).addClass("image-class");
        }
    }
    if (activePlayer === DEALER) {
        countDealer ++;
        if (countDealer === 1 || countDealer === 5) {
            $(cardImage).addClass("image-class-normal");
        }else{
            $(cardImage).addClass("image-class");
        }
    }   

    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();

    updateScore(activePlayer);
    displayScore(activePlayer);
}

function removeCard (activePlayer) {
    let yourImages = document.querySelector(activePlayer['div']).querySelectorAll('img');
    
    for (i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();
    }

    countYou = 0;
    countDealer = 0;

}


function selectRandomCard (activePlayer) {
    randomNum = Math.ceil(Math.random() * 12);
    randomSource = CARD[randomNum]["source"];
    if (randomNum === 9){
        if ( (21 - activePlayer['score']) >= 11) {
            randomScore = CARD[randomNum]["score"][1];    
        }else {
            randomScore = CARD[randomNum]["score"][0];
        }
    }else{    
        randomScore = CARD[randomNum]["score"];
    }
}

function updateScore(activePlayer) {
    activePlayer["score"] += randomScore;
}


function displayScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';

    }else{
        document.querySelector(activePlayer['scoreSpan']).style.color = '#ffffff';
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score']
    }
}



function resetScore(){
    YOU['score'] = 0;
    DEALER['score'] = 0;
}


function computeWinner () {
    let winner;
    if (YOU['score'] <= 21) {
        
        if ((YOU['score'] > DEALER['score']) || (DEALER['score'] > 21)) {
            winner = YOU;
            blackjackGame["wins"] ++;
        }else if (YOU['score'] < DEALER['score']) {
            winner = DEALER;
            blackjackGame["losses"] ++;
        }else if (YOU['score'] === DEALER['score']) {
            blackjackGame["draws"] ++;
        }
    }else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        winner = DEALER;
        blackjackGame["losses"] ++;
    }else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame["draws"] ++;
    }
    return winner; 
}



function showResult (winner) {
    if (winner === YOU) {
        document.querySelector("#wins").textContent = blackjackGame['wins'];
        messegeColor = "green";
        messege = "You Win!";
        winSound.play();
    }else if (winner === DEALER) {
        document.querySelector("#losses").textContent = blackjackGame['losses'];
        messegeColor = "red";
        messege = "You Lost!";
        lostSound.play();
    }else {
        document.querySelector("#draw").textContent = blackjackGame['draws'];
        messege = "you drew!";
        messegeColor = "black";

    }
    document.querySelector("#result").textContent = messege;
    document.querySelector("#result").style.color = messegeColor;
}

function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function dealerLogic () {
    if (DEALER['score'] <= 16) {
        selectRandomCard(DEALER);
        showCard(DEALER);
    }else {
        showResult(computeWinner());
        dealerTurnDone = true;
    } 
    
}

function blackjackDeal() {
    if (yourTurnDone === true && dealerTurnDone === true) {
        resetScore();
        removeCard(YOU);
        removeCard(DEALER);
        displayScore(YOU);
        displayScore(DEALER);
        yourTurnDone = false;
        dealerTurnDone = false;
        isStand = false;
        document.querySelector("#result").textContent = "Let's Play";
        document.querySelector("#result").style.color = "black";
    }
}