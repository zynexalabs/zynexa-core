import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const zkIdentities = pgTable("zk_identities", {
  publicKey: text("public_key").primaryKey(),
  displayName: text("display_name"),
  onchainTxHash: text("onchain_tx_hash"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("session", {
  sid: varchar("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  fromPublicKey: text("from_public_key").notNull(),
  toPublicKey: text("to_public_key").notNull(),
  isEncrypted: boolean("is_encrypted").notNull().default(true),
  contentPreview: text("content_preview"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const featureVerifications = pgTable("feature_verifications", {
  id: serial("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  featureName: text("feature_name").notNull(),
  txHash: text("tx_hash").notNull().unique(),
  verifiedAt: timestamp("verified_at").defaultNow().notNull(),
});

export const insertZkIdentitySchema = createInsertSchema(zkIdentities).pick({
  publicKey: true,
  displayName: true,
  onchainTxHash: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertFeatureVerificationSchema = createInsertSchema(featureVerifications).omit({
  id: true,
  verifiedAt: true,
});

export type InsertZkIdentity = z.infer<typeof insertZkIdentitySchema>;
export type ZkIdentity = typeof zkIdentities.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertFeatureVerification = z.infer<typeof insertFeatureVerificationSchema>;
export type FeatureVerification = typeof featureVerifications.$inferSelect;
