'use strict';

exports.command = 'stop <jobFile>';
exports.desc = 'stops job on the cluster in the job file\n';
exports.builder = (yargs) => {
    yargs.example('tjm stop jobfile.prod.json');
};
exports.handler = (argv) => {
    const reply = require('./cmd_functions/reply')();
    const jsonData = require('./cmd_functions/json_data_functions')();
    const jobContents = jsonData.jobFileHandler(argv.jobFile)[1];
    jsonData.metaDataCheck(jobContents);
    const tjmFunctions = require('./cmd_functions/functions')(argv, jobContents.tjm.cluster);
    const jobId = jobContents.tjm.job_id;

    tjmFunctions.alreadyRegisteredCheck(jobContents)
        .then(() => tjmFunctions.teraslice.jobs.wrap(jobId).stop())
        .then((result) => {
            if (result.status.status === 'stopped') {
                reply.success(`Stopped job ${jobId} on ${jobContents.tjm.cluster}`);
                return Promise.resolve();
            }
            return Promise.reject(new Error('Job could not be stopped'));
        })
        .catch(err => reply.fatal(err));
};
