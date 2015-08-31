
var AWS = require('aws-sdk'),
    path = require('path');

module.exports = function(gulp) {

  require('aws-lambda-gulp-tasks')(gulp);

  /**
   * SWF tasks
   */
  gulp.task('register', function (cb) {
    var swf = new AWS.SWF({region: process.env.AWS_REGION || 'us-east-1'});
    swf.registerWorkflowType(require( path.join(process.cwd(), "swf-config.js") ).register, function (err, results) {
      if (err) {
        if(err.code === 'TypeAlreadyExistsFault') { console.log('Workflow already registered on SWF'); }
        else { console.log("err: ", err); }
      }
      else { console.log("register workflowtype results: ", results); }
      cb();
    });
  });

  gulp.task('start', function (cb) {
    var swf = new AWS.SWF({region: process.env.AWS_REGION || 'us-east-1'});
    swf.startWorkflowExecution( require( path.join(process.cwd(), "swf-config.js") ).start, function (err, results) {
      if (err) { console.log("err: ", err); }
      else { console.log("workflow started: ", results); }
      cb();
    });
  });

};
