var deck;
var dealerHand = new Hand();
var playerHand = new Hand();
var deckNumber = 3;

function Card(num, suit) {
    this.point = num;
    this.suit = suit;
}
Card.prototype.getImageUrl = function() {
    var name = this.point;
    if (this.point === 11) {
        name = 'jack';
    } else if (this.point === 12) {
        name = 'queen';
    } else if (this.point === 13) {
        name = 'king';
    } else if (this.point === 1) {
        name = 'ace';
    }
    return 'images/' + name + '_of_' + this.suit + '.png';
};
Card.prototype.printCard = function() {
    var stringCard = this.point + ' of ' + this.suit;
    return stringCard;
};

function Hand() {
    this.cards = [];
    this.points = 0;
}
Hand.prototype.addCard = function(card_obj) {
    if (card_obj instanceof Card) {
        this.cards.push(card_obj);
        return 'Added card';
    } else {
        return "Invalid card";
    }
};
Hand.prototype.getPoints = function() {
    this.points = 0;
    var addPoint = 0;
    var pointList = [];
    for (var idxCard in this.cards) {
        var card = this.cards[idxCard];
        if (card.point >= 10) {
            addPoint = 10;
        } else if (card.point === 1) {
            if (this.points + 11 > 21) {
                addPoint = card.point;
            } else {
                addPoint = 11;
            }
        } else {
            addPoint = card.point;
        }
        this.points += addPoint;
        pointList.push(addPoint);
    }
    if (this.points > 21) {
        for (var idxAddPoint in pointList) {
            if (pointList[idxAddPoint] === 11) {
                this.points -= 10;
            }
        }
    }
    return this.points;
};
Hand.prototype.printHand = function() {
    for (var idxCard in this.cards) {
        console.log(this.cards[idxCard]);
    }
};

function Deck() {
    this.cards = [];
    for (var idxNumber = 1; idxNumber <= 13; idxNumber++) {
        for (var idxSuit = 0; idxSuit < 4; idxSuit++) {
            if (idxSuit === 0) {
                suit = "spades";
            } else if (idxSuit === 1) {
                suit = "hearts";
            } else if (idxSuit == 2) {
                suit = "clubs";
            } else {
                suit = "diamonds";
            }
            this.cards.push(new Card(idxNumber, suit));
        }
    }
}
Deck.prototype.draw = function() {
    var card1 = this.cards.pop();
    return card1;
};
Deck.prototype.shuffle = function() {
    var shuffled = [];
    var deckLength = this.cards.length;
    while (deckLength > 0) {
        var j = Math.floor(Math.random() * deckLength);
        var randCard = this.cards.splice(j, 1);
        shuffled.push(randCard[0]);
        deckLength -= 1;
    }
    this.cards = shuffled;
};
Deck.prototype.numCardsLeft = function() {
    return this.cards.length;
};

function largeDeck() {
    deck = [];
    for (var i = 0; i < deckNumber; i++) {
        deck = deck.concat(new Deck());
    }
}

$(document).ready(function() {
    deck = new Deck();
    deck.shuffle();

    $(".card-back").hide();
    $('#hit-button').prop('disabled', true);
    $('#stand-button').prop('disabled', true);

    $("#deal-button").click(function() {
        $('#deal-button').prop('disabled', true);
        $('#hit-button').prop('disabled', false);
        $('#stand-button').prop('disabled', false);
        $('#dealer-points').hide();
        $(".card-back").show();
        for (var i = 0; i < 2; i++) {
            giveCardDealer();
            if (i == 1) {
                $("#dealer-hand img:nth-child(2)").hide();
            }
            giveCardPlayer();
            displayPoints();
            checkBust();
        }
        checkBlackJack();
    });

    $("#hit-button").on("click", function() {
        giveCardPlayer();
        displayPoints();
        checkBust();
    });

    $("#playAgainButton").click(function() {
        $('#eventModal').modal('hide');
        newGame();
    });

    $("#stand-button").click(function() {
        $('#hit-button').prop('disabled', true);
        $(".card-back").hide();
        $("#dealer-hand img:nth-child(2)").show();
        $('#dealer-points').show();
        while (dealerHand.getPoints() < 17) {
            giveCardDealer();
            displayPoints();
            checkBust();
            console.log('message: ' + $('#eventMessage').text());
        }
        if (dealerHand.getPoints() <= 21) {
            checkWin();
        }
        console.log('message: ' + $('#eventMessage').text());
    });

    function giveCardDealer() {
        var dealtCard = deck.draw();
        var urlDealt = dealtCard.getImageUrl();
        dealerHand.addCard(dealtCard);
        $('#dealer-hand').append("<img class='card' src='" + urlDealt + "' />");
    }

    function giveCardPlayer() {
        var dealtCard = deck.draw();
        var urlDealt = dealtCard.getImageUrl();
        playerHand.addCard(dealtCard);
        $('#player-hand').append("<img class='card' src='" + urlDealt + "' />");
    }

    function displayPoints() {
        $('#dealer-points').text(dealerHand.getPoints().toString());
        $('#player-points').text(playerHand.getPoints().toString());
    }

    function checkBust() {
        if (dealerHand.getPoints() > 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("Dealer busts! PLAYER WINS!");
        } else if (playerHand.getPoints() > 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("Player busts! DEALER WINS!");
        }
    }

    function checkBlackJack() {
        if (playerHand.getPoints() == 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("BLACKJACK!!!  Player Wins");
        }
    }

    function checkWin() {
        if (playerHand.getPoints() == 21 && dealerHand.getPoints() == 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("PUSH!");
        } else if (playerHand.getPoints() == 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("BLACKJACK!!!  Player Wins");
        } else if (dealerHand.getPoints() == 21) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("BLACKJACK!!!  Dealer Wins");
        } else if (dealerHand.getPoints() > playerHand.getPoints()) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("DEALER WINS!");
        } else if (playerHand.getPoints() > dealerHand.getPoints()) {
            $('#eventModal').modal('show');
            $('#eventMessage').text("PLAYER WINS!");
        } else {
            $('#eventModal').modal('show');
            $('#eventMessage').text("PUSH!");
        }
    }

    function newGame() {
        deck = new Deck();
        deck.shuffle();
        dealerHand = new Hand();
        playerHand = new Hand();
        $('#dealer-hand').text("");
        $('#dealer-hand').append("<img class='card card-back' src='images/black_joker.png'/>");
        $(".card-back").hide();
        $('#player-hand').text("");
        $('#dealer-points').text('');
        $('#player-points').text('');
        $('#deal-button').prop('disabled', false);
        $('#hit-button').prop('disabled', true);
        $('#stand-button').prop('disabled', true);
    }

});
