import { type ZkIdentity, type InsertZkIdentity, type Message, type InsertMessage, type FeatureVerification, type InsertFeatureVerification, zkIdentities, messages, featureVerifications } from "@shared/schema";
import { db } from "@db";
import { eq, or, desc, and } from "drizzle-orm";

export interface IStorage {
  getIdentity(publicKey: string): Promise<ZkIdentity | undefined>;
  createIdentity(identity: InsertZkIdentity): Promise<ZkIdentity>;
  updateIdentityTxHash(publicKey: string, txHash: string): Promise<void>;
  verifyIdentity(publicKey: string): Promise<void>;
  updateDisplayName(publicKey: string, displayName: string): Promise<ZkIdentity>;
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByPublicKey(publicKey: string): Promise<Message[]>;
  getMessageByTxHash(txHash: string): Promise<Message | undefined>;
  createFeatureVerification(verification: InsertFeatureVerification): Promise<FeatureVerification>;
  getFeatureVerification(publicKey: string, featureName: string): Promise<FeatureVerification | undefined>;
  getFeatureVerificationsByPublicKey(publicKey: string): Promise<FeatureVerification[]>;
}

export class DbStorage implements IStorage {
  async getIdentity(publicKey: string): Promise<ZkIdentity | undefined> {
    const result = await db
      .select()
      .from(zkIdentities)
      .where(eq(zkIdentities.publicKey, publicKey))
      .limit(1);
    return result[0];
  }

  async createIdentity(identity: InsertZkIdentity): Promise<ZkIdentity> {
    const result = await db
      .insert(zkIdentities)
      .values(identity)
      .returning();
    return result[0];
  }

  async updateIdentityTxHash(publicKey: string, txHash: string): Promise<void> {
    await db
      .update(zkIdentities)
      .set({ onchainTxHash: txHash, isVerified: true })
      .where(eq(zkIdentities.publicKey, publicKey));
  }

  async verifyIdentity(publicKey: string): Promise<void> {
    await db
      .update(zkIdentities)
      .set({ isVerified: true })
      .where(eq(zkIdentities.publicKey, publicKey));
  }

  async updateDisplayName(publicKey: string, displayName: string): Promise<ZkIdentity> {
    const result = await db
      .update(zkIdentities)
      .set({ displayName })
      .where(eq(zkIdentities.publicKey, publicKey))
      .returning();
    return result[0];
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db
      .insert(messages)
      .values(message)
      .returning();
    return result[0];
  }

  async getMessagesByPublicKey(publicKey: string): Promise<Message[]> {
    const result = await db
      .select()
      .from(messages)
      .where(
        or(
          eq(messages.fromPublicKey, publicKey),
          eq(messages.toPublicKey, publicKey)
        )
      )
      .orderBy(desc(messages.createdAt));
    return result;
  }

  async getMessageByTxHash(txHash: string): Promise<Message | undefined> {
    const result = await db
      .select()
      .from(messages)
      .where(eq(messages.txHash, txHash))
      .limit(1);
    return result[0];
  }

  async createFeatureVerification(verification: InsertFeatureVerification): Promise<FeatureVerification> {
    const result = await db
      .insert(featureVerifications)
      .values(verification)
      .returning();
    return result[0];
  }

  async getFeatureVerification(publicKey: string, featureName: string): Promise<FeatureVerification | undefined> {
    const result = await db
      .select()
      .from(featureVerifications)
      .where(
        and(
          eq(featureVerifications.publicKey, publicKey),
          eq(featureVerifications.featureName, featureName)
        )
      )
      .limit(1);
    return result[0];
  }

  async getFeatureVerificationsByPublicKey(publicKey: string): Promise<FeatureVerification[]> {
    const result = await db
      .select()
      .from(featureVerifications)
      .where(eq(featureVerifications.publicKey, publicKey))
      .orderBy(desc(featureVerifications.verifiedAt));
    return result;
  }
}

export const storage = new DbStorage();
