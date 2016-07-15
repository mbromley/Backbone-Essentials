/* global Backbone, _ */

//alert('Chapter 4');


// Collections ***********************************


// - improvements to Arrays

// - uses Backbone's class system

// - allows listeners for adding and removing Models from Collections

// - simplifies and encapsulates the logic for communicating with the server

// 1) Create a subclass
var Cat = Backbone.Model.extend();
var Cats = Backbone.Collection.extend({
   // The properties and methods of Cats would go here
   model:Cat
});

//2) use 'new' keyword to instantiate new instances of Cat
var cartoonCats = new Cats([{id:'cat1', name:'Garfield'}]);

var garfield = cartoonCats.models[0]; // garfield is a Model

// Each Model is stored in a hidden property called 'models'
// - 'models' defaults to Backbone.Model
// - similar to 'attributes', 'models' should not be used directly
// - Instead, access these by Collection methods
// - 'length' is a property of Collections

var cartoonCats2 = new Cats([
    {name:'Garfield'},
    {name: 'Heathcliff'}
]);
console.log(cartoonCats2.models.length); // 2 - but instead you can do...
console.log(cartoonCats2.length); // 2

// 'model' can be set by providing it as an option when creating a new Collection
var Kitty = Backbone.Model.extend();
var kitty = new Kitty({name:'Little Kitty'});

var Kittys = Backbone.Collection.extend({model: Kitty});
var kittys = new Kittys(); // kittys.model = Kitty

kittys.add(kitty);

console.log('kittys.models.length: '  + kittys.models.length);
console.log('kittys.length: '  + kittys.length);
console.log(kittys.models[0] instanceof Kitty);

console.log(kittys.models[0].attributes.name); // <--- don't do this
console.log(kittys.models[0].get('name')); // <--- DO THIS !!!



// NOTE: the model property doesn't limit the types of Models a Collection can hold
// - a Collection can hold any type of model

var Dog = Backbone.Model.extend();
var snoopy = new Dog({name:'Snoopy'});
cartoonCats2.add([snoopy]);
console.log(cartoonCats2.length); // 3
console.log(cartoonCats2.models[cartoonCats2.length-1].attributes.name); // Snoopy
console.log(cartoonCats2.models[cartoonCats2.length-1] instanceof Dog); // true

var Dude = Backbone.Model.extend();
var Dudes = Backbone.Collection.extend({model:Dude});
var dudes = new Dudes;
var dude = new Dude({name:'Garf Blooks'});
dudes.models.push(dude);

//dudes.save();


// 'create'

// NOTES : convenient:
// - creates new instance, saves it to the server
// - more info: http://backbonejs.org/#Collection-create

//var garf = dudes.create({name:'Garf Blooks'});



// Adding and resetting Collections

// add

var Chat = Backbone.Model.extend();
var Chats = Backbone.Collection.extend({model: Chat});
var chats = new Chats();
chats.add({name:'Garfield'});
console.log(chats.models[0] instanceof Chat);

// reset()

var chits = new Backbone.Collection([{name:'Chitty Bang Bang'}]);
chits.reset([{name:'Bing Bong'}]);
console.log(chits.length);
console.log(chits.models[0].get('name'));



// Indexing *****************************************


// Model's 'id' property
// - can be set directly or indirectly --- idAttribute

// Models cid property --- get this for free

// Backbone uses both of these attributes to register the Model in a Collection's '_byId' property (hidden)

// NOTE : _ (underscore) denotes a hidden property. Don't use hidden properties directly !!
// - use a getter insted:


// get(shaggy.cid) or get('cat1')

var shaggy = new Chat({
    id: 'cat1',
    name:'Shaggy DA'
});
var coln = new Backbone.Collection([shaggy]);
console.log(coln.get('cat1').get('name'));
console.log(coln.get(shaggy.cid).get('name'));

// NOTE : useing 'get()' along with the id or cid returns the object


// remove(shaggy.cid) or remove('cat1')

coln.remove(coln.get(shaggy.cid));
console.log(coln.get('cat1'));  // it is gone!


// Other available methods :   push() , pop() , unshift() , shift() , slice()


// NOTE : You can access a model in the collection by 'index', as well

var coll = new Backbone.Collection([{name:'Skinny'}, {name:'Runt'}]);
console.log(coll.model.length);
console.log(coll.at(1).get('name'));
coll.pop(1);
console.log(coll.length);
console.log(coll.at(coll.length-1).get('name'));



// Sorting  *******************************************


var Comps = Backbone.Collection.extend({comparator:'name'});
var comps = new Comps();
console.log('comparator : ' + comps.comparator);

var scats = new Backbone.Collection([
    {name:'Heathcliff'},
    {name:'Garfield'}], {
    comparator:'name'
});

console.log(scats.at(0).get('name'));

// 'comparator' as a function

var Sats = Backbone.Collection.extend({
    comparator : function(sat){
        if(sat.get('name') == 'Heathcliff') return 0;
        return sat.get('name');
    }
});

var sats = new Sats([
    {name:'Heathcliff'},
    {name:'Garfield'}    
]);
console.log(sats.at(0).get('name')); // 'Heathcliff' because 0 comes before 'Garfield' alphabetically


var Nats = Backbone.Collection.extend({
    comparator: function(leftCat, rightCat){
        //Special sorting case for Heathcliff
        if(leftCat.get('name') == 'Heathcliff') return -1;
        //Sorting rules for all others
        if(leftCat.get('name') > rightCat.get('name')) return 1;
        if (leftCat.get('name') < rightCat.get('name')) return -1;
        if(leftCat.get('name') == rightCat.get('name')) return 0;
    }
});

var nats = new Nats([
    {name:'Heathcliff'}, 
    {name:'Garfield'}
]);

console.log(nats.at(0).get('name')); // 'Heathcliff' because he will always resolve to -1



// Events **************************************


// 'on' and 'off' methods for event listeners - just like Methods

// 'all'  method can be used to listen for any changes in a Colletion's Model 


/*
 
  add           When a Model or Models is/are added to the Collection

remove          When a Model or Models is/are removed from the Collection

reset           When the Collection is reset

sort            Whenever the Collection is sorted (typically after an add/remove)

sync            When an AJAX method of the Collection has completed

error           When an AJAX method of the Collection returns an error

invalid         When validation triggered by a Model's save/isValid call fails
 
 
 */


var tats = new Nats([{name:'Garfield'}]);
tats.on('change', function(changeModel){
   console.log('CHANGE TO MODEL : ' + changeModel.get('name') + ' / ' + changeModel.get('weight')); 
});
tats.at(0).set('weight', 'a tonne');


// Server Side Actions ******************************

// fetch()

// fetch - by default merges all new data with existing data

// {reset: true} can be passed in to completely replace all existing data with new data



// url , pars , toJSON
 
// no urlRoot !!
// - Collections don't have IDs so no need to generate URLs using .urlRoot   <--- NO URL ROOT

// - just like models that can control how to fetch() and save()

var kits = new Nats({name:'Garfield'});
//cats.save(); // saves to the server
//cats.fetch(); //retrieves cats from server and saves them


// Underscore methods ******************************************

// - Collections have 28 Underscore methods !!
// 
// - some of which operate on the Model's attributes within the Collection
// - some methods return Arrays rather than new Collections (more performant)


/*
 
each            This iterates over every Model in the Collection

map             This returns an array of values by transforming every Model in the Collection

reduce          This returns a single value generated from all the Models in a Collection

reduceRight     The same as reduc e, except that it iterates backwards

find            This returns the first Model that matches a testing function

filter          This returns all the Models that match a testing function

reject          This returns all the Models that don't match a testing function

every           This returns true if every Model in the Collection matches a test function

some            This returns true if some (any) Model in the Collection matches a test function

contains        This returns true if the Collection includes the provided Model

invoke          This calls a specified function on every Model in the Collection and returns the result

max             This applies a conversion function to every Model in the Collection and returns the maximum value returned

min             This applies a conversion function to every Model in the Collection and returns the minimum value returned

sortBy          This returns the Collection's Models sorted based on an indicated attribute

groupBy         This returns the Collection's Models grouped by an indicated attribute

shuffle         This returns one or more randomly chosen Models from the Collection

toArray         This returns an array of the Collection's Models

size            This returns a count of Models in the Collection, such as Collection.length

first           This returns the first (or first N) Model(s) in the Collection

initial         This returns all but the last Model in the Collection

rest            This returns all the Models in the Collection after the first N

last            This returns the last (or last N) Model(s) in the Collection

without         This returns all the Models in the Collection except the provided ones

indexOf         This returns the index of the first provided Model in the Collection

lastIndexOf     This returns the index of the last provided Model in the Collection

isEmpty         This returns true if the Collection contains no Models

chain           This returns a version of Collection that can have multiple Underscore methods called on it successively (chained); call the value method at the end of the chain to get the result of the calls

pluck           This returns the provided attribute from each Model in the Collection

where           This returns all the Models in the Collection that match the provided attribute template

findWhere       This returns the first Model found in the Collection that matches the provided attribute template
 
 */



// each()

var snacks = new Backbone.Collection([
    {name:'Garfield'},
    {name:'Heathcliff'}
]);
snacks.each(function(snacks){
    console.log('each name : ' + snacks.get('name'));
});


// Testing methods

// contains()  ,  isEmpty()

var wAndP = new Backbone.Model();
var koobs = new Backbone.Collection([wAndP]);

console.log(koobs.contains(wAndP)); // true
console.log(koobs.isEmpty()); // false


// every()  ,  some()


var boo = new Backbone.Collection([
    {pages:120, title:'Backbone Essentials'},
    {pages:20, title:'Event More Fake Titles'}
]);
boo.some(function(book){
    
    console.log(book.get('pages') > 100);
    
    return book.get('pages') > 100;
}); //true
boo.every(function(book){
    
    console.log(book.get('pages') > 100);
    
    return book.get('pages') > 100;
}); // false




// Extraction methods


// where()   ,    findWhere()


var lots = boo.where({pages:120});

console.log(lots); // returns array

var one = boo.findWhere({pages:120});
console.log(one); // returns model

var bs = new Backbone.Collection([
    {pages:100, title:'Skippy is Here'},
    {pages:200, title:'Skippy 200'},
    {pages:25, title:'Skippy 25'}    
]);

var moreThanHun = bs.filter(function(book){
    return book.get('pages') >= 100;
});

console.log(moreThanHun.length);
console.log(_.isArray(moreThanHun));  // is an array

var rejectSome = bs.reject(function(book){
    return book.get('pages') >= 100;
});

console.log(rejectSome.length);  // returns what was rejected by the first query
console.log(_.isArray(rejectSome));  // is an array



// Ordering methods

// toArray()   ,   sorttBy()   ,   groupBy()

// NOTE : these return arrays of models


var blah = new Backbone.Collection([
    {title:'Zebras'},
    {title:'Horses'},
    {title:'Hippos'}
]);

var notAlphabetical = blah.toArray();
console.log(notAlphabetical);
var alphabetical = blah.sortBy('title');
console.log(alphabetical);

_.each(notAlphabetical, function(someThing) {
  console.log('not alpha : ' + someThing.get('title'));
});

_.each(alphabetical, function(someThing) {
  console.log('is alpha : ' + someThing.get('title'));
});


var groupByFirstLetter = blah.groupBy(function(book){
    return book.get('title')[0];
});
console.log(groupByFirstLetter);

console.log('Why is everything that i type being watched?');
console.log('Here is a second line');


