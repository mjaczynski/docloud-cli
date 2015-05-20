# Notice


[IBM Decision Optimization on Cloud](http://www.ibm.com/software/analytics/docloud/) or DOcloud for short is a service that lets you solve CPLEX and OPL problems on the Cloud. You can access the interactive service called DropSolve or you can use use the API to integrate the service into your application. Here is a quick [introduction](http://www.mycloudtips.com/2015/04/docloud.html) with useful links. This module provides a simple command line client to submit and monitor your jobs. It is also good example of what you can do with the Node.js DOcloud [client](https://www.npmjs.com/package/docloud-api). 


Installation
------------
After installing [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm), you can install the command line client as a global module. During installation, npm will make sure that the command line tool 'docloud' is accessible as an executable.

```
npm install docloud-cli -g
```

Example
-------
First create a configuration named 'beta' using the DOcloud URL and your API key that you can get from your [account](https://developer.ibm.com/docloud/docs/api-key/).

```
> docloud config beta -u docloud_url  -c api_key
```

Then create a directory 'warehouse' and unpack the sample [files](http://www.ibm.com/software/analytics/docloud/resources/demo/zip/Warehouse-location-demo.zip). You can submit a job by using the following simple command.

```
> docloud -g beta execute warehouse -v
Using config beta with DOcloud URL https://...
18 May 21:34:44 - Job job.500394427.1432010087482.38 created
18 May 21:34:44 - Starting upload of '.oplproject' of job job.500394427.1432010087482.38
18 May 21:34:45 - Attachment '.oplproject' of job job.500394427.1432010087482.38 uploaded in 793 ms
18 May 21:34:45 - Starting upload of 'warehouse_cloud.dat' of job job.500394427.1432010087482.38
18 May 21:34:45 - Attachment 'warehouse_cloud.dat' of job job.500394427.1432010087482.38 uploaded in 563 ms
18 May 21:34:45 - Starting upload of 'warehouse_cloud.mod' of job job.500394427.1432010087482.38
18 May 21:34:46 - Attachment 'warehouse_cloud.mod' of job job.500394427.1432010087482.38 uploaded in 560 ms
18 May 21:34:46 - Starting upload of 'warehouse_data.mod' of job job.500394427.1432010087482.38
18 May 21:34:47 - Attachment 'warehouse_data.mod' of job job.500394427.1432010087482.38 uploaded in 656 ms
18 May 21:34:47 - Job job.500394427.1432010087482.38 submitted
18 May 21:34:47 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:48 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:48 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:48 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:48 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:49 - Job job.500394427.1432010087482.38 is RUNNING
18 May 21:34:49 - Job job.500394427.1432010087482.38 is PROCESSED
18 May 21:34:50 - Attachment 'solution.json' of job job.500394427.1432010087482.38 downloaded in 390 ms
18 May 21:34:50 - Log of job job.500394427.1432010087482.38 downloaded in 313 ms
```

If you want to see the live log being streamed while the job is running, you can use the -l option:
```
> docloud -g beta execute warehouse -v -l
```

You can get the list of jobs using the command:
```
> docloud -g beta jobs
job.500394427.1432049497173.34           5/19/2015  8:31:37 AM      PROCESSED       OPTIMAL_SOLUTION
job.500394427.1432049446147.8            5/19/2015  8:30:46 AM      PROCESSED       OPTIMAL_SOLUTION
job.500394427.1432010087482.38           5/18/2015  9:34:47 PM      PROCESSED       OPTIMAL_SOLUTION
```

Note that the trial subscription has a limit of 3 jobs and you will quickly get this error.
```
Unexpected response code 403 on POST /jobs, reason : Subscription [...] of user api_... has a limit of 3 jobs total
```

You just need to remember to delete your jobs when done either one by one or all at once:
```
> docloud -g beta delete job.500394427.1432010087482.38
> docloud -g beta delete-all
```

Usage
-------

You will get the latest help with these commands:
```
> docloud --help
> docloud command --help
```

Here are the current global commands and options:
```
  Usage: docloud [options] [command]

  Commands:

    config [name]                       save configuration defaults in ~/.docloud
    execute|exec [options] <dir>        execute a job by submitting files from a directory
    jobs [options] [options...]         list the jobs
    attachments|atts [options] <jobid>  list the job attachments
    download <jobid> <attid>            download a job attachment to stdout
    log <jobid>                         download a job log to stdout
    get [options] <jobid>               get a job
    delete|del <jobid>                  delete a job
    abort [options] <jobid>             abort a job
    delete-all                          delete all jobs

  Options:

    -h, --help                  output usage information
    -c, --clientid <clientid>   set or override the API key (client id)
    -u, --baseurl <baseurl>     set or override the base URL of DOcloud
    -g, --configuration <name>  select the configuration to use
    -v, --verbose               activate verbose mode
```


Status
------
Under development, module API can change without notice.








