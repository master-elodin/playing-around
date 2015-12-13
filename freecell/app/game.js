var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
var values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
var maxColumns = 8;
var columnSpace = 20;
var rowSpace = 40;
var cardHeight = 150;
var cardWidth = 100;
var suitCodes = {
  clubs:'&clubs;',
  diamonds:'&diams;',
  hearts:'&hearts;',
  spades:'&spades;'
}

var topStartPosition = 20;
var leftStartPosition = 20;

var initialized = false;

var Card = function(value, suit) {
  var instance = this;
  this.value = ko.observable();
  this.suit = ko.observable();
  if(value && suit) {
    instance.value(value);
    instance.suit(suit);
  }
  this.row = ko.observable();
  this.column = ko.observable();
  this.clicked = ko.observable(false);

  this.topValue = ko.computed(function() {
    return instance.row() * rowSpace + topStartPosition;
  });
  this.leftValue = ko.computed(function() {
    return instance.column() * (columnSpace + cardWidth) + leftStartPosition;
  });
  this.code = ko.computed(function() {
    return suitCodes[instance.suit()];
  });
}
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
var Game = function(){
  var instance = this;
  var tempCards = [];
  $.each(suits, function(suitIndex, suit) {
    $.each(values, function(valueIndex, value){
      tempCards.push(new Card(value, suit));

    });
  });
  shuffleArray(tempCards);
  var currentColumn = 0;
  var currentRow = 0;
  var cardColumns = {};
  $.each(tempCards, function(cardIndex, card) {
    var column = cardColumns[currentColumn];
    if(column === undefined) {
      column = [];
      cardColumns[currentColumn] = column;
    }
    card.row(currentRow);
    card.column(currentColumn);
    currentColumn++;
    column.push(card);
    if(currentColumn === maxColumns) {
       currentColumn = 0;
       currentRow++;
     }
  });
  instance.cards = ko.observableArray(tempCards);
  instance.freeCells = ko.observableArray([new Card(), new Card(), new Card(), new Card()]);
  instance.setClicked = function(data){
    if(initialized) {
      var col = cardColumns[data.column()];
      var lastCard = col[col.length - 1];
      var currentVal = lastCard.clicked();
      $.each(instance.cards(), function(i, card) {
        card.clicked(false);
      });
      lastCard.clicked(!currentVal);
    }
  }
}

ko.applyBindings(new Game());
initialized = true;
