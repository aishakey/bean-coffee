import app from "./index.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.ATLAS_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
