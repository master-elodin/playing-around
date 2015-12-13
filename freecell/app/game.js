var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
var values = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
var maxColumns = 8;
var columnSpace = 20;
var rowSpace = 30;
var cardHeight = 100;
var cardWidth = 80;
var suitCodes = {
  clubs:'&clubs;',
  diamonds:'&diams;',
  hearts:'&hearts;',
  spades:'&spades;'
}

var topStartPosition = 120;
var leftStartPosition = 20;

var initialized = false;

var Card = function(value, suit) {
  var instance = this;
  this.value = ko.observable();
  this.suit = ko.observable();
  this.blankCard = ko.observable(false);
  this.inFreeCell = ko.observable(false);
  if(value && suit) {
    instance.value(value);
    instance.suit(suit);
  } else {
    instance.blankCard(true);
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
  instance.endCells = ko.observableArray([new Card(), new Card(), new Card(), new Card()]);
  $.each(instance.freeCells(), function(i, freeCell){
    freeCell.column(i);
    instance.endCells()[i].column(i+4);
  });
  clickedCard = null;
  clearClicked = function() {
    $.each(instance.cards(), function(i, card) {
      card.clicked(false);
    });
  }
  instance.setClicked = function(data){
    if(initialized) {
        if(!data.blankCard() && !data.inFreeCell()) {
          var col = cardColumns[data.column()];
          var lastCard = col[col.length - 1];
          var currentVal = lastCard.clicked();
          clearClicked();
          lastCard.clicked(!currentVal);
          clickedCard = lastCard.clicked() ? lastCard : null;
      } else {
        if(clickedCard && data.blankCard()){
          // free cell
          if(data.column() < 4) {
            instance.cards.remove(clickedCard);
            var cardCol = cardColumns[clickedCard.column()];
            cardColumns[clickedCard.column()] = cardCol.slice(0, cardCol.length - 1);
            clickedCard.column(data.column());
            clickedCard.row(0);
            clickedCard.clicked(false);
            clickedCard.inFreeCell(true);
            instance.freeCells.replace(instance.freeCells()[data.column()], clickedCard);
            clickedCard = null;
          }else {
            // end cell
          }
        }
      }
    }
  }
}

ko.applyBindings(new Game());
initialized = true;
