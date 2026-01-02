
// ============================================================
// FILE: src/lib/services/walletService.ts
// Wallet Service - Wrapper around wallet API calls
// ============================================================

import { walletService as walletApi } from '../api';
import { AddMoneyData } from '../types';

class WalletService {
  /**
   * Get wallet balance
   */
  async getBalance() {
    const response = await walletApi.getBalance();
    return response;
  }

  /**
   * Get wallet transactions
   */
  async getTransactions(params?: { page?: number; limit?: number }) {
    const response = await walletApi.getTransactions(params);
    return response;
  }

  /**
   * Add money to wallet
   */
  async addMoney(data: AddMoneyData) {
    const response = await walletApi.addMoney(data);
    return response;
  }

  /**
   * Withdraw money from wallet
   */
  async withdrawMoney(amount: number, bankDetails: any) {
    const response = await walletApi.withdrawMoney(amount, bankDetails);
    return response;
  }

  /**
   * Check if wallet has sufficient balance
   */
  hasSufficientBalance(currentBalance: number, requiredAmount: number): boolean {
    return currentBalance >= requiredAmount;
  }

  /**
   * Calculate transaction statistics
   */
  calculateTransactionStats(transactions: any[]) {
    const credits = transactions.filter((t) => t.type === 'credit');
    const debits = transactions.filter((t) => t.type === 'debit');

    return {
      totalCredits: credits.reduce((sum, t) => sum + t.amount, 0),
      totalDebits: debits.reduce((sum, t) => sum + t.amount, 0),
      creditCount: credits.length,
      debitCount: debits.length,
      netBalance: credits.reduce((sum, t) => sum + t.amount, 0) -
        debits.reduce((sum, t) => sum + t.amount, 0),
    };
  }
}

export default new WalletService();
