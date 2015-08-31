# swf-lambda-decider-gulp-tasks

Gulp tasks to deploy SWF deciders on AWS lambda (for https://github.com/neyric/swf-lambda-decider)

## Usage

    npm install gulp --save-dev
    npm install run-sequence --save-dev
    npm install swf-lambda-decider-gulp-tasks --save-dev
    npm install node-uuid --save-dev

gulpfile.js :
````js
var gulp = require('gulp');
var runSequence = require('run-sequence');

require('swf-lambda-decider-gulp-tasks')(gulp);

gulp.task('deploy', function(callback) {
  return runSequence(
    ['clean'],
    ['js', 'node-mods'],
    // ADD ANY FILE YOU WANT TO THE dist/ folder
    ['zip'],
    ['upload'],
    ['register'],
    callback
  );
});
````

lambda-config.js :
````js
module.exports = {
  accessKeyId: <access key id>,  // optional
  secretAccessKey: <secret access key>,  // optional
  profile: <shared credentials profile name>, // optional for loading AWS credentials from custom profile
  region: 'us-east-1',
  handler: 'index.handler',
  role: <role arn>,
  functionName: <function name>,
  timeout: 10,
  memorySize: 128,
  eventSource: {
    EventSourceArn: <event source such as kinesis ARN>,
    BatchSize: 200,
    StartingPosition: "TRIM_HORIZON"
  }
}
````

swf-config.js
````js
var uuid = require('node-uuid');

module.exports = {

  register: {
    domain: 'mydomain',
    name: 'my-workflow-name',
    version: '1.0'
  },

  // Default start options
  start: {
    domain: 'mydomain',
    workflowId: uuid.v4(),
    workflowType: {
      name: 'my-workflow-name',
      version: '1.0'
    },
    childPolicy: 'TERMINATE', /*'TERMINATE | REQUEST_CANCEL | ABANDON',*/
    executionStartToCloseTimeout: 'NONE',
    input: JSON.stringify({key: 'value'}),
    /* Important: if you run lambdas, you should specify the role they should run */
    lambdaRole: 'arn:aws:iam::1234567899:role/swf-lambda',
    tagList: [
      'STRING_VALUE',
      /* more items */
    ],
    taskList: {
      name: 'mytasklist'
    },
    /*taskPriority: 'STRING_VALUE',*/
    taskStartToCloseTimeout: '60'
  }

};
````

In your repository :

    $ gulp deploy


## Gulp tasks

 * register: register workflow
 * start: start the workflow

Plus, from aws-lambda-gulp-tasks :
 * clean
 * js
 * node-mods
 * zip
 * upload


 * deploy is given in the example below (but customizable)





# License

(The MIT License)

Copyright (c) 2015 Eric Abouaf

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
