import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Import Cloud SQL db and schemas
import { db } from "./src/db/index.ts";
import { users, messages, bookmarks, activityGroups } from "./src/db/schema.ts";
import { seedDatabase } from "./src/db/seed.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { eq, and, or, asc, desc } from "drizzle-orm";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Run database self-seeding on boot
  console.log("Initializing Cloud SQL connection check...");
  try {
    await seedDatabase();
  } catch (err) {
    console.error("Self-seeding warning:", err);
  }

  // Use JSON parsing
  app.use(express.json({ limit: "15mb" }));

  // Initialize secure, server-side Google GenAI instance
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // ==================== REAL CLOUD SQL PROFILE ENDPOINTS ====================

  // Synchronize/Register logged in user profile
  app.post("/api/users/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email } = req.user;
      const { 
        name, age, gender, location, occupation, avatar, tagline, 
        relationshipStatus, childrenStatus, aboutMe, previousChapterInsight, 
        whatImLookingFor, values, interests, icebreakerQuestion, icebreakerAnswer,
        height, weight, education, ancestralRoots, chineseZodiac, personalHobbies,
        preferredPartnerAge, preferredPartnerHeight, preferredPartnerEducation,
        preferredPartnerRoots, preferredPartnerDescription, sportsActivities,
        socialPreferences, photos 
      } = req.body;

      const result = await db.insert(users)
        .values({
          uid,
          email,
          name: name || "Honorable Guest",
          age: age || 48,
          gender: gender || "female",
          location: location || "Seattle, WA",
          occupation: occupation || "Legacy Professional",
          avatar: avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
          tagline: tagline || "Cultivating standard tranquility and sincere values.",
          relationshipStatus: relationshipStatus || "Starting Over",
          childrenStatus: childrenStatus || "Gratefully Independent",
          aboutMe: aboutMe || "Appreciating the peaceful rhythm of high-grade oolong and morning walks.",
          previousChapterInsight: previousChapterInsight || "Deep emotional peace and silent safety are the greatest wisdom.",
          whatImLookingFor: whatImLookingFor || "A refined partner to walk together without pressure.",
          values: values || ["Harmony", "Respect", "Patience"],
          interests: interests || ["Tea Appreciation", "Ikebana Flower Art", "Botanical walks"],
          icebreakerQuestion: icebreakerQuestion || "My definition of ultimate peace is...",
          icebreakerAnswer: icebreakerAnswer || "Sharing an aged tea container brew with warm and slow understanding.",
          height: height || "165 cm",
          weight: weight || "55 kg",
          education: education || "Higher Education Standard",
          ancestralRoots: ancestralRoots || "Guangdong ancestry",
          chineseZodiac: chineseZodiac || "Year of the Dragon",
          personalHobbies: personalHobbies || [],
          preferredPartnerAge: preferredPartnerAge || "45 - 65",
          preferredPartnerHeight: preferredPartnerHeight || "170 cm +",
          preferredPartnerEducation: preferredPartnerEducation || "College graduate or above",
          preferredPartnerRoots: preferredPartnerRoots || "East Asian legacy preferred",
          preferredPartnerDescription: preferredPartnerDescription || "A gentle partner who values silence, family filial care, and small tea rituals.",
          sportsActivities: sportsActivities || ["Tai Chi", "Scenics walks"],
          socialPreferences: socialPreferences || "Warm intimate circles",
          photos: photos || [avatar]
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: {
            email,
            name: name || "Honorable Guest",
            age: age || 48,
            location: location || "Seattle, WA",
            occupation: occupation || "Legacy Professional",
            avatar: avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
            tagline: tagline || "Cultivating standard tranquility and sincere values.",
            aboutMe: aboutMe || "Appreciating the peaceful rhythm of high-grade oolong and morning walks.",
          }
        })
        .returning();

      res.json(result[0]);
    } catch (error: any) {
      console.error("Failed to synchronize user:", error);
      res.status(500).json({ error: "Database profile synchronization failure. " + error.message });
    }
  });

  // Get Matchmaker & Companion Profiles
  app.get("/api/profiles", async (req, res) => {
    try {
      const list = await db.select().from(users).orderBy(asc(users.id));
      res.json(list);
    } catch (error: any) {
      console.error("Failed to fetch matching profiles:", error);
      res.status(500).json({ error: "Could not fetch dynamic matchmaking profiles." });
    }
  });

  // ==================== REAL CLOUD SQL BOOKMARKS ENDPOINTS ====================

  // Get user's saved bookmark profile IDs
  app.get("/api/bookmarks", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user;
      const list = await db.select().from(bookmarks).where(eq(bookmarks.userId, uid));
      res.json(list.map(b => b.savedProfileId));
    } catch (error: any) {
      console.error("Failed to query user bookmarks:", error);
      res.status(500).json({ error: "Database querying exception." });
    }
  });

  // Toggle saving/bookmarking a profile
  app.post("/api/bookmarks", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user;
      const { savedProfileId } = req.body;

      if (!savedProfileId) {
        return res.status(400).json({ error: "Missing savedProfileId argument." });
      }

      const existing = await db.select().from(bookmarks).where(
        and(
          eq(bookmarks.userId, uid),
          eq(bookmarks.savedProfileId, savedProfileId)
        )
      ).limit(1);

      if (existing.length > 0) {
        await db.delete(bookmarks).where(
          and(
            eq(bookmarks.userId, uid),
            eq(bookmarks.savedProfileId, savedProfileId)
          )
        );
        res.json({ saved: false });
      } else {
        await db.insert(bookmarks).values({
          userId: uid,
          savedProfileId,
        });
        res.json({ saved: true });
      }
    } catch (error: any) {
      console.error("Failed to toggle profile bookmark state:", error);
      res.status(500).json({ error: "Database persistence error." });
    }
  });

  // ==================== REAL CLOUD SQL MESSAGES ENDPOINTS ====================

  // Get messages for a given partner
  app.get("/api/messages", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user;
      const { partnerUid } = req.query;

      if (!partnerUid) {
        return res.status(400).json({ error: "Missing partnerUid parameters." });
      }

      const list = await db.select().from(messages).where(
        or(
          and(eq(messages.senderUid, uid), eq(messages.receiverUid, partnerUid as string)),
          and(eq(messages.senderUid, partnerUid as string), eq(messages.receiverUid, uid))
        )
      ).orderBy(asc(messages.timestamp));

      res.json(list);
    } catch (error: any) {
      console.error("Failed to query conversation messages:", error);
      res.status(500).json({ error: "Database messaging query failure." });
    }
  });

  // Send / Save conversation message
  app.post("/api/messages", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user;
      const { receiverUid, text, icebreakerTopic } = req.body;

      if (!receiverUid || !text) {
        return res.status(400).json({ error: "Missing receiverUid or text fields." });
      }

      const result = await db.insert(messages).values({
        senderUid: uid,
        receiverUid,
        text,
        icebreakerTopic,
      }).returning();

      res.json(result[0]);
    } catch (error: any) {
      console.error("Failed to save transaction message:", error);
      res.status(500).json({ error: "Database message storage failure." });
    }
  });

  // Simulated virtual companion reply endpoint (Inserts message from standard matches to user)
  app.post("/api/messages/simulate", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid } = req.user; // current logging user is target/receiver
      const { senderUid, text } = req.body;

      if (!senderUid || !text) {
        return res.status(400).json({ error: "Missing senderUid or text fields for simulator." });
      }

      const result = await db.insert(messages).values({
        senderUid,
        receiverUid: uid,
        text,
      }).returning();

      res.json(result[0]);
    } catch (error: any) {
      console.error("Simulator message injection failed:", error);
      res.status(500).json({ error: "Database simulation storage failed." });
    }
  });

  // ==================== REAL CLOUD SQL COMMUNITY CAFÉ ENDPOINTS ====================

  // Get active discussion boards
  app.get("/api/groups", async (req, res) => {
    try {
      const list = await db.select().from(activityGroups).orderBy(desc(activityGroups.createdAt));
      res.json(list);
    } catch (error: any) {
      console.error("Failed to query café lobby groups:", error);
      res.status(500).json({ error: "Database café query failure." });
    }
  });

  // Create new café discussion board
  app.post("/api/groups", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { title, description, tags, hostName } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Missing required title or description parameter." });
      }

      const result = await db.insert(activityGroups).values({
        title,
        description,
        tags: tags || [],
        hostName: hostName || "Anonymous Facilitator",
        participantsCount: 1,
      }).returning();

      res.json(result[0]);
    } catch (error: any) {
      console.error("Failed to register café board:", error);
      res.status(500).json({ error: "Database café group insertion failure." });
    }
  });

  // Join discussion board (increment participants count)
  app.post("/api/groups/:id/join", requireAuth, async (req: AuthRequest, res) => {
    try {
      const groupId = parseInt(req.params.id);
      if (!groupId) {
        return res.status(400).json({ error: "Invalid group identifier string." });
      }

      const existing = await db.select().from(activityGroups).where(eq(activityGroups.id, groupId)).limit(1);
      if (existing.length === 0) {
        return res.status(404).json({ error: "Café room not found." });
      }

      const updated = await db.update(activityGroups)
        .set({ participantsCount: (existing[0].participantsCount || 1) + 1 })
        .where(eq(activityGroups.id, groupId))
        .returning();

      res.json(updated[0]);
    } catch (error: any) {
      console.error("Failed to join café board:", error);
      res.status(500).json({ error: "Database café joining error." });
    }
  });

  // Setup Vite's dev server middleware in dev mode
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MATCHER WORKSPACE] Server successfully booted and listening at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Server synchronization crash:", error);
});
