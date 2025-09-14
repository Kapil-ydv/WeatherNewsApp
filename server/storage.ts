import { type UserSettings } from "@shared/schema";

export interface IStorage {
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  updateUserSettings(userId: string, settings: UserSettings): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.userSettings = new Map();
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return this.userSettings.get(userId);
  }

  async updateUserSettings(userId: string, settings: UserSettings): Promise<UserSettings> {
    this.userSettings.set(userId, settings);
    return settings;
  }
}

export const storage = new MemStorage();
