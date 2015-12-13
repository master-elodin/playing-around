var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
var values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
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

  this.removeCardValue = function() {
    instance.value('');
    instance.suit('');
    instance.blankCard(true);
  }
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
  lastEmptyFreeCell = null;
  var hiddenFreeCells = {};
  var moveComplete = true;
  clearClicked = function() {
    $.each(instance.cards(), function(i, card) {
      card.clicked(false);
    });
    $.each(instance.freeCells(), function(i, card) {
      card.clicked(false);
    });
  }
  removeFromFreeCell = function( card, col ) {
    instance.freeCells.replace(card, hiddenFreeCells[col]);
  }
  removeFromCol = function( card ) {
    instance.cards.remove(card);
    var cardCol = cardColumns[clickedCard.column()];
    cardColumns[clickedCard.column()] = cardCol.slice(0, cardCol.length - 1);
  }
  removeCard = function( card ) {
    card.inFreeCell() ? removeFromFreeCell(card, card.column()) : removeFromCol( card );
  }
  moveCardToFreeCell = function( card, freeCellCol ) {
    if(instance.freeCells()[freeCellCol].blankCard()) {
      if(moveComplete) {
        moveComplete = false;
        removeCard( card );
        // Add to free cell
        if(clickedCard) {
          clickedCard.column(freeCellCol);
          clickedCard.row(0);
          clickedCard.inFreeCell(true);
          hiddenFreeCells[freeCellCol] = instance.freeCells()[freeCellCol]
          instance.freeCells.replace(hiddenFreeCells[freeCellCol], clickedCard);
        }

        clickedCard = null;
        clearClicked();
        moveComplete = true;
      }
    }
  }
  clickCard = function( card ) {
    var currentlyClicked = card.clicked();
    clearClicked();
    card.clicked(!currentlyClicked);
    clickedCard = !currentlyClicked ? card : null;
  }
  instance.clickFreeCell = function(data) {
    if(initialized) {
      if(!data.blankCard()){
        clickCard( data );
      }else {
        moveCardToFreeCell( clickedCard, data.column() );
      }
    }
  }
  canPutInEnd = function( clickedCard, existingEndCell ) {
    if(clickedCard) {
      if( existingEndCell.blankCard() || clickedCard.suit() === existingEndCell.suit()) {
        var newVal = values.indexOf(clickedCard.value());
        return newVal === 0 || newVal < values.length && newVal === values.indexOf(existingEndCell.value()) + 1;
      }
    }
    return false;
  }
  instance.clickEndCell = function( data ) {
    if(initialized) {
      if(canPutInEnd( clickedCard, data )){
        if(moveComplete){
          moveComplete = false;
          removeCard( clickedCard );
          clickedCard.column( data.column() );
          clickedCard.row(0);
          instance.endCells.replace(data, clickedCard);
          moveComplete = true;
        }
      } else {
        clearClicked();
      }
    }
  }
  instance.setClicked = function(data){
    if(initialized) {
      var col = cardColumns[data.column()];
      clickCard( col[col.length - 1] );
    }
  }
}

ko.applyBindings(new Game());
initialized = true;
