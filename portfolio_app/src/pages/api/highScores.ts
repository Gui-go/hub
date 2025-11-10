// src/pages/api/highScores.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { Firestore } from "@google-cloud/firestore";

// Initialize Firestore client
const db = new Firestore({
  projectId: "personalhub14",
  keyFilename: process.env.NEXT_PUBLIC_FIRESTORE_SA_KEY, // path to your service account JSON
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { name, distance, score, date } = req.body;

      if (!name || distance == null || score == null || !date) {
        return res.status(400).json({ error: "Missing fields" });
      }

      await db.collection("highScores").add({
        name,
        distance: Number(distance),
        score: Number(score),
        date,
      });

      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const snapshot = await db
        .collection("highScores")
        .orderBy("distance", "desc")
        .limit(5)
        .get();

      const scores = snapshot.docs.map((doc) => doc.data());

      return res.status(200).json({ scores });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
