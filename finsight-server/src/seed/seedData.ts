import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model";
import { TransactionModel } from "../models/transaction.model";
import { ITransaction } from "../interfaces/transaction.interface";

export const seedDatabase = async () => {
  const existingUsers = await UserModel.countDocuments();
  if (existingUsers > 0) {
    console.log("✅ Database already seeded — skipping.");
    return;
  }

  console.log("🌱 Seeding database with sample users and transactions...");

  const passwordHash = await bcrypt.hash("123456", 10);

  const users = [
    { name: "John Doe", email: "john@example.com", password: passwordHash, role: "user" },
    { name: "Jane Smith", email: "jane@example.com", password: passwordHash, role: "user" },
    { name: "Robert Green", email: "robert@example.com", password: passwordHash, role: "user" },
    { name: "Alice Brown", email: "alice@example.com", password: passwordHash, role: "user" },
    { name: "Michael Johnson", email: "michael@example.com", password: passwordHash, role: "user" },
    { name: "Admin User", email: "admin@example.com", password: passwordHash, role: "admin" },
  ];

  const createdUsers = await UserModel.insertMany(users);
  console.log(`👤 Seeded ${createdUsers.length} users.`);

  const categories = [
    "salary",
    "rent",
    "groceries",
    "utilities",
    "entertainment",
    "savings",
    "transport",
    "healthcare",
  ];

  const transactions: ITransaction[] = [];
  const now = new Date();

  // Exclude admin user from random transactions
  const regularUsers = createdUsers.filter((u) => u.role === "user");

  for (let i = 0; i < 125; i++) {
    const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];

    // Safety check to ensure _id exists
    if (!user._id) continue;

    //const type = Math.random() > 0.4 ? "deposit" : "withdrawal";
    const type = Math.random() > 0.4 ? "income" : "expense"; // ✅ changed to match interface

    const category = categories[Math.floor(Math.random() * categories.length)];
    const amount = parseFloat((Math.random() * 1000 + 50).toFixed(2));

    const date = new Date(now);
    date.setMonth(now.getMonth() - Math.floor(Math.random() * 12));
    date.setDate(Math.floor(Math.random() * 28) + 1);

    transactions.push({
      userId: user._id.toString(),
      type,
      category,
      amount,
      description: `${type === "income" ? "Received" : "Spent"} on ${category}`,
      date,
    });
  }

  await TransactionModel.insertMany(transactions);
  console.log(`💸 Seeded ${transactions.length} transactions.`);
  console.log("✅ Database seeding complete.");
};
