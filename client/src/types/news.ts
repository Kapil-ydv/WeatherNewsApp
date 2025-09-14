export interface NewsFilters {
  temperature?: number;
  condition?: string;
  categories: string[];
}

export interface NewsFilterInfo {
  isActive: boolean;
  reason: string;
  keywords: string[];
}
