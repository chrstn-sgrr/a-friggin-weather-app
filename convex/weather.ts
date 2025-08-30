import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

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

export const getNCRCities = query({
  args: {},
  handler: async () => {
    return NCR_CITIES.map(city => city.name);
  },
});

export const getCachedWeather = query({
  args: { city: v.string() },
  handler: async (ctx, args) => {
    const cached = await ctx.db
      .query("weatherData")
      .withIndex("by_city", (q) => q.eq("city", args.city))
      .order("desc")
      .first();

    // Return cached data if it's less than 10 minutes old
    if (cached && Date.now() - cached.timestamp < 10 * 60 * 1000) {
      return cached.data;
    }

    return null;
  },
});

export const storeWeatherData = internalMutation({
  args: {
    city: v.string(),
    data: v.any(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("weatherData", args);
  },
});
