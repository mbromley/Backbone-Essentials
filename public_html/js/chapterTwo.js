//alert("Chapter Two");


// NOTES : JavaScript is a prototype-based inheritance language


// 'this' - Global scope becuase not within a Method
var testGlobalThis = function() {
    alert(this);
}
//testGlobalThis(); // alerts window


// Basic Object creation **********

var simpleBook = {currentPage: 3, pages: 60};

// Basic function applied to Object (a Method)
simpleBook.turnPage = function() {
    this.currentPage += 1;
    return this.currentPage;
};
simpleBook.turnPage(); // == 4
//console.log(simpleBook.turnPage()); //prints out 4


// Backbone ***********

// Define Book's Initializer
var Book = function() {
    // define Book's default properties
    this.currentPage = 1;
    this.totalPages = 1;
}

// Define book's parent class
Book.prototype = new Backbone.Model();

// Define a method of Book
Book.prototype.turnPage = function() {
    
    console.log("turnPage()");
    
    this.currentPage += 1;
    return this.currentPage;
}

var myBook = new Book();
//myBook.turnPage();

// __proto__ to console == prints out all properties of the parent 
console.log(myBook.__proto__);


// NOTES - Backbone

// var Book = Backbone.Model.extend({}, {...})
// var book = new Book();

// 1) You can add methods and properties to the model function when creating it using 'extend()'; 
//    - This is nice visually. We can see the structure of the object rather than using 'prototype' to add each new method or property
// 2) There are lots of methods contained within the Backbone.Model such as: 'book.destroy()';
// 3) You can use 'book.prototype({})' to add new methods to that instance of the Book class


var simpleBook1 = {currentPage: 20};
Book.prototype.turnPage.apply(simpleBook1);
console.log("simpleBook1.currentPage : " + simpleBook1.currentPage);

var Book1 = Backbone.Model.extend();

var book1 = new Book1();
book1.alertMessage = function(message, secondMessage) {
    console.log("Alert Message : " + message + " " + secondMessage);
};

// NOTES -  prototype properties:

// USING apply() and call() arrays of arguements can be passed in the following ways : 

// apply()

book1.alertMessage.apply(null, ['hello', 'apply']);

// call()

book1.alertMessage.call(null, 'hello', 'call');


// Underscore.js *********

// 1) Scope of 'this'
// - 'this' is passed into the function - set as the object that calls the function
// - this can be 'fixed' by using a nested function to call 'this'. 'this' then becomes the object itself 

// 'this' = window
var exampleObj = function() {console.log(this);};
//window.setTimeout(exampleObj); // alerts: Window{};

// Ugly fix 'this' = its function
var exampleObject = {};
exampleObject.alertThisBuilder = function() {    
    var alertThis = function() {
        console.log(this);
    };
    var correctThis = this;
    return function() {        
        alertThis.apply("correctThis : " + correctThis);
    };
};
var alertThis = exampleObject.alertThisBuilder();
//window.setTimeout(alertThis); // would alert 'window object' but correct to 'exampleObject';


// 2) bind() and bindAll()
// - fixes scoping issues

// _.bind

var simpleBook2 = {};
simpleBook2.alertThis = function() {
    console.log(this);
};
simpleBook2.alertThis = _.bind(simpleBook2.alertThis, simpleBook2);
//window.setTimeout(simpleBook2.alertThis);

// _.bindAll

// - very powerful but... creates a new instance of the object every time... a byproduct of retaining its own 'this'

var Book3 = Backbone.Model.extend({
    initialize: function() {
        _.bindAll(this, 'alertThis');
    },
    alertThis: function() {
        console.log(this);
    }
});
var book3 = new Book3();
//window.setTimeout(book3.alertThis); //alerts 'book3' not 'Window'



// More underscore ********

// _.each()    _.map()    _.reduce()    _.extend()     _.defaults()


// _.each 
// replaces for loops and is compatible with older browsers


var mythicalAnimals = ['Unicorn', 'Dragon', 'Honest Politician'];

// no need to extract the name via the array's index
_.each(mythicalAnimals, function(animalName, index){
    console.log('Animal #' + index + ' is ' + animalName);
});

// this is used in place of:
// for loop
for(var index=0; index < mythicalAnimals.length; index++) {
    var animalName = mythicalAnimals[index];
    console.log('FOR LOOP - Animal #' + index + ' is ' + animalName);
}

// for/in loop
for(var index in mythicalAnimals) {
    var animalName = mythicalAnimals[index];
    console.log('FOR/IN LOOP - Animal #' + index + ' is ' + animalName);
}

console.log("---------------");


var stringNums = ["5", "10", "15"];
var BASE = 10; //when parsing strings into numbers we have to specify which base to use

// _.map
// converts array of variable into another different array of variables
// i.e. convert any kind of array into any other kind of array

var actualNumbers = _.map(stringNums, function(numberString, index){
    return parseInt(numberString, BASE);
});
console.log(actualNumbers);

// _.reduce
// converts array of variables into one variable
// the last arguemnt, actualNumber, is called the 'memo argument' *******
// memo argument is the starting value that will reduce
// the updated memo is iterated again and is eventually returned
var total = _.reduce(actualNumbers, function(total, actualNumber) {
   return total + actualNumber; 
});
console.log(total);

console.log("-------------------");

var commonConfiguration = {foo:true, bar:true};
var specificConfiguration = {foo:false, baz:7};

// _.extend

// creates a new object by combining the initial argument and copies properties onto second
// commong properties are combined and new properties of second argument added
// updates common vars values to those of extended object 
var combined_extend = _.extend({}, commonConfiguration, specificConfiguration);
console.log(combined_extend);

// _.defaults
// retains original objects values for common properties

var combined_defaults = _.defaults({}, commonConfiguration, specificConfiguration);
console.log(combined_defaults); 


console.log("---------------");

// _.pluck()     _.invoke()

var fakeBooks = [
    {title:'Become English Better At', pages:50, author:'Bob'},
    {title:'You is Become Better at English', pages:100, author:'Bob'},
    {title:'Bob is a Terrible Author', pages:200, author:'Fred the Critic'}
];

var fakeTitles = _.pluck(fakeBooks, 'title');
console.log(fakeTitles);


var Booky = Backbone.Model.extend({
   getAuthor: function () {
       // the 'get' method returns an attribute of the model
       return this.get('author');
   } 
});

var bookys = [  new Booky(fakeBooks[0]),
                new Booky(fakeBooks[1]),
                new Booky(fakeBooks[2])];

var authors = _.invoke(bookys, 'getAuthor');
console.log(authors);
