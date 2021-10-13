# mongoDB_Nodejs
C:\Users\harsh\AppData\Local\Programs\mongosh\


step-1 frist need to get the mongoDB installed
		https://www.mongodb.com/try/download/enterprise 
		their go to on-premises this is place to run mongoDB locally. 
		check for CMD mongod <enter> this cmd should not run at first 
		to make it run add C:\Program Files\MongoDB\Server\4.4\bin to path
		NOTE: run npm i mongodb@<version>
		============Now MongoDB insalled ========
step-2
		connecting to mongoDB compass to show Databases virtually
		run cmd after this path  C:\Program Files\MongoDB\Server\4.4\bin>mongo.exe <enter>
		you will find mongoDB connection url copy that url 'mongodb://127.0.0.1:27017' upto host and past in DB connecting link for compass   
		connecting to: mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb
		============Now we are able to connect to compass and able to view our databases=============
step-3  app.js file code to create mongodb  

		const MongoClient = require('mongodb').MongoClient;
		const circulationRepo = require('./repos/circulationRepo');
		const data = require('./circulation.json')

		const url='mongodb://127.0.0.1:27017';
		const dbName='circulation';

		async function main() {
		const client = new MongoClient(url);
		await client.connect();

		const results = await circulationRepo.loadData(data);
		console.log(results.insertedCount, results.ops);
		console.log(results.insertedCount);
		const admin = client.db(dbName).admin();
	   //console.log(await admin.serverStatus());
		console.log(await admin.listDatabases());
	}

		main();
		
		circulationRepo.js file where main logic exist 
		const {MongoClient} = require('mongodb');

		function circulationRepo() {
			const url='mongodb://127.0.0.1:27017';
			const dbName='circulation';

			function loadData(data) {
				return new Promise(async (resolve, reject) => {
						const client = new MongoClient(url);
						try{
							await client.connect();
							const db= client.db(dbName);
							results = await db.collection('newspapers').insertMany(data);
							resolve(results);
						}catch(error) {
							reject(error)
						}
				})
			}
			return { loadData }
		}

		module.exports= circulationRepo();
