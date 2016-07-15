
/* global Backbone */

//alert("Chapter Three");

// Models and Server Data ***************************


// 1) Atributes, options, and properties

// 'attributes' is itself a property of Model
// 'attributes' stores the assigned attributes as properties of itself

// NOTE : Attributes vs Properties
// Remember: attributes are simply properties but they have additional functionality:
//  - USE 'attributes' if those attributes can be updated from the server 
//  - or we want to listen for changes in their values
//  - OR ELSE it is better to use normal properties

// 'attributes' can be assigned simply by passing them in as the first argument:
var book = new Backbone.Model({pages:200});
book.renderBlackandWhite = true;

book.attributes.pages; // is a property of book
book.renderBlackandWhite; // is a property of book


 var Book = Backbone.Model.extend({
     defaults: {publisher: {name: 'Packt Publishing'}}
 });
 
 var book1 = new Book();
 console.log("book 1 name : " + book1.attributes.publisher.name);
 
 var book2 = new Book();
 book2.attributes.publisher.name = 'Wack Publishing';
 console.log("book2 name : " + book2.attributes.publisher.name);
 
 // The publisher name changed for both books
 console.log("book1 name : " + book1.attributes.publisher.name);

// New copies of Book() will now have the updated publisher name
var book3 = new Book();
console.log("book3 name : " + book3.attributes.publisher.name);

// YOU PROBABLY DON'T WANT CHANGES TO ONE MODEL AFFECTING YOUR OTHER MODELS!!!
// - So you may wish to avoid setting objects in defaults.
// - If you need to set an object as default, you may wish to do so in the 'initialize' method
// - IT WOULD APPEAR THAT DEFAULT VALUES ARE MEANT TO CHANGE


// .set()   .unset()   .get()

// NOTE :  'get' and 'set' have much better extensibility than accessing properties via dot notation 
// - By OVERRIDING THE 'get' function you can tap in to all of the logic in one place. 
// Better than trying to find and change every instance of dot notation and change them 

var booky = new Book({pages:200});

booky.attributes.pages = 100;  // <--- DON'T DO THIS !!!!!

booky.set('pages', 150);  // <--- DO THIS 

booky.set({pages:50, currentPage:25}); // <--- USE THIS TOO

booky.unset('currentPage'); // <--- UNSET WILL NOTIFY LISTENERS

delete book.attributes.currentPage; // <--- DON'T DO THIS !!!!!

console.log(booky.attributes.pages + ' / ' + booky.attributes.currentPage); 

console.log(booky.get('pages')); // <--- DO THIS
console.log(booky.attributes.pages); // <---  DON'T DO THIS !!!!!

console.log('-------------------');

// 2) Listeners **************************************

var booksy = new Backbone.Model({pages:50});
booksy.on('change:pages', function() {
    //triggers when the pages of the book change
    console.log('THE NUMBER OF PAGES HAS CHANGED');
});
booksy.set('pages',51); // <--- listened for, triggers on function in Model

book.off('changes:pages');

book.set('pages',52); // <--- no longer listened for

book.on('change detroy', function() {
    console.log("TRIGGERED BY CHANGE OR DESTROY");
});

// NOTE : A 'callback' can be bound if passed in as a third arguemnt
// similar to Underscore's _.bind
    
var Author = Backbone.Model.extend({
    listenForDeathOfRival: function(rival) {
        rival.on('destroy', function 
            celebrateRivalDeath() {
                console.log('Hurray!!! I, ' + this.get('name') + ', hated ' + rival.get('name') +' anyway!');            
        }
        ,this); // 'this' is our context argument
    }
});

var keats = new Author({name:'John Keats'});
var byron = new Author({name:'Lord Byron'});
byron.listenForDeathOfRival(keats);
keats.destroy();

// TABLE OF AVAILABLE EVENTS

/*
change                  When any attribute of a Model changes

change:attribute        When the specified attribute changes
    
destroy                 When the Model is destroyed

request                 When an AJAX method of the Model starts

sync                    When an AJAX method of the Model has completed

error                   When an AJAX method of the Model returns an error

invalid                 When validation triggered by a Model's save/isValid call fails
*/


// Custon Events

// Not likely to be used very often

// 'trigger' method

// i.e. someModel.trigger('fakEvent', 5);


// Server Side Actions *********************************

//RESTful - Representational State Transfer
// - uses server-side APIs that use RESTful architecture 
// - URL endpoints that expose various resources for the client to consume

/*
Method                          RESTful URL         HTTP method         Server action

fetch                           /books/id           GET                 retrieves data

save (for a new Model)          /books              PUT                 sends data

save (for an existing Model)    /books/id           POST                sends data

destroy                         /books/id           DELETE              deletes data 
*/

console.log('-----');

// urlRoot property

var Books = Backbone.Model.extend({
    urlRoot: '/books'
});
var b = new Books();
//b.save();


// url can be overridden based on criteria

var Boks = Backbone.Model.extend({
    url:function(){
        if(this.get('fiction')){
            return '/fiction';
        }else{
            return '/nonfiction';
        }            
    }
});
var theHobbit = new Boks({fiction:true});
var theWord = new Boks({fiction:false});

console.log('hobbit url : ' + theHobbit.url());
console.log('word url : ' + theWord.url());


// Storing URLs on the client

var urls = {
    books:function(){
        return this.get('fiction') ? '/fiction' : '/nonfiction';
    },
    magazines:'magazines'
};
var Bink = Backbone.Model.extend({url: urls.books});
var Magazine = Backbone.Model.extend({urlRoot:urls.magazines});


// Identification

// id, _id
// idAttribute  - property of Model class

// lack of an id tells us that the model is new

// Backbone watches for an idAttribute property and sets the Model's special id property to that value

var Blink = Backbone.Model.extend({idAttribute:'deweyDecimalNumber'});
var warAndPeace = new Blink({deweyDecimalNumber: '082 s 189.73/3'});
console.log(warAndPeace.get('deweyDecimalNumber'));
console.log(warAndPeace.id);

var fiftyShades = new Blink();


// if a Model has an id - .isNew() will return false
// else will return true
console.log(warAndPeace.isNew());
console.log(fiftyShades.isNew());

warAndPeace.set('name', 'War And Peace');
fiftyShades.set('name', '50 Shades');

// cid - Backbone automatically provides this for each Model when it is created - ON CLIENT SIDE

var bookGroup = {};
bookGroup[warAndPeace.cid] = warAndPeace;
bookGroup[fiftyShades.cid] = fiftyShades;

console.log(bookGroup[warAndPeace.cid]);
console.log(bookGroup[fiftyShades.cid]);

// Fetching Data From Server

// fetch - one of 3 AJAX methods
// - doesn't require any arguments, but accepts a single 'options' argument
// - 'GET' request followed by a 'set' of whatever comes back
// - JSON is returned. If not formatted as expected, you may need to override 'parse' method

var blook = new Blink({id:55});
console.log(blook.get('url'));


blook.fetch({
    success:function(){
        console.log("The fetch completed successfully");
    },
    error:function(){
        console.log("An error occurred during the fetch");
    }
});

// promise
// - slightly more powerful because you can easily trigger multiple callbacks from a single fetch
// or trigger a callback only after multiple callbacks have been completed

var promise = blook.fetch().done(function(){
    console.log("The fetch completed successfully");
}).fail(function(){
    console.log("An error occurred during the fetch");
});

// example: function called after multiple Models ahve been returned

var peaceAndWar = new Backbone.Model({id:55, url:'/banana'});
var shadesOfFifty = new Backbone.Model({id:56, url:'/orange'});

var peacePromise = peaceAndWar.fetch();
var shadesPromise = shadesOfFifty.fetch();

$.when(peacePromise, shadesPromise).then(function(){
    console.log("Both books have been successfully fetched");
});


// override 'parse' 

var Blonk = Backbone.Model.extend({
   parse: function(response){
       return response.pages; // Backbone will call 
       this.set(response.pages);
   } 
});

// Saving data to server

// 'save'

var black = new Book({
   pages:20,
   title:'Not Really a Colour'
});
black.save().done(function(response){
    console.log('save response : ' + response);
});

// 'toJSON'

//- if JSON is non standard, use 'toJSON'

var Gink = Backbone.Model.extend({
   toJSON: function(originalJson){
       return{
           data:originalJson,
           otherInfo: 'stuff'
       };
   } 
});

var gink = new Gink({pages:100});
gink.save(); // will send {book:{pages:100}, otherInfo:'stuff'}


// Validation

// 'validate'
// - this method is actually called every time you save
// - override to add functionality

var Slink = Backbone.Model.extend({
   validate: function(attributes){
       var isValid = this.get('pages') >= 10;
       return isValid;
   } 
});
var tooShort = new Slink({pages:5});
var wasAbleToSave = tooShort.save(); // == false

// NOTE : if validation fails, Backbone will not even return a 'promise', it will just return 'false';
// - therefore you will need to test for a failed validation separately every time you save. 
// - 'fail' method of the 'promise' will not work as no promise is returned at all

tooShort.save().fail(function(){
   //this code will never be reached 
});

// Instead do this:

var savePromise = tooShort.save();
if(savePromise){
    savePromise.done(function(){
       // this code will be reached if validation and AJAX call succeed 
    }).fail(function(){
        //this code will be reached if the validation passes but AJAX fails
    });
}else{
    //this code will be reached if validation fails    
}

// Underscore methods on Model

var tonk = new Backbone.Model({
   pages:20,
   title:'Short Title'
});
var attributeKeys = _.keys(book.attributes);
alert(attributeKeys); // alerts ['pages', 'title']

/*
 keys       This returns every attribute key

values      This returns every attribute value

pairs       This returns an array of attribute key/value pairs

invert      This returns the attributes with keys and values switched; for instance, an attribute of {'pages': 20} will become {'20': 'pages'}

pick        This returns both the keys and values of only the specified attributes; for instance, book.pick('pages') will return {pages: 20} without any title or other attributes

omit        This returns both the keys and values for every attribute except those specified; for instance, book.omit('pages') will return {title: 'Short Title'} 
*/


