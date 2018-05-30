'use strict';

exports.command = 'resume <jobFile>';
exports.desc = 'resumes a paused job\n';
exports.builder = (yargs) => {
    yargs.example('tjm resume jobfile.prod');
};
exports.handler = (argv) => {
    const reply = require('./cmd_functions/reply')();
    const jsonData = require('./cmd_functions/json_data_functions')(argv.jobFile);
    const jobContents = jsonData.jobFileHandler()[1];
    jsonData.metaDataCheck(jobContents);
    const tjmFunctions = require('./cmd_functions/functions')(argv, jobContents.tjm.cluster);
    const jobId = jobContents.tjm.job_id;
    const cluster = jobContents.tjm.cluster;

    tjmFunctions.alreadyRegisteredCheck(jobContents)
        .then(() => tjmFunctions.teraslice.jobs.wrap(jobId).status())
        .then((status) => {
            if (status !== 'paused' && status !== 'stopped') {
                reply.fatal(`Job ${jobId} is not paused on ${cluster}, but is ${status}.  Use start to start job`);
            }
            return Promise.resolve(true);
        })
        .then(() => tjmFunctions.teraslice.jobs.wrap(jobId).resume())
        .then((result) => {
            if (result.status.status === 'running') {
                reply.success(`Resumed job ${jobId} on ${cluster}`);
            } else {
                reply.fatal('Could not resume job');
            }
        })
        .catch(err => reply.fatal(err.message));
};
