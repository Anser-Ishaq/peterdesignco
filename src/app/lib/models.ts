/**
 * Model registration utility
 * This ensures all Mongoose models are properly registered in serverless environments
 * Import this in API routes that use populate() to prevent MissingSchemaError
 */

import User from "@/app/models/User";
import Lead from "@/app/models/Lead";
import Product from "@/app/models/Product";
import Team from "@/app/models/Team";
import EmailTemplate from "@/app/models/EmailTemplate";
import Career from "@/app/models/Career";
import JobApplication from "@/app/models/JobApplication";
import Testimonial from "@/app/models/Testimonial";
import Query from "@/app/models/Query";

/**
 * Ensures all models are registered with Mongoose
 * Call this function in API routes before using populate()
 */
export function ensureModelsRegistered() {
  // Reference all models to ensure they're registered
  User;
  Lead;
  Product;
  Team;
  EmailTemplate;
  Career;
  JobApplication;
  Testimonial;
  Query;
}

export {
  User,
  Lead,
  Product,
  Team,
  EmailTemplate,
  Career,
  JobApplication,
  Testimonial,
  Query,
};