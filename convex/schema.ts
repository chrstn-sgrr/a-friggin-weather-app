import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  weatherData: defineTable({
    city: v.string(),
    data: v.any(),
    timestamp: v.number(),
  }).index("by_city", ["city"]),
};

export default defineSchema({
  ...applicationTables,
});
