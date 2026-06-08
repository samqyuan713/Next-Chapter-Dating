import { integer, pgTable, serial, text, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Users table (stores profile data linked to their Firebase Authentication UID)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull().unique(), // Firebase Auth standard unique id
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  gender: text("gender").notNull(), // 'male' | 'female'
  location: text("location").notNull(),
  occupation: text("occupation").notNull(),
  avatar: text("avatar").notNull(),
  tagline: text("tagline").notNull(),
  relationshipStatus: text("relationship_status").notNull(),
  childrenStatus: text("children_status").notNull(),
  aboutMe: text("about_me").notNull(),
  previousChapterInsight: text("previous_chapter_insight").notNull(),
  whatImLookingFor: text("what_im_looking_for").notNull(),
  values: json("values").$type<string[]>().default([]).notNull(),
  interests: json("interests").$type<string[]>().default([]).notNull(),
  icebreakerQuestion: text("icebreaker_question").notNull(),
  icebreakerAnswer: text("icebreaker_answer").notNull(),
  height: text("height"),
  weight: text("weight"),
  education: text("education"),
  ancestralRoots: text("ancestral_roots"),
  chineseZodiac: text("chinese_zodiac"),
  personalHobbies: json("personal_hobbies").$type<string[]>().default([]),
  preferredPartnerAge: text("preferred_partner_age"),
  preferredPartnerHeight: text("preferred_partner_height"),
  preferredPartnerEducation: text("preferred_partner_education"),
  preferredPartnerRoots: text("preferred_partner_roots"),
  preferredPartnerDescription: text("preferred_partner_description"),
  sportsActivities: json("sports_activities").$type<string[]>().default([]),
  socialPreferences: text("social_preferences"),
  photos: json("photos").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 2. Saved Bookmarks table (tracks profile saves/bookmarks)
export const bookmarks = pgTable("bookmarks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Uid of the saver
  savedProfileId: text("saved_profile_id").notNull(), // Uid/Id of the saved profile
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Real Premium Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderUid: text("sender_uid").notNull(),
  receiverUid: text("receiver_uid").notNull(),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  icebreakerTopic: text("icebreaker_topic"),
});

// 4. Activity Groups table (Community Café/Cafeteria)
export const activityGroups = pgTable("activity_groups", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  participantsCount: integer("participants_count").default(1).notNull(),
  tags: json("tags").$type<string[]>().default([]).notNull(),
  hostName: text("host_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations definitions
export const usersRelations = relations(users, ({ many }) => ({
  sentMessages: many(messages, { relationName: "sentMessages" }),
  receivedMessages: many(messages, { relationName: "receivedMessages" }),
}));
