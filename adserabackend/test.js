const mongoose = require("mongoose");

mongoose.connect("mongodb://saqlainjin_db_user:4sUs6g3z2861Tkhx@ac-klwyzlu-shard-00-00.bb0ekzq.mongodb.net:27017,ac-klwyzlu-shard-00-01.bb0ekzq.mongodb.net:27017,ac-klwyzlu-shard-00-02.bb0ekzq.mongodb.net:27017/?ssl=true&replicaSet=atlas-ebakki-shard-0&authSource=admin&appName=Cluster0")
  .then(() => console.log("✅ Connected"))
  .catch(err => console.log("❌ Error:", err));