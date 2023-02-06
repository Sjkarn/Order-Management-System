const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/route");
const app = express();

mongoose.set("strictQuery", true);

app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://SAURABH:Soa4GdK4yRvlVN5i@cluster0.umtgp.mongodb.net/Saurabh-DB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected..."))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log(
    "Express app running on port " + " " + (process.env.PORT || 3000)
  );
});