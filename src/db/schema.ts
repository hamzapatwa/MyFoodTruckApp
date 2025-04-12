import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const myAppSchema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'inventory_items',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true }, // Mark optional fields
        { name: 'quantity', type: 'number' },
        { name: 'unit', type: 'string' },
        { name: 'low_stock_threshold', type: 'number', isOptional: true }, // Mark optional fields
        // WatermelonDB automatically adds `created_at` and `updated_at` if not defined
        // { name: 'created_at', type: 'number' },
        // { name: 'updated_at', type: 'number' },
      ],
    }),
    // Add other table schemas here as needed
  ],
});