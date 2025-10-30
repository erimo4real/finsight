import mongoose from "mongoose";
import app from "./app";
import { seedDatabase } from "./seed/seedData"; // ✅ added import

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/finsight";

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // ✅ Run seeding if database is empty
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1);
  }
}

startServer();






// import mongoose from "mongoose";
// import app from "./app";

// const PORT = process.env.PORT || 5000;
// const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/finsight";

// async function startServer() {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ MongoDB connected");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on http://localhost:${PORT}`);
//     });
//   } catch (err) {
//     console.error("❌ Server startup error:", err);
//     process.exit(1);
//   }
// }

// startServer();
