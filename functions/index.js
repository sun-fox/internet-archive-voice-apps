'use strict';

const platform = 'assistant';

const patch = require('./src/utils/logger/patch-debug-scope');
patch(platform);

// put on the top to estimate performance of "start"
const pipeline = require('./src/performance/pipeline');
pipeline.stage(pipeline.START);

const actions = require('./src/actions');
const assistantHandler = require('./src/platform/assistant/handler');
const setup = require('./src/setup');
const dialogsScheme = require('./src/strings').intents;
const logAppStart = require('./src/utils/logger/log-app-start');

const actionsMap = {
  ...actions.fromJSON(dialogsScheme),
  ...actions.fromFiles()
};

logAppStart({ platform, actionsMap });

setup({ platform });

/**
 * Action of Google Endpoint
 *
 * @type {HttpsFunction}
 */
exports.assistant = assistantHandler(actionsMap);

// end of "start" phase of pipeline, now we are waiting for request
pipeline.stage(pipeline.IDLE);
