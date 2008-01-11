/*

XPath for JSON

Working Draft

/tagname = jpath.$('tagname').done()

//tagname = jpath.$$('tagname').done()

/tagname[3] = jpath.$('tagname').A(3).done()

/tag[name='b'] = jpath.$('tag', function(j){ return (j.$('name')=='b')} ).done()

var jpath = new JPath( jsonrss );

items = jpath.$('rss').$('item')._(1).json;

*/

function JPath( json, parent ){ this.json = json; this.parent = parent; };

JPath.prototype = {

    json: null,
    parent: null,

    '$': function ( str, f )
    {
        if ( this.json && this.json[str] )
        {
            return new JPath( this.json[str], this );
        }

        return JPath( null );
    },

    '_': function( idx )
    {
        if ( this.json && this.json[idx] )
        {
            return new JPath( this.json[idx], this );
        }

        return JPath( null );
    },

    root: function ()
    {
        return ( this.parent ? this.parent.root() : this );
    },

    query: function( str )
    {

    },

    f: function ( f )
    {

    }

};