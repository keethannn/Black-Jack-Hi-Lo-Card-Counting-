var runningCount = 0;
var dealerSum = 0;
var yourSum = 0;
var yourSum2 = 0;
var dealerAceCount = 0;
var yourAceCount = 0;
var yourAceCount2 = 0;
var firstCard = "";
var lastCard = "";
var splitFirstCard = "";
var splitLastCard = "";
var dealerUpcard;
var hidden;
var deck;
var canSplit = true;

//prepares shuffled deck and starts game
window.onload = function()
{
    buildDeck();
    shuffleDeck();
    startGame();
}

//creates 8 decks
function buildDeck() 
{
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
    let suits = ["D", "C", "H", "S"]

    deck = [];

    for (let num = 0; num < 8; num++)
    {
        for (let i = 0; i < values.length; i++)
        {
            for (let j = 0; j < suits.length; j++)
            {
                deck.push(values[i] + "-" + suits[j]);
            }
        }
    }
}

// shuffles deck
function shuffleDeck()
{
    for (let i = 0; i < deck.length; i++)
    {
        let j = Math.floor(Math.random() * deck.length); // finds random number between 1 and deck length to switch
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() // creates layout for when game starts
{
    dealerSum = 0;
    yourSum = 0;
    yourSum2 = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    yourAceCount2 = 0;
    canSplit = true;

    let dealerCards = document.getElementById("dealer-cards");
    let yourCards = document.getElementById("your-cards");
    let yourCards2 = document.getElementById("your-cards2");

    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";
    document.getElementById("results").innerText = "";
    document.getElementById("results").style.display = "none";
    document.getElementById("results1").innerText = "";
    document.getElementById("results2").style.display = "none";
    document.getElementById("results2").innerText = "";
    document.getElementById("gameover").style.display = "block";
    document.getElementById("nextround").style.display = "none";
    document.getElementById("hand2").style.display = "none";
    document.getElementById("hit1").style.display = "none";
    document.getElementById("stand1").style.display = "none";
    document.getElementById("split").style.display = "inline";
    document.getElementById("hand1").style.float = "none";
    document.getElementById("hand1").style.width = "100%";
    document.getElementById("hand1").style.height = "auto";
    document.getElementById("your-cards").style.height = "auto";
    document.getElementById("your-cards2").style.height = "auto";
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("hint").style.display = "inline";


    while (dealerCards.hasChildNodes()) 
    {
        dealerCards.removeChild(dealerCards.firstChild);
    }

    while (yourCards.hasChildNodes()) 
    {
        yourCards.removeChild(yourCards.firstChild);
    }

    while (yourCards2.hasChildNodes()) 
    {
        yourCards2.removeChild(yourCards2.firstChild);
    }

    document.getElementById("hint").removeEventListener('click', basicStrategy1);
    document.getElementById("hint").removeEventListener('click', basicStrategy2);

    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.src = "./cards/BACK.png";
    hiddenCardImg.id = "hidden";
    document.getElementById("dealer-cards").append(hiddenCardImg);
    
    //drawing cards for dealer
    
    hidden = drawCard();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    let dealerCardImg = document.createElement("img");
    let dealerCard = drawCard();
    dealerCardImg.src = "./cards/" + dealerCard + ".png";
    dealerSum += getValue(dealerCard); 
    dealerAceCount += checkAce(dealerCard);
    dealerUpcard = dealerCard;
    runningCountValue(dealerCard);
    document.getElementById("dealer-cards").append(dealerCardImg);
    
    //drawing cards for player
    
    for (let i = 0; i < 2; i++)
    {   
        let yourCardImg = document.createElement("img");
        let yourCard = drawCard();
        yourCardImg.src = "./cards/" + yourCard + ".png";
        yourSum += getValue(yourCard); 
        yourAceCount += checkAce(yourCard);
        runningCountValue(yourCard);
        document.getElementById("your-cards").append(yourCardImg);
        if (i == 0)
        {
            firstCard = yourCard;
        }
        if (i == 1)
        {
            lastCard = yourCard;
        }
    }

    reduceAce(0);
    reduceAce(1);
    
    // dealer automatically draws if you start with blackjack

    if (yourSum == 21)
    {
        dealerDraw();
        if (dealerSum == 21)
        {
            showResults("You both have BlackJack. Tie!")
        }
        else
        {
            showResults("BlackJack. You Win!");
        }
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
    document.getElementById("split").addEventListener("click", split)
    document.getElementById("hint").addEventListener("click", basicStrategy)
}

function hit()
{
    let cardImg = document.createElement("img");
    let card = drawCard();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card); 
    yourAceCount += checkAce(card);
    runningCountValue(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("split").style.display = "none";
    reduceAce(1);
    document.getElementById("hint-text").style.display = "none";
    
    // automatically lose if you bust
    if (yourSum > 21)
    {
        showResults("You Lose!");
    }

    // check if dealer has blackjack if you get blackjack
    else if (yourSum == 21)
    {
        dealerDraw();

        if (dealerSum == 21)
        { 
            showResults("You both have BlackJack. Tie!");
        }
        else
        {
            showResults("BlackJack. You Win!");
        }
    }
}

function stand()
{
    document.getElementById("hint-text").style.display = "none";
    reduceAce(1);

    // let dealer draw if you decid to stand
    
    dealerDraw();
    
    let message = "";

    // you win if dealer busts
    if (dealerSum > 21)
    {
        message = "You Win!";
    }
    else if (dealerSum == yourSum)
    {
        message = "It's a Tie!";
    }
    // you lose if you have lower amount than dealer
    else if (dealerSum > yourSum)
    {
        message = "You Lose!";
    }
    // you win if you have more than dealer
    else if (dealerSum < yourSum)
    {
        message = "You Win!";
    }
    
    showResults(message);
}

function split()
{
    // changing layout for two hands instead of one when splitting
    document.getElementById("hand1").style.display = "block";
    document.getElementById("hand2").style.display = "block";  
    document.getElementById("hand1").style.float = "left";
    document.getElementById("hand1").style.width = "50%";
    document.getElementById("hand2").style.float = "right";
    document.getElementById("hand2").style.width = "50%";
    document.getElementById("hand1").style.height = "315.66px";
    document.getElementById("hand2").style.height = "315.66px";

    document.getElementById("gameover").style.display = "none";
    document.getElementById("hit1").style.display = "inline";
    document.getElementById("stand1").style.display = "inline";
    document.getElementById("hit1").style.visibility = "visible";
    document.getElementById("stand1").style.visibility = "visible";
    document.getElementById("hit2").style.visibility = "hidden";
    document.getElementById("stand2").style.visibility = "hidden";
    document.getElementById("your-cards").style.height = "200px";
    document.getElementById("your-cards2").style.height = "200px";
    canSplit = false;
    document.getElementById("hint-text").style.display = "none";

    
    let yourCards = document.getElementById("your-cards");
    document.getElementById("your-cards2").append(yourCards.lastChild);
    
    // in the condition that you have two aces and you split them, they both become 11 again
    if (yourSum == 12 && yourAceCount == 1)
    {
        yourSum = 11;
        yourAceCount = 1;
        yourSum2 = 11;
        yourAceCount2 = 1;
    }
    else
    {
        yourSum -= getValue(lastCard); 
        yourAceCount -= checkAce(lastCard);
        yourSum2 += getValue(lastCard); 
        yourAceCount2+= checkAce(lastCard);
    }

    let yourCardImg = document.createElement("img");
    let yourCard = drawCard();
    yourCardImg.src = "./cards/" + yourCard + ".png";
    yourSum += getValue(yourCard); 
    yourAceCount += checkAce(yourCard);
    runningCountValue(yourCard);
    document.getElementById("your-cards").append(yourCardImg);
    yourCardImg = document.createElement("img");
    yourCard = drawCard();
    yourCardImg.src = "./cards/" + yourCard + ".png";
    yourSum2 += getValue(yourCard); 
    yourAceCount2 += checkAce(yourCard);
    runningCountValue(yourCard);
    document.getElementById("your-cards2").append(yourCardImg);
    document.getElementById("hint").removeEventListener('click', basicStrategy);
    document.getElementById("hint").addEventListener("click", basicStrategy1);

    reduceAce(1);
    reduceAce(2);

    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("your-sum2").innerText = yourSum2;

    // if your first hand gets blackjack, then move over to the second turn for your other hand
    if (yourSum == 21)
    {
        showResults1("Black Jack!");
        stand1();
    }
    
    // if second hand is blackjack, then immediately show second hand as blackjack
    if (yourSum2 == 21)
    {
        document.getElementById("results2").innerText = "Black Jack!";
        document.getElementById("results2").style.display = "block";
    }

    document.getElementById("hit1").addEventListener("click", hit1);
    document.getElementById("stand1").addEventListener("click", stand1);
    document.getElementById("hit2").addEventListener("click", hit2);
    document.getElementById("stand2").addEventListener("click", stand2);
}

// function to hit for first hand

function hit1()
{
    let cardImg = document.createElement("img");
    let card = drawCard();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card); 
    yourAceCount += checkAce(card);
    runningCountValue(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("hint-text").style.display = "none";
    reduceAce(1);
    
    if (yourSum > 21)
    {
        showResults1("You Lose!");
        stand1();
    }
    if (yourSum == 21)
    {
        showResults1("Black Jack. You Win!");
        stand1();
    }
}

// function to stand for second hand

function stand1()
{
    document.getElementById("hit1").style.display = "none";
    document.getElementById("stand1").style.display = "none";

    document.getElementById("hit2").style.display = "inline";
    document.getElementById("stand2").style.display = "inline";
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("hint").removeEventListener('click', basicStrategy1);
    document.getElementById("hint").addEventListener("click", basicStrategy2);
    

    if (yourSum2 == 21)
    {
        dealerDraw();

        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        runningCountValue(hidden);
        document.getElementById("your-sum").innerText = yourSum;
        if (yourSum == dealerSum && dealerSum <= 21)
        {   
            document.getElementById("results1").innerText = "It's a Tie!";
        }
        else if (yourSum > dealerSum && yourSum < 21)
        {
            document.getElementById("results1").innerText = "You Win!";
        }
        else if (yourSum < dealerSum && dealerSum <= 21)
        {
            document.getElementById("results1").innerText = "You Lose!";
        }
        document.getElementById("hit1").style.display = "none";
        document.getElementById("stand1").style.display = "none";
        document.getElementById("hit2").style.display = "none";
        document.getElementById("stand2").style.display = "none";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum2").innerText = yourSum2;
        document.getElementById("nextround").style.display = "block";
        document.getElementById("nextroundbutton").addEventListener("click", startGame);
        document.getElementById("hint-text").style.display = "none";
        document.getElementById("hint").style.display = "none";
    }
    else
    {
        document.getElementById("hit2").style.visibility = "visible";
        document.getElementById("stand2").style.visibility = "visible";
    }
}

// function to hit for second hand

function hit2()
{
    let cardImg = document.createElement("img");
    let card = drawCard();
    cardImg.src = "./cards/" + card + ".png";
    yourSum2 += getValue(card); 
    yourAceCount2 += checkAce(card);
    runningCountValue(card);
    document.getElementById("your-cards2").append(cardImg);
    reduceAce(2);
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("your-sum2").innerText = yourSum2;
    
    if (yourSum2 > 21)
    {
        if (yourSum <= 21)
        {
            dealerDraw();

            if (dealerSum > 21 && yourSum < 21)
            {
                document.getElementById("results1").innerText = "You Win!";
            }
            else if (yourSum == dealerSum && yourSum <= 21)
            {   
                document.getElementById("results1").innerText = "It's a Tie!";
            }
            else if (yourSum > dealerSum && yourSum < 21)
            {
                document.getElementById("results1").innerText = "You Win!";
            }
            else if (yourSum < dealerSum && dealerSum <= 21)
            {
                document.getElementById("results1").innerText = "You Lose!";
            }
        }
        
        document.getElementById("hidden").src = "./cards/" + hidden + ".png";
        document.getElementById("your-sum").innerText = yourSum;
        document.getElementById("results1").style.display = "block";
        document.getElementById("results2").style.display = "block";
        document.getElementById("results2").innerText = "You Lose!";
        document.getElementById("hit1").style.display = "none";
        document.getElementById("stand1").style.display = "none";
        document.getElementById("hit2").style.display = "none";
        document.getElementById("stand2").style.display = "none";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("your-sum2").innerText = yourSum2;
        document.getElementById("nextround").style.display = "block";
        document.getElementById("nextroundbutton").addEventListener("click", startGame);
        document.getElementById("hint-text").style.display = "none";
        document.getElementById("hint").style.display = "none";
    }
    else if (yourSum2 == 21)
    {
        dealerDraw();
        if (dealerSum == 21)
        { 
            showResults2("You both have BlackJack. Tie!");
        }
        else
        {
            showResults2("BlackJack. You Win!");
        }

        if ( dealerSum > 21 && yourSum < 21)
        {
            document.getElementById("results1").innerText = "You Win!";
        }
        else if (yourSum == dealerSum && yourSum <= 21)
        {   
            document.getElementById("results1").innerText = "It's a Tie!";
        }
        else if (yourSum > dealerSum && yourSum < 21)
        {
            document.getElementById("results1").innerText = "You Win!";
        }
        else if (yourSum < dealerSum && dealerSum <= 21)
        {
            document.getElementById("results1").innerText = "You Lose!";
        }
    }
}

// function to stand on second hand

function stand2()
{
    reduceAce(2);

    document.getElementById("hit2").style.display = "none";
    document.getElementById("stand2").style.display = "none";
    document.getElementById("hint-text").style.display = "none";
    
    dealerDraw();

    if (dealerSum > 21)
    {
        if (yourSum < 21)
        {
            showResults1("You Win!");
        }
        if (yourSum2 < 21)
        {
            showResults2("You Win!");
        }
    }

    
    else
    {
        if (dealerSum == yourSum && yourSum <= 21)
        {
            showResults1("It's a Tie!");
        }
        else if (dealerSum > yourSum && dealerSum <= 21)
        {
            showResults1("You Lose!");
        }
        else if (dealerSum < yourSum && yourSum <= 21)
        {
            showResults1("You Win!");
        }
    
        if (dealerSum == yourSum2 && yourSum2 <= 21)
        {
            showResults2("It's a Tie!");
        }
        else if (dealerSum > yourSum2 && dealerSum <= 21)
        {
            showResults2("You Lose!");
        }
        else if (dealerSum < yourSum2 && yourSum2 <= 21)
        {
            showResults2("You Win!");
        }
    }
}

// if hand has an ace and is over 21, drop the ace from 11 to 1
function reduceAce(player) 
{
    if (player == 0)
    {
        while (dealerSum > 21 && dealerAceCount > 0) 
        {
            dealerSum -= 10;
            dealerAceCount -= 1;
        }
    }
    
    else if (player == 1)
    {
        while (yourSum > 21 && yourAceCount > 0) 
        {
            yourSum -= 10;
            yourAceCount -= 1;
        }
        document.getElementById("your-sum").innerText = yourSum;
    }

    else if (player == 2)
    {
        while (yourSum2 > 21 && yourAceCount2 > 0) 
        {
            yourSum2 -= 10;
            yourAceCount2 -= 1;
        }
    }
}

// function to get value of card from its name
function getValue(card)
{
    let value = (card.split("-"))[0];

    if (isNaN(value))
    {
        if (value == "A")
        {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card)
{
    if (card[0] == "A")
    {
        return 1;
    }
    return 0;
}

// UI display at the end of the round so that user can move on to the next one
function showResults(message)
{
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    runningCountValue(hidden);
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("nextround").style.display = "block";
    document.getElementById("results").style.display = "block";
    document.getElementById("results").innerText = message;
    document.getElementById("gameover").style.display = "none";
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("hint").style.display = "none";
    document.getElementById("nextroundbutton").addEventListener("click", startGame);
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("hint").style.display = "none";
}

// show results of left hand
function showResults1(message)
{
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results1").innerText = message;
    document.getElementById("results1").style.display = "block";
}

// show results of right hand
function showResults2(message)
{
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    runningCountValue(hidden);
    document.getElementById("hit1").style.display = "none";
    document.getElementById("stand1").style.display = "none";
    document.getElementById("hit2").style.display = "none";
    document.getElementById("stand2").style.display = "none";
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum2").innerText = yourSum2;
    document.getElementById("nextround").style.display = "block";
    document.getElementById("results2").innerText = message;
    document.getElementById("results2").style.display = "block";
    document.getElementById("nextroundbutton").addEventListener("click", startGame);
    document.getElementById("hint-text").style.display = "none";
    document.getElementById("hint").style.display = "none";
}

// called whenever user is done or got blackjack, and need to compare with dealer's cards
function dealerDraw()
{
    reduceAce(0);
    while (dealerSum < 17)
    {
        let cardImg = document.createElement("img");
        let card = drawCard();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card); 
        dealerAceCount += checkAce(card);
        runningCountValue(card);
        document.getElementById("dealer-cards").append(cardImg);
        reduceAce(0);
    }
    reduceAce(0);
    document.getElementById("hint-text").style.display = "block";
}

// keep track of running count for card counters
function runningCountValue(card)
{
    let value = (card.split("-"))[0];
    if (isNaN(value) || parseInt(value) == 10)
    {
        runningCount -= 1;
        document.getElementById("running-count").innerText = runningCount;
    }
    else if (value < 7)
    {
        runningCount += 1;
        document.getElementById("running-count").innerText = runningCount;
    }
}

function basicStrategy()
{
    // strategies are graphs representing different pairs of cards, x-axis 
    // represents value of first card and y-axis represents value of second cards
    // this information is then passed onto the interactive hint button
    
    // hard is for when you have no ace
    hardStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]
    
    // soft is for when you have no ace
    softStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [0,0,0,0,0,0,0,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]
    
    // for when your cards are equal
    splitStrategy = [[1,1,2,2,2,2,1,1,1,1],
                     [1,1,2,2,2,2,1,1,1,1],
                     [1,1,1,1,1,1,1,1,1,1],
                     [1,1,1,1,1,1,1,1,1,1],
                     [1,2,2,2,2,1,1,1,1,1],
                     [2,2,2,2,2,2,1,1,1,1],
                     [2,2,2,2,2,2,2,2,2,2],
                     [2,2,2,2,2,0,2,2,0,0],
                     [0,0,0,0,0,0,0,0,0,0],
                     [2,2,2,2,2,2,2,2,2,2]]


    let soft = false;
    let pair = false;
    let arrayValue;
    moveHint = "";
    
    soft = yourAceCount > 0;
    pair = getValue(firstCard) == getValue(lastCard);

    if (pair)
    {
        moveHint = splitStrategy[getValue(firstCard) - 2][getValue(dealerUpcard) - 2];
    }
    else if (soft)
    {
        if (yourSum >= 19)
        {
            arrayValue = 6;
        }
        else
        {
            arrayValue = yourSum - 13;
        }

        moveHint = softStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }
    else
    {
        if (yourSum >= 4 && yourSum <= 8)
        {
            arrayValue = 0;
        }
        else if (yourSum >= 17)
        {
            arrayValue = 9;
        }
        else
        {
            arrayValue = yourSum - 8;
        }

        moveHint = hardStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }

    if (moveHint == 0)
    {
        document.getElementById("move-hint").innerText = "Stand";
    }
    else if (moveHint == 1)
    {
        document.getElementById("move-hint").innerText = "Hit";
    }
    else if (moveHint == 2)
    {
        if (canSplit)
        {
            document.getElementById("move-hint").innerText = "Split";
        }
        else
        {        
            document.getElementById("move-hint").innerText = "Hit";
        }
    }
    document.getElementById("hint-text").style.display = "block";
}

function basicStrategy1()
{
    // basic strategy for first hand if you split
    hardStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]

    softStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [0,0,0,0,0,0,0,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]

    let soft = false;
    let arrayValue;
    moveHint = "";
    
    soft = yourAceCount > 0;

    if (soft)
    {
        if (yourSum >= 19)
        {
            arrayValue = 6;
        }
        else
        {
            arrayValue = yourSum - 13;
        }

        moveHint = softStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }
    else
    {
        if (yourSum >= 4 && yourSum <= 8)
        {
            arrayValue = 0;
        }
        else if (yourSum >= 17)
        {
            arrayValue = 9;
        }
        else
        {
            arrayValue = yourSum - 8;
        }

        moveHint = hardStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }

    if (moveHint == 0)
    {
        document.getElementById("move-hint").innerText = "Stand";
    }
    else if (moveHint == 1)
    {
        document.getElementById("move-hint").innerText = "Hit";
    }
    else if (moveHint == 2)
    {
        if (canSplit)
        {
            document.getElementById("move-hint").innerText = "Split";
        }
        else
        {        
            document.getElementById("move-hint").innerText = "Hit";
        }
    }
    document.getElementById("hint-text").style.display = "block";
}

function basicStrategy2()
{
    // basic strategy for second hand if you split
    hardStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,1,1,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]

    softStrategy = [[1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [1,1,1,1,1,1,1,1,1,1],
                    [0,0,0,0,0,0,0,1,1,1],
                    [0,0,0,0,0,0,0,0,0,0]]


    let soft = false;
    let arrayValue;
    let moveHint;

    soft = yourAceCount2 > 0;

    if (soft)
    {
        if (yourSum2 >= 19)
        {
            arrayValue = 6;
        }
        else
        {
            arrayValue = yourSum2 - 13;
        }

        moveHint = softStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }
    else
    {
        if (yourSum2 >= 4 && yourSum2 <= 8)
        {
            arrayValue = 0;
        }
        else if (yourSum2 >= 17)
        {
            arrayValue = 9;
        }
        else
        {
            arrayValue = yourSum2 - 8;
        }

        moveHint = hardStrategy[arrayValue][getValue(dealerUpcard) - 2];
    }

    if (moveHint == 0)
    {
        document.getElementById("move-hint").innerText = "Stand";
    }
    else if (moveHint == 1)
    {
        document.getElementById("move-hint").innerText = "Hit";
    }
    else if (moveHint == 2)
    {
        if (canSplit)
        {
            document.getElementById("move-hint").innerText = "Split";
        }
        else
        {        
            document.getElementById("move-hint").innerText = "Hit";
        }
    }
    document.getElementById("hint-text").style.display = "block";
}

// adding an additional card to the UI
function drawCard()
{
    document.getElementById("card-count").innerText = deck.length - 1;
    return deck.pop();
}
