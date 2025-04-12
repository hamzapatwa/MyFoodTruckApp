import { Model } from '@nozbe/watermelondb';
import { field, text, writer } from '@nozbe/watermelondb/decorators';

export default class InventoryItem extends Model {
  static table = 'inventory_items'; // Define the table name

  @text('name') name!: string;
  @text('description') description?: string; // Optional description
  @field('quantity') quantity!: number; // Current stock quantity
  @text('unit') unit!: string; // e.g., 'kg', 'liters', 'pcs'
  @field('low_stock_threshold') lowStockThreshold?: number; // Optional threshold for notifications

  // Example of an action (writer) to update quantity
  @writer async updateQuantity(newQuantity: number) {
    await this.update(item => {
      item.quantity = newQuantity;
    });
  }

  // Add other actions as needed, e.g., increment, decrement
  @writer async incrementQuantity(amount: number = 1) {
    await this.update(item => {
      item.quantity += amount;
    });
  }

  @writer async decrementQuantity(amount: number = 1) {
    await this.update(item => {
      // Ensure quantity doesn't go below zero
      item.quantity = Math.max(0, item.quantity - amount);
    });
  }
}