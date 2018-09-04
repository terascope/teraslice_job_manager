# teraslice-cli
Command line teraslice job management helper.

The teraslice command line utility looks for the cluster name and job id in the job file to execute most commands. Registering a job with the teraslice job manager will cause the metadata to be added to the job file as `tjm: { job_id: jobid, cluster: clusterName, version: version}`.  The tjm data can then be referenced by the teraslice job manager for other functions.  This also applies to assets.  Cluster data is stored in `asset.json` as `tjm: { clusters: [ clustername1, clustername2 ] }`.


## Installation

```sh
npm install -g teraslice-cli
```

```sh
yarn global add teraslice-cli
```


## CLI Commands and Usage
For all commands that accept `-c`, if `-c` is missing default is http://localhost

### ASSET - commands to manage assets
Compresses files in `${cwd}/asset` and creates a zip file in `${cwd}/builds/processors.zip`.  Once the asset has been deployed with tjm the cluster data is stored in `${cwd}/asset/asset.json`.  The builds dir is deleted before a new processors.zip file is created on all functions that build assets.
- `tjm asset --deploy -l` *Deploys asset to localhost*
- `tjm asset --deploy -c` clusterName *Deploys assets to the cluster*
- `tjm asset --update -c` clusterName *Updates asset in the cluster(s) specified.  If no -c flag then all the clusters in the asset.json will get updated*
- `tjm asset --status` *Shows the latest asset version in the cluster(s) in asset.json*
- `tjm asset --replace -c` clusterName *Deletes and replaces an asset, this is intended to be used for asset development and not for production asset management*

### JOB - commands to manage jobs  
**REGISTER** - Registers a job to a cluster with an option to deploy assets.  Updates the jobFile.json with the cluster and job id data.  Use -a to deploy assets, -r to run immediately after registering.
- `tjm job register -c clustername jobFile.json`
- `tjm job register -c clustername -a jobFile.json`
- `tjm job register -c clustername -ar jobFile.json`

**Cluster and job id data must be in the jobsFile.json for all commands below**

**ERRORS** - Displays errors for a job.  
- `tjm job errors jobFile.json`

**PAUSE** - Pauses a job.
- `tjm job pause jobFile.json`

**RESET** - Removes tjm data from job file or asset file, just specify the relative path.
- `tjm job reset asset/asset.json`

**Restart** - Stops and restarts a job.
- `tjm job restart jobFile.json`

**RESUME** - Resumes a paused job.
- `tjm job resume jobFile.json`

**START (RUN)** - Starts a job. Run is an alias for start, run and start can be used interchangeably.  Start will automatically register and start a new job, just remember to specify the cluster with `-c`.  Start can also be used to move a job to a new cluster with `-m`, this does not move the asset only the job file.
- `tjm job start jobFile.json`
- `tjm job run jobFile.json`
- `tjm job start jobFile -c clustername` *register and run a new job, same as tjm register -r jobfile -c clustername*
- `tjm job run -m jobFile -c clusterName` *runs a job on a new cluster, replaces the old tjm data in the jobFile*


**STATUS** - Reports the status of a job.
- `tjm job status jobFile.json`

**STOP** - Stops a job.
- `tjm job stop jobFile.json`

**UPDATE** - Updates a job.
- `tjm job update jobFile.json`

**VIEW** - Displays job file as it is saved on the cluster.
- `tjm job view jobFile.json`

**WORKERS** - Adds to or removes workers from a job.
- `tjm job workers add 10 jobFile.json`
- `tjm job workers remove 5 jobFile.json`
