

var TEST_FOLDER = './tests/';


var _ = require('underscore');

var _autotester = function (){
    this.tests = new Array();   // tests to run
    this.testAnswers = new Array(); // expected answers of test
    this.passed = new Array();
    this.testIds = new Array();
    this.numberTests = 0;
    this.options = require ('./config/options.js');
}


_autotester.prototype.runtests = function (){
    var length = this.tests.length;
    var passed = 0;
    
    // test every test case
    for (var i = 0 ; i < length; i++){

        var response = this.tests[i]();
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
    this.passed.push(null);
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
//var ts = require('./tests/testsuite1.js');
for (var i = 0;i < suites.length; i++){
   // console.log(ts[i].id);
   tester.addTestSuite(require (TEST_FOLDER+ suites[i] ) );
//tester.addTestSuite(ts);
}
if (tester.options.AUTOTESTER_VERBOSE){
    console.log( "Passed :  " +tester.runtests()*100 +" %" )  ;
}
//}

module.exports = _autotester;
