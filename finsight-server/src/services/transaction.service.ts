import { TransactionRepository } from "../repositories/transaction.repository";
import { ITransaction } from "../interfaces/transaction.interface";
import { TransactionDTO } from "../dtos/transaction.dto";
import { AuditService } from "./audit.service";

const auditService = new AuditService();

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  async createTransaction(transactionData: ITransaction): Promise<TransactionDTO> {
    const transaction = await this.transactionRepository.create(transactionData);
    try {
      await auditService.logAction(transactionData.userId.toString(), "CREATE_TRANSACTION", transaction._id?.toString(), "transaction");
    } catch (e) {
      console.warn("Audit failed for createTransaction:", e);
    }
    return TransactionDTO.fromEntity(transaction);
  }

  async getTransactionsByUser(userId: string): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.findByUser(userId);
    return transactions.map(TransactionDTO.fromEntity);
  }

  async updateTransaction(transactionId: string, updates: Partial<ITransaction>, userId: string) {
    const updated = await this.transactionRepository.updateWithUser(transactionId, updates, userId);

   // const updated = await this.transactionRepository.update(transactionId, updates, userId);
    if (!updated) return null;
    try {
      await auditService.logAction(userId, "UPDATE_TRANSACTION", transactionId, "transaction");
    } catch (e) {
      console.warn("Audit failed for updateTransaction:", e);
    }
    return TransactionDTO.fromEntity(updated);
  }

  async deleteTransaction(transactionId: string, userId: string) {
    const deleted = await this.transactionRepository.deleteWithUser(transactionId, userId);

   // const deleted = await this.transactionRepository.delete(transactionId, userId);
    if (deleted) {
      try {
        await auditService.logAction(userId, "DELETE_TRANSACTION", transactionId, "transaction");
      } catch (e) {
        console.warn("Audit failed for deleteTransaction:", e);
      }
    }
    return !!deleted;
  }

  // ADMIN methods
  async getAllTransactions(adminId: string): Promise<TransactionDTO[]> {
    const transactions = await this.transactionRepository.findAll();
    await auditService.logAction(adminId, "ADMIN_VIEW_ALL_TRANSACTIONS");
    return transactions.map(TransactionDTO.fromEntity);
  }

  async getTransactionByIdAdmin(adminId: string, transactionId: string) {
    const transaction = await this.transactionRepository.findById(transactionId);
    if (!transaction) return null;
    await auditService.logAction(adminId, "ADMIN_VIEW_TRANSACTION", transactionId, "transaction");
    return TransactionDTO.fromEntity(transaction);
  }

  async adminUpdateTransaction(adminId: string, transactionId: string, updates: Partial<ITransaction>) {
    const updated = await this.transactionRepository.updateByAdmin(transactionId, updates);
    if (!updated) return null;
    await auditService.logAction(adminId, "ADMIN_UPDATE_TRANSACTION", transactionId, "transaction");
    return TransactionDTO.fromEntity(updated);
  }

  async adminDeleteTransaction(adminId: string, transactionId: string) {
    const deleted = await this.transactionRepository.deleteWithUser(transactionId, adminId);
    if (deleted) {
      await auditService.logAction(adminId, "ADMIN_DELETE_TRANSACTION", transactionId, "transaction");
    }
    return !!deleted;
  }

  async getMonthlyBreakdown(adminId: string) {
    const result = await this.transactionRepository.monthlyBreakdown();
    await auditService.logAction(adminId, "ADMIN_VIEW_MONTHLY_BREAKDOWN");
    return result;
  }

  async getRolling12MonthSummary(adminId: string) {
    const result = await this.transactionRepository.rolling12MonthSummary();
    await auditService.logAction(adminId, "ADMIN_VIEW_12M_SUMMARY");
    return result;
  }
}
