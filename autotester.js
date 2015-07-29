

var TEST_FOLDER = './tests/';


var _ = require('underscore');
var deepcopy = require('deepcopy');

// this might be a mistake.
// I am overriding the require function to make it actually return 
// a deep copy of the data as opposed to a reference to it.
// This should limit dependencies between data.  It can be turned on or off
// on a case by case basis specified by <test>.globalRequire = <true/false>
// default functionality is true



var _autotester = function (){
    this.tests = new Array();   // tests to run
    this.testAnswers = new Array(); // expected answers of test
    this.passed = new Array();
    this.testIds = new Array();
    this.localRequires = new Array();

    this.numberTests = 0;
    this.originalRequire = require;
    this.options = require ('./config/options.js');

   
  


}






_autotester.prototype.runtests = function (){
    var length = this.tests.length;
    var passed = 0;
    
    // test every test case
    for (var i = 0 ; i < length; i++){

        var response;
      
        //console.log(this.tests[i].rerouteRequire);
      //  this.tests[i].rerouteRequire();

       // this.rerouteRequire ( this.tests[i] );
 
            response = this.tests[i]()

        try{

        }catch(error){
            response = "failure";
        }
        if ( _.isEqual (response, this.testAnswers[i]) ){
            //console.log("TEST ID ("+this.testIds[i]+") |" +"passed");
            
            if (this.options.AUTOTESTER_VERBOSE){
                console.log("["+i+"]. PASSED : "+this.testIds[i] )  ;
            }
            
            this.passed[i] = true;
            passed++;
        }else{
        
            if (this.options.AUTOTESTER_VERBOSE){
                console.log("["+i+"]. FAILED : "+this.testIds[i]+")\n\texpected:  "+JSON.stringify(this.testAnswers[i])+" \n\t  actual:  "+JSON.stringify(response) + "");
            }

            this.passed[i] = false;
        }

    }
    return (passed/this.numberTests);
}


_autotester.prototype.addTest = function ( test ){
    this.tests.push(test.func);
    this.testAnswers.push(test.answer);
    this.testIds.push(test.id);
    this.numberTests ++;
}

_autotester.prototype.addTestSuite = function ( testsuite ){
    for ( var i = 0; i < testsuite.length; i++){
        this.addTest (testsuite[i]);
    }
}



/////////////////////////// main code
var tester = new _autotester();


var fs = require('fs');
console.log("----------");
var suites = fs.readdirSync(TEST_FOLDER);

for (var i = 0;i < suites.length; i++){
   tester.addTestSuite(require (TEST_FOLDER+ suites[i] ) );

}

var percentPassed = tester.runtests() *100;
if (tester.options.AUTOTESTER_VERBOSE){
    console.log( "Passed :  " +percentPassed  +" %" )  ;
}
//}

module.exports = _autotester;
