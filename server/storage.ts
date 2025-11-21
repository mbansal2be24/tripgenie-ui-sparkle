// Storage interface for CRUD operations
export interface IStorage {
  // Add your storage methods here
  // Example:
  // getItems(): Promise<Item[]>;
  // getItem(id: number): Promise<Item | null>;
  // createItem(item: InsertItem): Promise<Item>;
  // updateItem(id: number, item: Partial<InsertItem>): Promise<Item>;
  // deleteItem(id: number): Promise<void>;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  // Implement your storage methods here
}

export const storage: IStorage = new MemStorage();
