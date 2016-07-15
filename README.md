# jpath

_XPath for JSON_

JPath i* s a simple lightweight Javascript Class which provides an XPath-like querying ability to JSON objects.

## Features

* basic node selection
* element index selection
* unlimited, nested predicate selections via inline javascript functions
* 2 methods of querying, chained javascript functions or traditional XPath query string
* root, parent, global node selections
* predicate functions [ last(), position(), count() ]
* boolean operators

## Using JPath

There are two syntactic methods to using JPath — chained method calls or an XPath query.

Chained method calls offers the most control but with a high level of complexity. XPath query is a lot easier 
to use but with the caveat that it’s considered beta and rather limited as far as Javascript features go.

__Example JSON Object Used__

  var library = {
     'name' :'My Library',
     '@open' : '2007-17-7',
     'address' : {
  	'city' : 'Springfield',
  	'zip' : '12345',
  	'state' : 'MI',
  	'street' : 'Mockingbird Lane'
     },
     'books':[
  	{
  	'title' : 'Harry Potter',
  	'isbn'  : '1234-1234',
  	'category' : 'Childrens',
  	'available' : '3',
  	'chapters' : [ 'Chapter 1', 'Chapter 2' ]
  	},
  	{
  	'title' : 'Brief History of time',
  	'isbn'  : '1234-ABCD',
  	'category' : 'Science',
  	'chapters' : [ '1', '2' ]
  	},
  	{
  	'title' : 'Lord of the Rings',
  	'isbn'  : '1234-PPPP',
  	'category' : 'Fiction',
  	'chapters' : [ 'Section 1', 'Section 2' ]
          }
     ],
     'categories' : [
          {'name':'Childrens', 'description':'Childrens books'},
          {'name':'Science', 'description':'Books about science'},
          {'name':'Fiction', 'description':'Fiction books'}
     ]};

__Chained Methods__

For each node selection there is a built in method named $() used to find the node. Most JPath method calls 
returns another JPath object, which is why Chained Methods can be used.

  var jp = new JPath( library);
  
  //will result in "Springfield"
  jp.$('address').$('city').json
  
  //with simple node selects this can be
  //condensed too
  jp.$('address/city').json;
  
  //will grab the "Brief History of time"
  //book object
  jp.$('books').$(1).json;
  
  //will grab all the books/category
  //properties
  jp.$$('category').json;
  
  //will grab all book objects that have
  //a property of available > 0
  jp.$('books').$(function(n){
     return( n.$('available').json );
  }).json;
  
  //this will do the same query but with
  //less code
  jp.$('books').f("$('available').json;").json;

__XPath Query__

This is a super-awesome-easy way of selecting objects within a JSON block. These are the exact
equivalent queries as performed above.

  var jp = new JPath( library);
  
  //will result in "Springfield"
  jp.query('address/city');
  
  //will grab the "Brief History of time"
  //book object
  jp.query('books[1]');
  //will grab all the books/category
  //properties
  jp.query('//category');
  
  //will grab all book objects that have
  //a property of available > 0
  jp.query('/books[available]');
  
  //a more advanced query showing how predicates can be nested//
  //this will return 'Fiction Books'
  jp.query("categories[name == /books[last()]/category ]/description");
  
