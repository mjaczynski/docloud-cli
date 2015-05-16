# Notice


[IBM Decision Optimization on Cloud](http://www.ibm.com/software/analytics/docloud/) or DOcloud for short is a service that lets you solve CPLEX and OPL problems on the Cloud. You can access the interactive service called DropSolve or you can use use the API to integrate the service into your application. Here is a quick [introduction](http://www.mycloudtips.com/2015/04/docloud.html) with useful links. 


Installation
------------

```
npm install docloud-cli -g
```

Usage
-------

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








