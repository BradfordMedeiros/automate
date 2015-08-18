// Autotesting code. 
// Import test suites from root/tests
// To add new testsuite, just create an add file in test folder.  Will be added automatically.
// * Tests are partially sandboxes.  Require is nuked between tests, so modifying data resolved from require should be returned to previous state.
// * However, modifying other globals will screw this up.  Don't depend on that too much then, except for adding listeners.
// Would be great to add a real sandbox testing module here. 


var TEST_FOLDER = './tests/';
var _ = require('underscore');




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

        // deletes the cache in require. This partially sandboxes the tests.
        _.each(_.keys(require.cache), function (key) {
            delete require.cache[key];
        })

          var response  = this.tests[i]()

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
var suites = fs.readdirSync(TEST_FOLDER);

for (var i = 0;i < suites.length; i++){
   tester.addTestSuite(require (TEST_FOLDER+ suites[i] ) );

}

var percentPassed = tester.runtests() *100;
if (tester.options.AUTOTESTER_VERBOSE){
    console.log( "Passed :  " +percentPassed  +" %" )  ;
}


///////////////////////////////////////////
module.exports = _autotester;

