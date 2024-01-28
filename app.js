const { MongoClient, ObjectId } = require("mongodb");

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

const docUpdate = { _id: new ObjectId("65b657dcd030fe156496eb8a") };
const update = {
  $inc: {
    balance: 100,
  },
};

const docsUpdate = { account_type: "checking" };
const updateMany = {
  $push: {
    transfers_completed: "ok",
  },
};

const docsDel = {
  balance: {
    $lte: 123456,
  },
};

const pipeline = [
  {
    $match: {
      balance: {
        $gt: 1000,
      },
    },
  },
  {
    $group: {
      _id: "$account_type",
      total_balance: {
        $sum: "$balance",
      },
      avg_balance: {
        $avg: "$balance",
      },
    },
  },
];

const pipeline2 = [
  { $match: { account_type: "checking", balance: { $gte: 100 } } },
  { $sort: { balance: -1 } },
  {
    $project: {
      _id: 0,
      account_id: 1,
      account_type: 1,
      balance: 1,
      gcp_balance: { $divide: ["$balance", 1.3] },
    },
  },
];

const main = async () => {
  try {
    await connectDB();
    let res = await accountsCollection.insertOne(sampleAccount);
    console.log("Inserted row:", res.insertedId);

    res = await accountsCollection.insertMany(sampleAccounts);
    console.log("Inserted rows:", res.insertedCount);

    res = await accountsCollection.findOne(accountFilter);
    console.log("Document found:", res);

    // res = await accountsCollection.find(accountFilter);
    // console.log("Documents found:", res);

    res = await accountsCollection.updateOne(docUpdate, update);
    res.modifiedCount === 1
      ? console.log("Document updated")
      : console.log("Error updating document");

    res = await accountsCollection.updateMany(docsUpdate, updateMany);
    res.modifiedCount > 0
      ? console.log("Documents updated")
      : console.log("Error updating documents");

    res = await accountsCollection.deleteOne(docsDel);
    console.log("Deleted docs:", res.deletedCount);

    res = await accountsCollection.deleteMany(docsDel);
    console.log("Deleted docs:", res.deletedCount);

    res = accountsCollection.aggregate(pipeline);
    for await (const doc of res) {
      console.log("Pipeline:", doc);
    }

    res = accountsCollection.aggregate(pipeline2);
    for await (const doc of res) {
      console.log("Pipeline:", doc);
    }
  } catch (error) {
    console.log("Main error:", error);
  } finally {
    await client.close();
    console.log("Mongo closed");
  }
};

main();
