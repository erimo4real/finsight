import { BaseDTO } from "./base.dto";

export interface ITransactionDTO {
  userId: string;
  type: "deposit" | "withdrawal"; // CHANGED: align with TransactionModel
  amount: number;
  category: string;
  date: Date;
  description?: string;
  attachmentUrl?: string; // CHANGED
}

export class TransactionDTO extends BaseDTO<ITransactionDTO> implements ITransactionDTO {
  userId!: string;
  type!: "deposit" | "withdrawal";
  amount!: number;
  category!: string;
  date!: Date;
  description?: string;
  attachmentUrl?: string;

  static fromEntity(entity: any): TransactionDTO {
    return new TransactionDTO({
      userId: entity.userId?.toString ? entity.userId.toString() : entity.userId,
      type: entity.type,
      amount: entity.amount,
      category: entity.category,
      date: entity.date,
      description: entity.description,
      attachmentUrl: entity.attachmentUrl, // CHANGED
    });
  }
}





// import { BaseDTO } from "./base.dto";

// export interface ITransactionDTO {
//   userId: string;
//   type: "income" | "expense";
//   amount: number;
//   category: string;
//   date: Date;
// }

// export class TransactionDTO
//   extends BaseDTO<ITransactionDTO>
//   implements ITransactionDTO
// {
//   userId!: string;
//   type!: "income" | "expense";
//   amount!: number;
//   category!: string;
//   date!: Date;

//   static fromEntity(entity: any): TransactionDTO {
//     return new TransactionDTO({
//       userId: entity.userId,
//       type: entity.type,
//       amount: entity.amount,
//       category: entity.category,
//       date: entity.date,
//     });
//   }
// }

