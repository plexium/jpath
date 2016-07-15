# jpath

_XPath for JSON_

JPath is a simple lightweight Javascript Class which provides an XPath-like querying ability to JSON objects.

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
  

## API Documentation

_(JPath) new JPath( object json [, JPath parent ] );_

> Creates a new JPath object embedded with the passed json object. The second parameter is used by internal functions to create an 
> object trail when chaining the methods.

_(object) JPath.json_

> This property holds the current json object we want to traverse.

_(JPath) JPath.$( mixed name );_

> Main query method. This method can accept a string, number or function. Based on what is passed determines what action is taken.

> String – Will look at the current json property for a property named name or, in the case the current object is an array, 
> through an array of objects for all properties named name as a new JPath object.

> Number – Will look at the current json property as an array and return the element found at name as a new JPath object.

> Function – Will use the function as an iterator to use on every property found within the json object. 
> The function must accept one parameter — a json object wrapped in a JPath object. The iterator must return 
> a boolean true/false determining if the property in particular should be returned in the nodeset. As always, 
> the result will be an array wrapped in a new JPath object.

_(JPath) JPath.$$( mixed name );_

> Global query method. This method can accept a string, number or function. Based on what is passed determines what action is taken.

> String – Will recursivly look at the current json property for a property named name or, in the case the current object
> is an array, through an array of objects for all properties named name as a new JPath object.

> Number – Will recursivly look at the current json property as an array and return the element found at name as a new JPath object.

> Function – Will recursivly use the function as an iterator to use on every property found within the json object. 
> The function must accept one parameter — a json object wrapped in a JPath object. The iterator must return a boolean 
> true/false determining if the property in particular should be returned in the nodeset. As always, the result will 
> be an array wrapped in a new JPath object.

_(JPath) JPath.f( mixed iterator );_

> This is an alternative way to use a function to select json nodes.

> As a shortcut, this function will accept a string and treat it as the guts of an iterator.

> Example:

        f("position() > 1 && $('name').json != null")
        will become
        
        function(j){
           with(j){
              return( position() > 1 && $('name').json != null )
           }
        }

_(mixed) JPath.query( string path );_

> Perform an XPath like query. Currently supported XPath commands…

        /tagname
        //tagname
        tagname
        * wildcard
        [] predicates
        operators ( >=, ==, <= )
        array selection
        ..
        *
        and, or
        nodename[0]
        nodename[last()]
        nodename[position()]
        nodename[last()-1]
        nodename[somenode > 3]/node
        nodename[count() > 3]/node
        (JPath) JPath.root();

> Returns a root JPath object, equivalent to “/” in XPath.

_(JPath) JPath.parent();_

> Returns the parent json object wrapped in JPath. Equivalent to “..” in XPath.

_(boolean) JPath.last();_

> Only available within a function iterator or the “[]” predicate, returns true if the currently processing node is the last.

_(number) JPath.position();_

> Only available within a function iterator or the “[]” predicate, returns the index of the currently processing node.

_(number) JPath.count( nodename );_

> Only available within a function iterator or the “[]” predicate, returns the number of the nodes named nodename.

_(Array) JPath.findAllByRegExp( RegExp re, object obj )_

> Utility function for searching through an object using a regular expression. For internal use.
