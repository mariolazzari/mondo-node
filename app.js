const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const client = new MongoClient(URI);

const db_name = "bank";
const collection_name = "accounts";
const accountsCollection = client.db(db_name).collection(collection_name);

const connectDB = async () => {
  try {
    await client.connect(URI);
    console.log("Mongo connected");
  } catch (error) {
    console.log("Mongo connection error:", error);
  }
};

const sampleAccount = {
  account_holder: "Mario Lazzari",
  account_id: "mvl001",
  account_type: "checking",
  balance: 123456,
  last_update: new Date(),
};

const sampleAccounts = [
  {
    account_holder: "Maria Lazzari",
    account_id: "mvl002",
    account_type: "checking",
    balance: 321654,
    last_update: new Date(),
  },
  {
    account_holder: "Mariarosa Sbardellati",
    account_id: "mvl003",
    account_type: "checking",
    balance: 456123,
    last_update: new Date(),
  },
];

const accountFilter = { balance: { $gt: 4700 } };

const main = async () => {
  try {
    await connectDB();
    let res = await accountsCollection.insertOne(sampleAccount);
    console.log("Inserted row:", res.insertedId);

    res = await accountsCollection.insertMany(sampleAccounts);
    console.log("Inserted rows:", res.insertedCount);

    res = await accountsCollection.findOne(accountFilter);
    console.log("Document found:", res);

    res = await accountsCollection.find(accountFilter);
    console.log("Documents found:", res.count);
  } catch (error) {
    console.log("Main error:", error);
  } finally {
    await client.close();
    console.log("Mongo closed");
  }
};

main();
