/*

XPath for JSON

Working Draft

/tagname = jpath.$('tagname').done()

//tagname = jpath.$$('tagname').done()

/tagname[3] = jpath.$('tagname').A(3).done()

/tag[name='b'] = jpath.$('tag', function(j){ return (j.$('name')=='b')} ).done()

var jpath = new JPath( jsonrss );

items = jpath.$('rss').$('item')._(1).json;

currently supports

/tagname
tagname
* wildcard
[] predicates
equality
math
array selection

Expression  	
nodename 	   
/ 	            
// 	         
. 	            
.. 	         
*
nodename[0]
nodename[last()]
nodename[position()]
nodename[last()-1]
nodename[somenode > 3]/node

*/

/*
   JPath 1.0 - json equivalent to xpath
   Copyright (C) 2007  Bryan English <bryan at bluelinecity dot com>

   This program is free software; you can redistribute it and/or
   modify it under the terms of the GNU General Public License
   as published by the Free Software Foundation; either version 2
   of the License, or (at your option) any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.

   You should have received a copy of the GNU General Public License
   along with this program; if not, write to the Free Software
   Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

   Usage:
      
      var jpath = new JPath( myjsonobj );

      var somevalue = jpath.$('book/title').json;
         //or
      var somevalue = jpath.query('book/title');
     
*/
function JPath( json, parent ){ this.json = json; this._parent = parent; }

JPath.prototype = {

   /*
      Property: json
      Copy of current json segment to operate on
   */
   json: null,
   
   /*
      Property: parent
      Parent json object, null if root.
   */
   parent: null,

   '$': function ( str )
   {
      if ( this.json )
      {       
         if ( typeof(str) == 'string' && str.indexOf('/') != -1)
         {
            var strs = str.split('/');
            var self = this;
            for ( var i =0; i < strs.length; i++ )
            {
               self = self.$(strs[i]);
            }

            return self;
         }
         else if ( typeof(str) == 'string' && ( this.json instanceof Array || str == '*' ))
         {   
            var a = new Array();
            for ( i in this.json )
            {
               if ( typeof(this.json[i]) != 'function' )
               {                   
                  if ( str == '*' )
                  {
                     for ( j in this.json[i] )
                     {
                        if ( typeof(this.json[i][j]) != 'function' )
                        {
                           a.push( this.json[i][j] );
                        }
                     }
                  }
                  else
                  {
                     if ( this.json[i][str] )
                     {
                        a.push( this.json[i][str] );
                     }
                  }
               }
            }

            return new JPath( a, this );
         }
         else if ( typeof(str) == 'function' )
         {
            return this.f(str);
         }
         else
         {
            return new JPath( this.json[str], this );
         }
      }

      return new JPath( null, this );
   },

   root: function ()
   {
      return ( this._parent ? this._parent.root() : this );
   },

   query: function( str )
   {
      var re = {
         "([\\*\\@\\.a-z][a-z0-9]*)(?=(?:\\s|$|\\[|\\]|\\/))" : "\$('$1').",
         "\\[([0-9])+\\]" : "\$($1).",
         "(^|\\[|\\s)\\/" : "$1root().",
         "\\/" : '',
         "\\[" : "$(function(j){ with(j){return(",
         "\\]" : ");}}).",
         "\\(\\.":'(',
         "(\\.)(?!\\$)":"$1json"
      };

      //save quoted strings//
      var quotes = /(\'|\")([^\1]*)\1/;
      var saves = new Array();
      while ( quotes.test(str) )
      {
         saves.push( str.match(quotes)[2] ); 
         str = str.replace(quotes,'%'+ (saves.length-1) +'%');
      }

      for ( e in re )
      {
         str = str.replace( new RegExp(e,'ig'), re[e] );
      }

      return eval('this.' + str.replace(/\%(\d+)\%/g,'saves[$1]') + ";");
   },

   f: function ( f )
   {
      var a = new Array();

      if ( typeof(f) == 'string' )
      {
         f = eval('function(j){with(j){return('+f+');}}');
      }

      for ( p in this.json )
      {
         var j = new JPath(this.json[p], this);
         j.index = p;
         if ( f( j ) )
         {
            a.push( this.json[p] );
         }
      }

      return new JPath( a, this );
   },

   parent: function()
   {
      return ( (this._parent) ? this._parent : this );
   },

   position: function()
   {
      return this.index;
   },

   last: function()
   {
      return (this.index == (this._parent.json.length-1));
   },

};