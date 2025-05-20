import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  phoneNumber: text("phone_number"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  coordinates: json("coordinates"),
  price: integer("price").default(0),
  imageUrl: text("image_url"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tickets Table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").notNull(),
  userId: integer("user_id").notNull(),
  qrCode: text("qr_code").notNull(),
  used: boolean("used").default(false),
  purchasedAt: timestamp("purchased_at").defaultNow(),
});

// Harambees Table
export const harambees = pgTable("harambees", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  goalAmount: integer("goal_amount").notNull(),
  raisedAmount: integer("raised_amount").default(0),
  imageUrl: text("image_url"),
  verified: boolean("verified").default(false),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contributions Table
export const contributions = pgTable("contributions", {
  id: serial("id").primaryKey(),
  harambeeId: integer("harambee_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  contributedAt: timestamp("contributed_at").defaultNow(),
});

// Rentals Table
export const rentals = pgTable("rentals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  price: integer("price").notNull(),
  isRental: boolean("is_rental").default(true),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  contactInfo: text("contact_info").notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Alerts Table
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g. Lost & Found, Emergency, etc.
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Comments Table
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  alertId: integer("alert_id").notNull(),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
  phoneNumber: true,
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });

export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, purchasedAt: true, used: true });

export const insertHarambeeSchema = createInsertSchema(harambees).omit({ id: true, createdAt: true, raisedAmount: true });

export const insertContributionSchema = createInsertSchema(contributions).omit({ id: true, contributedAt: true });

export const insertRentalSchema = createInsertSchema(rentals).omit({ id: true, createdAt: true });

export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });

export const insertCommentSchema = createInsertSchema(comments).omit({ id: true, createdAt: true });

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  events: many(events, { relationName: "user_events" }),
  tickets: many(tickets, { relationName: "user_tickets" }),
  harambees: many(harambees, { relationName: "user_harambees" }),
  contributions: many(contributions, { relationName: "user_contributions" }),
  rentals: many(rentals, { relationName: "user_rentals" }),
  alerts: many(alerts, { relationName: "user_alerts" }),
  comments: many(comments, { relationName: "user_comments" }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.createdBy],
    references: [users.id],
    relationName: "user_events"
  }),
  tickets: many(tickets, { relationName: "event_tickets" })
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
    relationName: "event_tickets"
  }),
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
    relationName: "user_tickets"
  })
}));

export const harambeesRelations = relations(harambees, ({ one, many }) => ({
  creator: one(users, {
    fields: [harambees.createdBy],
    references: [users.id],
    relationName: "user_harambees"
  }),
  contributions: many(contributions, { relationName: "harambee_contributions" })
}));

export const contributionsRelations = relations(contributions, ({ one }) => ({
  harambee: one(harambees, {
    fields: [contributions.harambeeId],
    references: [harambees.id],
    relationName: "harambee_contributions"
  }),
  user: one(users, {
    fields: [contributions.userId],
    references: [users.id],
    relationName: "user_contributions"
  })
}));

export const rentalsRelations = relations(rentals, ({ one }) => ({
  creator: one(users, {
    fields: [rentals.createdBy],
    references: [users.id],
    relationName: "user_rentals"
  })
}));

export const alertsRelations = relations(alerts, ({ one, many }) => ({
  creator: one(users, {
    fields: [alerts.createdBy],
    references: [users.id],
    relationName: "user_alerts"
  }),
  comments: many(comments, { relationName: "alert_comments" })
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  alert: one(alerts, {
    fields: [comments.alertId],
    references: [alerts.id],
    relationName: "alert_comments"
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
    relationName: "user_comments"
  })
}));

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type InsertHarambee = z.infer<typeof insertHarambeeSchema>;
export type InsertContribution = z.infer<typeof insertContributionSchema>;
export type InsertRental = z.infer<typeof insertRentalSchema>;
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type User = typeof users.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Ticket = typeof tickets.$inferSelect;
export type Harambee = typeof harambees.$inferSelect;
export type Contribution = typeof contributions.$inferSelect;
export type Rental = typeof rentals.$inferSelect;
export type Alert = typeof alerts.$inferSelect;
export type Comment = typeof comments.$inferSelect;
