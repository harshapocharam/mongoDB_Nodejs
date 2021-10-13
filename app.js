const MongoClient = require('mongodb').MongoClient;
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json')
const asset = require("assert");

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);
    await client.connect();

    try {

        const results = await circulationRepo.loadData(data);
        asset.equal(data.length, results.insertedCount);
        // console.log(results.insertedCount);

        const getData = await circulationRepo.get();
        asset.equal(data.length, getData.length);

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        asset.deepEqual(filterData[0], getData[4]);

        const limitData = await circulationRepo.get({}, 3);
        asset.deepEqual(limitData.length, 3);

        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(id);
        asset.deepEqual(byId, getData[4]);

        const newItem = {
            "Newspaper": "my Paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 1,
            "Change in Daily Circulation, 2004-2013": -34,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        }
        const addedItem = await circulationRepo.add(newItem)
        asset(addedItem._id)
        const addedItemQuery = await circulationRepo.getById(addedItem._id);
        asset.deepEqual(addedItemQuery, newItem)

        const updateItem = await circulationRepo.update(addedItem._id, {
            "Newspaper": "my new Paper",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 1,
            "Change in Daily Circulation, 2004-2013": -34,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 0,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 0,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        });
        const newAddedItemQuery = await circulationRepo.getById(addedItem._id);
        asset.equal(newAddedItemQuery.Newspaper, "my new Paper")

        const removed = await circulationRepo.remove(addedItem._id);
        asset(removed);

        const deletedIteam = await circulationRepo.getById(addedItem._id);
        asset.equal(deletedIteam, null);

    } catch (error) {
        console.log(error);
    } finally {

        const admin = client.db(dbName).admin();

        //console.log(await admin.serverStatus());

        await client.db(dbName).dropDatabase();
        console.log(await admin.listDatabases());
        client.close();

    }

}

main();