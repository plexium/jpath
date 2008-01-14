/**
Very Basic UnitTest class for js projects.
(c) Bryan English <bryan@bluelinecity.com>

usage:

var MyTest = new UnitTest({

   setUp: function(){
      this.e = new object();
   },

   testThisEqualsSomething: function(){
      this.assertEquals(true,false,'now!');
      this.assertTrue( something );
      this.assertFalse( somethingelse );
   }

});

Abort(MyTest.run());

*/
function UnitTest( obj )
{
    for ( e in obj )
    {
        this[e] = obj[e];
    }
}

UnitTest.prototype = {
   
   _: function(str){
      return str;
   },

   assertEquals: function(a,b,message){
      this.tests++;

      if ( a == b){
         return;
      } else {
         this.messages[this.messages.length] =  '  Assert Equal Failed:\n - Expected:'+ this._(a) +' ## Found:'+ this._(b) +'' + (message?' - ' +message:'' + '\n');
         this.failed = true;
         this.failures++;
      }
   },

   assertTrue: function(a,message){
      this.tests++;

      if ( a ){
         return;
      } else {
         this.messages[this.messages.length] =  '  Assert True Failed: Found ['+ this._(a) +']' + (message?' - ' + message:'');
         this.failed = true;
         this.failures++;
      }
   },

   assertFalse: function(a,message){
      this.tests++;

      if ( !a ){
         return;
      } else {
         this.messages[this.messages.length] =  '  Assert False Failed: Found ['+ this._(a) +']' + (message?' - ' + message:'');
         this.failed = true;
         this.failures++;
      }
   },   


   run: function(label){           
      this.tests = 0;
      this.failures = 0;
      this.messages = new Array();
      this.buffer = '';
      for ( var e in this ){	
         if (/^test[A-Z_]/.test(e) && typeof(this[e]) == 'function' ){
			if ( e == this.stop ) return this.buffer;
			if ( this.only && e != this.only ) continue;
            this.failed = false;
            this.messages.length = 0;

            if ( this.setUp ){
               this.setUp();
            }

            this[e]();

            if (this.failed){
               this.buffer += "---- " + e.replace(/(^test)|_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2') + ' Failed' + " ----\n\n"; 
               self = this;
               this.messages.forEach(function(m){
                  self.buffer += m + '\n';
               });
               this.buffer += "\n";
            } else if (!this.supress_success) {
               this.buffer += "---- " + e.replace(/(^test)|_/g,' ').replace(/([a-z])([A-Z])/g,'$1 $2') + ' Passed' + " ----\n"; 
            }

            if ( this.tearDown ){
               this.tearDown();
            }

         }
      }

      this.buffer = '-----===[ '+ (label?label:'UnitTest') +' ]===-----\n\n'
       + 'Success: %' + Math.round(((this.tests-this.failures)/this.tests)*100) + '  Total Asserts: ' + this.tests + '   Failures: ' + this.failures
       + '\n----------------------------------------------------------------\n' + this.buffer;

      return this.buffer;
   }
};
