
var docloud = require('docloud-api');
var program = require('commander');
var fs = require('fs');

/**
 * Reads the config file
 * @returns the config object
 */
function readConfig(){
		var config={};
		if (process.env.HOME) {
			var configFile = process.env.HOME+"/.docloud";	
			if (fs.existsSync(configFile)) {				
				  config = JSON.parse(fs.readFileSync(process.env.HOME+"/.docloud"));				
			}
		}
		return config;
}

/**
 * Writes the config file
 * @param config the config
 */
function writeConfig(config){
   var content = JSON.stringify(config,undefined,2);
   fs.writeFileSync(process.env.HOME+"/.docloud",content);
}

/**
 * Returns the DOcloud client connected to the selected config 
 * @returns the client
 */
function connect(){
	try {
		var configs = readConfig();
	    var cname = program.configuration || 'default';
	    var config = configs[cname];
	   
		var client = docloud({
			  url : program.baseurl || config.baseurl,
			  clientId : program.clientid || config.clientid
			});
		if (!client.url){
			console.log("Base URL not defined");
			process.exit(1);
		}
		if (!client.clientId){
			console.log("Client id not defined");
			process.exit(1);
		}
		if (program.verbose)
			console.log("Using config %s with DOcloud URL %s",cname, client.url);
		return client;
		
	} catch (e) {
		console.log(e);
		process.exit(1);
	}
}


program	
 .option('-c, --clientid <clientid>', 'set or override the API key (client id)')
 .option('-u, --baseurl <baseurl>', 'set or override the base URL of DOcloud')
 .option('-g, --configuration <name>', 'select the configuration to use')
 .option('-v, --verbose', 'activate verbose mode')
 

 // config
program.command('config [name]')
	.description('save configuration defaults in ~/.docloud')
	.action (function(name,options){	
		var configs = readConfig();
		var cname = name || 'default';
		configs[cname]= {};
		configs[cname].clientid = program.clientid;
		configs[cname].baseurl = program.baseurl;
		writeConfig(configs);
	});

function collect(val, memo) {
	 if (val) {
	    var p = val.split("=");
	    memo[p[0]]=p[1];
      }
	  return memo;
	}

 // submit
program.command('execute <dir>')
    .alias('exec')
	.description('execute a job by submitting files from a directory')
	.option('-l, --log', 'stream log to stdout as the job is running')
	.option('-p, --param [param]', 'add a prameter', collect,{})
	.action (function(dir,options){

		var files = fs.readdirSync(dir);
		var data = {};
		data.attachments = files.filter(function (f){
			if (f=='solution.json' || f=='solution.xml') return false;
			var index = f.lastIndexOf('.');
			if (index<0) return false;
			var ext = f.substring(index+1);
			var accepted = ["lp", "prm", "sav", "mps", "mod", "dat", "json", "ops","oplproject"]
			return accepted.indexOf(ext)>=0;
		}).map(function(f){
			var att = {};
			att.name = f;
			att.stream = fs.createReadStream(dir+"/"+f);
			return att;
		})
		if (options.log) {
		   data.logstream = process.stdout;	
		}
		data.parameters = options.param;
		var client = connect();	
		client.execute(data)	   
		   .on('processed', function(jobid){
			   client.downloadAttachment(jobid,'solution.json',fs.createWriteStream(dir+'/solution.json'))
			         .then(function () {return client.downloadLog(jobid,fs.createWriteStream(dir+'/solution.log'))})
			         .catch(function (error) {process.exit(1)})	 
		   })
		   .on('interrupted', function(jobid){console.log("Interrupted")})
		   .on('failed', function(jobid){console.log("Failed")})
		   .on('error', function(error){process.exit(1)})
			 
	});


function pad(s,l){
	for (var i=s.length; i<l; i++){
		s+=' ';
	}
	return s;
}
function padLeft(s,l){
	var p='';
	for (var i=s.length; i<l; i++){
		p+=' ';
	}
	return p+s;
}
// jobs
program.command('jobs [options...]')
	.description('list the jobs')
	.option('-j, --json', 'returns raw JSON list')
	.action (function(env,options){
		var client = connect();	
		client.listJobs()
		  .then(function (list){	
			 if (options.json) {
				console.log(list);
			 } else {
				list.forEach(function(job){
					console.log("%s %s %s %s %s",
							pad(job._id,40),
							pad(new Date(job.createdAt).toLocaleDateString(),10),
							pad(new Date(job.createdAt).toLocaleTimeString(),15),
							pad(job.executionStatus,15), 
							pad(job.solveStatus?job.solveStatus:"-",35)				
							);
				})
				}			
		  	 })
		   .catch(function (error) {process.exit(1)})	 
		  
	});
		
//list attachments
program.command('attachments <jobid>')
	.description('list the job attachments')
	.alias("atts")
	.option('-j, --json', 'returns raw JSON list')
	.action (function(jobid,options){
		var client = connect();	
		client.getJob(jobid)
		  .then(function (job){	
			 if (options.json) {
				console.log(job.attachments);
			 } else {
				job.attachments.forEach(function(att){
					console.log("%s %s %s",
							padLeft(''+att.length,15),
							pad(att.type,18),
							att.name
							);
				})
				}			
		  	 })
		   .catch(function (error) {console.log(error);process.exit(1)})	 		  
	});

//download
program.command('download <jobid> <attid>')
	.description('download a job attachment to stdout')
	.action (function(jobid,attid){
		var client = connect();	
		client.downloadAttachment(jobid,attid,process.stdout) 
		 .catch(function (error) {console.log(error);process.exit(1)})
	});

//upload
//program.command('upload <jobid> <attid>')
//	.description('upload a job attachment from stdin')
//	.action (function(jobid,attid){
//		var client = connect();	
//		client.uploadAttachment(jobid,attid,process.stdin) 
//		 .catch(function (error) {console.log(error);process.exit(1)})
//	});

//download
program.command('log <jobid> ')
	.description('download a job log to stdout')
	.action (function(jobid){
		var client = connect();	
		client.downloadLog(jobid,process.stdout) 
		 .catch(function (error) {console.log(error);process.exit(1)})
	});
//delete
program.command('get <jobid>')
	.description('get a job')
	.option('-j, --json', 'returns raw JSON object')
	.action (function(jobid,options){
		var client = connect();
		client.getJob(jobid).then(function(job){
			if (options.json){
				console.log(job);
			} else {
				console.log("%s %s %s %s %s",
						pad(job._id,40),
						pad(new Date(job.createdAt).toLocaleDateString(),10),
						pad(new Date(job.createdAt).toLocaleTimeString(),15),
						pad(job.executionStatus,15), 
						pad(job.solveStatus?job.solveStatus:"-",35)				
						);
		    }
		})
		.catch(function (error) {process.exit(1)})	
	});

// delete
program.command('delete <jobid>')
    .alias('del')
	.description('delete a job')
	.action (function(jobid,options){
		var client = connect();
		client.deleteJob(jobid)
		.catch(function (error) {process.exit(1)});
	});

// abort
program.command('abort <jobid>')
	.description('abort a job')
	.option('-k, --kill', 'kill a job')
	.action (function(jobid,options){
		var client = connect();
		client.abortJob(jobid,options.kill)
		.catch(function (error) {process.exit(1)});
	});

//delete-all
program.command('delete-all')
	.description('delete all jobs')
	.action (function(env,options){
		var client = connect();
		client.deleteJobs()
		.catch(function (error) {process.exit(1)})	
	});

program.parse(process.argv);
