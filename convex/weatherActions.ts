"use node";

import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const NCR_CITIES = [
  { name: "Manila", coords: "14.5995,120.9842" },
  { name: "Quezon City", coords: "14.6760,121.0437" },
  { name: "Makati", coords: "14.5547,121.0244" },
  { name: "Pasig", coords: "14.5764,121.0851" },
  { name: "Taguig", coords: "14.5176,121.0509" },
  { name: "Mandaluyong", coords: "14.5794,121.0359" },
  { name: "Marikina", coords: "14.6507,121.1029" },
  { name: "Pasay", coords: "14.5378,120.9896" },
  { name: "Caloocan", coords: "14.6488,120.9668" },
  { name: "Las Piñas", coords: "14.4378,120.9947" },
  { name: "Muntinlupa", coords: "14.3832,121.0409" },
  { name: "Parañaque", coords: "14.4793,121.0198" },
  { name: "Valenzuela", coords: "14.7000,120.9822" },
  { name: "Malabon", coords: "14.6650,120.9569" },
  { name: "Navotas", coords: "14.6691,120.9472" },
  { name: "San Juan", coords: "14.6019,121.0355" },
  { name: "Pateros", coords: "14.5441,121.0699" }
];

export const getCurrentWeather = action({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Weather API key not configured");
    }

    const cityData = NCR_CITIES.find(c => c.name === args.city);
    if (!cityData) {
      throw new Error("City not found in NCR region");
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityData.coords}&aqi=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store in database for caching
      await ctx.runMutation(internal.weather.storeWeatherData, {
        city: args.city,
        data,
        timestamp: Date.now(),
      });

      return data;
    } catch (error) {
      console.error("Weather fetch error:", error);
      throw new Error("Failed to fetch weather data");
    }
  },
});

export const getForecast = action({
  args: { city: v.string(), days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      throw new Error("Weather API key not configured");
    }

    const cityData = NCR_CITIES.find(c => c.name === args.city);
    if (!cityData) {
      throw new Error("City not found in NCR region");
    }

    const days = Math.min(args.days || 5, 10); // Limit to 10 days max

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityData.coords}&days=${days}&aqi=yes&alerts=yes`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Forecast fetch error:", error);
      throw new Error("Failed to fetch forecast data");
    }
  },
});


