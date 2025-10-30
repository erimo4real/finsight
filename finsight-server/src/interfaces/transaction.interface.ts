export interface ITransaction {
  userId: string;
  type: "income" | "expense";
  amount: number;
  category: string;
   description: string; // ✅ add this line
  date: Date;
}
