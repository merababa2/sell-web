import { randomUUID } from "crypto";
import { count } from "drizzle-orm";
import { db } from "@/db";
import { ensureSchema } from "@/db/migrate";
import { accessLinks, menuItems, restaurantTables } from "@/db/schema";

const PX = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

const PXC = (id: number) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`;

type SeedItem = {
  name: string;
  nameAr: string;
  description: string;
  category: string;
  priceFils: number;
  imageUrl: string;
  popular?: boolean;
};

const MENU: SeedItem[] = [
  {
    name: "Turkish Breakfast Spread",
    nameAr: "فطار تركي متعدد الأصناف",
    description:
      "A lavish board of white cheese, olives, eggs, honey, kaymak, jams, simit and warm bread for two.",
    category: "Breakfast",
    priceFils: 8500,
    imageUrl: PX(20230771),
    popular: true,
  },
  {
    name: "Egg Sandwich",
    nameAr: "ساندويتش بيض",
    description:
      "Soft toasted brioche, folded farm eggs, truffle mayo, chives and crispy potatoes.",
    category: "Breakfast",
    priceFils: 3250,
    imageUrl: PX(18543436),
  },
  {
    name: "Labneh with Makdous",
    nameAr: "لبنة مع المكدوس",
    description:
      "Silky strained labneh, walnut-stuffed makdous eggplant, za'atar oil and warm tanoor bread.",
    category: "Breakfast",
    priceFils: 3750,
    imageUrl: PX(35567501),
  },
  {
    name: "Mushroom Cheese Bread",
    nameAr: "خبز بالمشروم والجبن",
    description:
      "Wood-fired flatbread loaded with roasted mushrooms and molten mozzarella, garlic butter brush.",
    category: "Starters",
    priceFils: 3500,
    imageUrl: PX(33593004),
  },
  {
    name: "Mushroom Arancini",
    nameAr: "أرانشيني المشروم",
    description:
      "Golden crisp risotto balls with a wild mushroom heart, parmesan cream and truffle shavings.",
    category: "Starters",
    priceFils: 4250,
    imageUrl: PX(31372390),
    popular: true,
  },
  {
    name: "Fried Shrimp",
    nameAr: "روبيان مقلي",
    description:
      "Buttermilk-dusted shrimp, smoked paprika aioli, charred lemon and fresh herbs.",
    category: "Starters",
    priceFils: 5500,
    imageUrl: PX(16357830),
  },
  {
    name: "Mutabbal",
    nameAr: "متبل",
    description:
      "Fire-charred eggplant folded with tahini, pomegranate seeds, olive oil and za'atar flatbread.",
    category: "Starters",
    priceFils: 2750,
    imageUrl: PX(30168756),
  },
  {
    name: "Pumpkin Soup",
    nameAr: "شوربة اليقطين",
    description:
      "Slow-roasted pumpkin velouté, brown butter, toasted seeds and a swirl of cream.",
    category: "Soups",
    priceFils: 3250,
    imageUrl: PX(18765531),
    popular: true,
  },
  {
    name: "Mushroom Soup",
    nameAr: "شوربة المشروم",
    description:
      "Forest mushroom cream, a drizzle of truffle oil and herb sourdough croutons.",
    category: "Soups",
    priceFils: 3000,
    imageUrl: PX(27039877),
    popular: true,
  },
  {
    name: "Sweet Potato Salad",
    nameAr: "سلطة البطاطا الحلوة",
    description:
      "Roasted sweet potato, baby greens, feta, candied pecans and a citrus-sumac dressing.",
    category: "Salads",
    priceFils: 4000,
    imageUrl: PX(23996502),
  },
  {
    name: "Truffle Pizza",
    nameAr: "بيتزا الترافل",
    description:
      "Fior di latte, black truffle cream, roasted mushrooms, rocket and aged parmesan — our signature.",
    category: "Pizza",
    priceFils: 6750,
    imageUrl: PX(5993865),
    popular: true,
  },
  {
    name: "Diavola Pizza",
    nameAr: "بيتزا ديابولا",
    description:
      "Spicy pepperoni, San Marzano tomato, mozzarella and a lick of hot honey on leopard-spotted crust.",
    category: "Pizza",
    priceFils: 5500,
    imageUrl: PX(32035731),
    popular: true,
  },
  {
    name: "Otro Rigatoni",
    nameAr: "ريجاتوني أوترو",
    description:
      "Our namesake rigatoni — slow tomato-basil sugo, stracciatella and toasted pangrattato.",
    category: "Pasta & Mains",
    priceFils: 6250,
    imageUrl: PX(24289216),
    popular: true,
  },
  {
    name: "Sizzling Truffle Mac & Cheese",
    nameAr: "ماك آند تشيز بالترافل",
    description:
      "Cast-iron mac, three-cheese pull, truffle crumb — arrives at the table still sizzling.",
    category: "Pasta & Mains",
    priceFils: 5750,
    imageUrl: PX(5379639),
    popular: true,
  },
  {
    name: "Chocolate Dome",
    nameAr: "قبة الشوكولاتة",
    description:
      "Molten-heart chocolate dome over salted caramel, melted tableside with warm ganache.",
    category: "Desserts",
    priceFils: 4500,
    imageUrl: PXC(16052376),
    popular: true,
  },
  {
    name: "Saffron Cake",
    nameAr: "كيكة الزعفران",
    description:
      "Warm saffron milk cake, crushed pistachio and rose-kissed cream.",
    category: "Desserts",
    priceFils: 3250,
    imageUrl: PXC(16052362),
  },
  {
    name: "Passion Fruit Mojito",
    nameAr: "موهيتو باشن فروت",
    description:
      "Passion fruit, crushed mint, lime and ice-cold soda. Zero-proof, full-flavour.",
    category: "Coffee & Drinks",
    priceFils: 2950,
    imageUrl: PX(11009204),
    popular: true,
  },
  {
    name: "Latte",
    nameAr: "لاتيه",
    description: "Double-shot espresso under silky steamed milk, single-origin beans.",
    category: "Coffee & Drinks",
    priceFils: 1750,
    imageUrl: PXC(29151074),
    popular: true,
  },
  {
    name: "Hot Mocha",
    nameAr: "موكا ساخنة",
    description:
      "Espresso whisked with dark chocolate and steamed milk, finished with cocoa dust.",
    category: "Coffee & Drinks",
    priceFils: 2000,
    imageUrl: PXC(37228284),
  },
  {
    name: "Coffee",
    nameAr: "قهوة",
    description: "Freshly pulled espresso or slow-brewed Turkish coffee, your call.",
    category: "Coffee & Drinks",
    priceFils: 1250,
    imageUrl: PX(13541823),
  },
];

const globalForSeed = globalThis as unknown as { __seeded?: boolean };

/**
 * Ensures DB schema exists then idempotently seeds the menu, 8 tables and
 * one online-ordering link the first time any page touches the database.
 */
export async function ensureSeed(): Promise<void> {
  if (globalForSeed.__seeded) return;
  globalForSeed.__seeded = true;
  try {
    // Always run schema creation first — safe with IF NOT EXISTS
    await ensureSchema();

    const menuCount = await db.select({ value: count() }).from(menuItems);
    if (menuCount[0].value === 0) {
      await db.insert(menuItems).values(
        MENU.map((m, i) => ({ ...m, sortOrder: i })),
      );
    }

    const tableCount = await db.select({ value: count() }).from(restaurantTables);
    if (tableCount[0].value === 0) {
      await db.insert(restaurantTables).values(
        Array.from({ length: 8 }, (_, i) => ({
          name: `Table ${i + 1}`,
          token: randomUUID(),
        })),
      );
    }

    const linkCount = await db.select({ value: count() }).from(accessLinks);
    if (linkCount[0].value === 0) {
      await db.insert(accessLinks).values({
        label: "Online Ordering — Pickup & Delivery",
        token: randomUUID(),
      });
    }
  } catch (err) {
    globalForSeed.__seeded = false;
    console.error("Seed failed", err);
  }
}
