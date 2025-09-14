import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { weatherDataSchema, newsResponseSchema, userSettingsSchema } from "@shared/schema";
import { z } from "zod";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY || "";
const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEWSAPI_KEY || "";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Weather endpoint
  app.get("/api/weather", async (req, res) => {
    try {
      const { lat, lon, units = 'imperial' } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ message: "Latitude and longitude are required" });
      }

      if (!OPENWEATHER_API_KEY) {
        return res.status(500).json({ message: "OpenWeatherMap API key not configured" });
      }

      // Fetch current weather
      const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
      const currentResponse = await fetch(currentWeatherUrl);
      
      if (!currentResponse.ok) {
        throw new Error(`Weather API error: ${currentResponse.statusText}`);
      }
      
      const currentData = await currentResponse.json();

      // Fetch 5-day forecast
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=${units}`;
      const forecastResponse = await fetch(forecastUrl);
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.statusText}`);
      }
      
      const forecastData = await forecastResponse.json();

      // Process forecast data to get daily forecasts
      const dailyForecasts = [];
      const processedDates = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();
        
        if (!processedDates.has(dateString) && dailyForecasts.length < 5) {
          processedDates.add(dateString);
          
          const dayName: string = dailyForecasts.length === 0 ? 'Today' : 
                         date.toLocaleDateString('en-US', { weekday: 'short' });
          
          dailyForecasts.push({
            date: dateString,
            dayName,
            high: Math.round(item.main.temp_max),
            low: Math.round(item.main.temp_min),
            condition: item.weather[0].description,
            icon: item.weather[0].icon,
          });
        }
      }

      const weatherData = {
        location: {
          city: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon,
        },
        current: {
          temperature: Math.round(currentData.main.temp),
          condition: currentData.weather[0].description,
          feelsLike: Math.round(currentData.main.feels_like),
          humidity: currentData.main.humidity,
          wind: Math.round(currentData.wind.speed),
          visibility: Math.round(currentData.visibility / 1000), // Convert to km/miles
          uvIndex: 0, // UV index not available in current weather API
          icon: currentData.weather[0].icon,
        },
        forecast: dailyForecasts,
        lastUpdated: new Date().toISOString(),
      };

      const validatedData = weatherDataSchema.parse(weatherData);
      res.json(validatedData);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  // News endpoint with weather-based filtering
  app.get("/api/news", async (req, res) => {
    try {
      const { temperature, condition, categories = 'general', page = 1, pageSize = 20 } = req.query;
      
      console.log("News API request params:", { temperature, condition, categories, page, pageSize });

      if (!NEWS_API_KEY) {
        return res.status(500).json({ message: "News API key not configured" });
      }

      // Determine weather-based keywords
      let weatherKeywords = '';
      const temp = parseFloat(temperature as string);
      
      if (temperature && condition) {
        if (temp < 50) { // Cold weather - depressing news
          weatherKeywords = 'tragedy OR crisis OR disaster OR death OR conflict';
        } else if (temp > 80) { // Hot weather - fear-related news
          weatherKeywords = 'danger OR threat OR risk OR fear OR warning';
        } else { // Cool weather - positive news
          weatherKeywords = 'success OR victory OR achievement OR breakthrough OR celebration';
        }
      }

      // For now, let's use a simpler approach - just get top headlines
      // Note: NewsAPI only accepts one category at a time, so we'll use the first one
      const categoryList = (categories as string).split(',');
      const category = categoryList[0] === 'general' ? '' : categoryList[0];
      const categoryParam = category ? `&category=${category}` : '';
      const newsUrl = `https://newsapi.org/v2/top-headlines?country=us${categoryParam}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
      
      console.log("News API URL:", newsUrl);

      const response = await fetch(newsUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`News API URL: ${newsUrl}`);
        console.error(`News API error status: ${response.status}`);
        console.error(`News API error details: ${errorText}`);
        throw new Error(`News API error: ${response.statusText} - ${errorText}`);
      }
      
      const newsData = await response.json();

      const processedArticles = newsData.articles.map((article: any, index: number) => ({
        id: `${Date.now()}-${index}`,
        title: article.title,
        description: article.description || '',
        url: article.url,
        urlToImage: article.urlToImage,
        source: article.source.name,
        publishedAt: article.publishedAt,
        category: categories as string,
      }));

      const newsResponse = {
        articles: processedArticles,
        totalResults: newsData.totalResults,
      };

      const validatedData = newsResponseSchema.parse(newsResponse);
      res.json(validatedData);
    } catch (error) {
      console.error("News API error:", error);
      res.status(500).json({ message: "Failed to fetch news data" });
    }
  });

  // User settings endpoints
  app.get("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const settings = await storage.getUserSettings(userId) || userSettingsSchema.parse({});
      res.json(settings);
    } catch (error) {
      console.error("Settings fetch error:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const validatedSettings = userSettingsSchema.parse(req.body);
      const updatedSettings = await storage.updateUserSettings(userId, validatedSettings);
      res.json(updatedSettings);
    } catch (error) {
      console.error("Settings update error:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
