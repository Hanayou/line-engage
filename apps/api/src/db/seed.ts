import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcryptjs from "bcryptjs";
const { hashSync } = bcryptjs;
import { v4 as uuid } from "uuid";
import { users, customers, activityLogs, dashboardStats } from "./schema";

const JAPANESE_NAMES = [
  "田中太郎",
  "佐藤花子",
  "鈴木一郎",
  "高橋美咲",
  "伊藤健太",
  "渡辺さくら",
  "山本大輔",
  "中村あおい",
  "小林翔太",
  "加藤ゆい",
  "吉田蓮",
  "山田凛",
  "松本陽菜",
  "井上悠真",
  "木村結衣",
  "林拓海",
  "斎藤美月",
  "清水颯太",
  "山口芽依",
  "阿部大翔",
  "森本ひなた",
  "池田奏",
  "橋本陽斗",
  "石川紬",
  "前田律",
  "藤田彩葉",
  "後藤壮真",
  "岡田莉子",
  "金子朝陽",
  "近藤詩",
  "村上湊",
  "遠藤凪",
  "青木碧",
  "坂本ほのか",
  "工藤晴",
  "西村紗良",
  "内田蒼",
  "藤原栞",
  "太田暖",
  "三浦柚葉",
  "岡本樹",
  "中島璃子",
  "原田空",
  "松田ことは",
  "竹内澄海",
  "和田芹菜",
  "石井陸斗",
  "宮崎絢音",
  "福田海翔",
  "長谷川いろは",
];

const SEGMENTS = ["vip", "regular", "new"] as const;

const FEEDBACK_MESSAGES = [
  "submitted product feedback via LINE survey",
  "rated their recent purchase experience",
  "completed the NPS survey (score: 9)",
  "left a review on the loyalty page",
  "submitted a feature request via VoC form",
  "responded to post-purchase follow-up",
];

const CAMPAIGN_MESSAGES = [
  "Spring Sale campaign sent to 1,200 users",
  "Weekly newsletter delivered to VIP segment",
  "New arrival notification pushed to 800 users",
  "Birthday coupon campaign triggered for 45 users",
  "Re-engagement campaign sent to inactive users",
  "Flash sale alert pushed to all segments",
];

function randomDate(daysBack: number): Date {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is required");

  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log("Seeding database...");

  // ── Admin user ──────────────────────────────────────
  const adminId = uuid();
  await db.insert(users).values({
    id: adminId,
    email: "admin@line-engage.dev",
    name: "Demo Admin",
    password: hashSync("demo1234", 10),
    role: "admin",
  });
  console.log("  ✓ Admin user created (admin@line-engage.dev / demo1234)");

  // ── Customers ───────────────────────────────────────
  const customerIds: string[] = [];
  for (const name of JAPANESE_NAMES) {
    const id = uuid();
    customerIds.push(id);
    const registeredAt = randomDate(180);
    const lastActiveAt = randomDate(30);

    await db.insert(customers).values({
      id,
      lineUserId: `U${uuid().replace(/-/g, "").slice(0, 32)}`,
      lineName: name,
      email:
        Math.random() > 0.3
          ? `${name.toLowerCase().replace(/\s/g, "")}@example.com`
          : null,
      segment: pick(SEGMENTS),
      registeredAt: registeredAt < lastActiveAt ? registeredAt : lastActiveAt,
      lastActiveAt,
    });
  }
  console.log(`  ✓ ${JAPANESE_NAMES.length} customers created`);

  // ── Activity logs ───────────────────────────────────
  const activities = [];
  for (let i = 0; i < 25; i++) {
    const isFeedback = Math.random() > 0.4;
    activities.push({
      id: uuid(),
      type: isFeedback
        ? "feedback"
        : Math.random() > 0.5
          ? "campaign"
          : "registration",
      message: isFeedback
        ? `${pick(JAPANESE_NAMES)} ${pick(FEEDBACK_MESSAGES)}`
        : pick(CAMPAIGN_MESSAGES),
      customerId: isFeedback ? pick(customerIds) : null,
      createdAt: randomDate(14),
    });
  }
  // Sort by date descending
  activities.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  await db.insert(activityLogs).values(activities);
  console.log(`  ✓ ${activities.length} activity logs created`);

  // ── Dashboard stats (30 days) ───────────────────────
  let friendsBase = 2340;
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    friendsBase += Math.floor(Math.random() * 15) + 2;
    const openRate = 58 + Math.random() * 18;
    const vocCount = Math.floor(Math.random() * 12) + 3;
    const campaignsSent =
      Math.random() > 0.6 ? Math.floor(Math.random() * 3) + 1 : 0;

    await db.insert(dashboardStats).values({
      id: uuid(),
      date: dateStr,
      lineFriends: friendsBase,
      openRate: openRate.toFixed(2),
      vocCount,
      campaignsSent,
    });
  }
  console.log("  ✓ 31 days of dashboard stats created");

  console.log("\nSeed complete!");
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
