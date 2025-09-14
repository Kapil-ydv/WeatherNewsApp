import { z } from "zod";

// Weather schemas
export const weatherDataSchema = z.object({
  location: z.object({
    city: z.string(),
    country: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  current: z.object({
    temperature: z.number(),
    condition: z.string(),
    feelsLike: z.number(),
    humidity: z.number(),
    wind: z.number(),
    visibility: z.number(),
    uvIndex: z.number(),
    icon: z.string(),
  }),
  forecast: z.array(z.object({
    date: z.string(),
    dayName: z.string(),
    high: z.number(),
    low: z.number(),
    condition: z.string(),
    icon: z.string(),
  })),
  lastUpdated: z.string(),
});

export const newsArticleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string(),
  urlToImage: z.string().nullable(),
  source: z.string(),
  publishedAt: z.string(),
  category: z.string().optional(),
});

export const newsResponseSchema = z.object({
  articles: z.array(newsArticleSchema),
  totalResults: z.number(),
});

// Settings schemas
export const userSettingsSchema = z.object({
  temperatureUnit: z.enum(['celsius', 'fahrenheit']).default('fahrenheit'),
  newsCategories: z.object({
    general: z.boolean().default(true),
    technology: z.boolean().default(true),
    health: z.boolean().default(false),
    sports: z.boolean().default(false),
    entertainment: z.boolean().default(false),
  }).default({}),
  weatherFiltering: z.boolean().default(true),
  useCurrentLocation: z.boolean().default(true),
  notifications: z.object({
    weather: z.boolean().default(true),
    news: z.boolean().default(false),
  }).default({}),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;
export type NewsArticle = z.infer<typeof newsArticleSchema>;
export type NewsResponse = z.infer<typeof newsResponseSchema>;
export type UserSettings = z.infer<typeof userSettingsSchema>;
