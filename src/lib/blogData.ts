// ============================================================
// FILE: src/lib/blogData.ts
// Static content source for the AquaGas Blog.
// Swap this out for a CMS/API call later — the page components
// only depend on the shapes exported below.
// ============================================================

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  authorRole: string;
  date: string; // ISO date
  readTime: string;
  featured?: boolean;
  coverGradient: [string, string]; // used instead of a stock photo
  content: BlogBlock[];
}

export type BlogCategory =
  | 'Safety'
  | 'How-To'
  | 'Technology'
  | 'Payments'
  | 'Company News'
  | 'Sustainability';

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; title: string; text: string };

export const CATEGORIES: BlogCategory[] = [
  'Safety',
  'How-To',
  'Technology',
  'Payments',
  'Company News',
  'Sustainability',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'lpg-safety-tips-kenyan-households',
    title: '7 LPG Safety Habits Every Kenyan Household Should Practice',
    excerpt:
      "Cooking gas is safe when it's handled correctly. Here's a practical, no-jargon checklist for storing, connecting and using your cylinder without worry.",
    category: 'Safety',
    author: 'AquaGas Team',
    authorRole: 'Customer Safety Desk',
    date: '2026-06-18',
    readTime: '6 min read',
    featured: true,
    coverGradient: ['#0A3D2B', '#123F2C'],
    content: [
      {
        type: 'p',
        text: "Every year, avoidable gas incidents in Kenyan homes make headlines — and almost all of them trace back to two or three small habits, not faulty cylinders. LPG itself is one of the safest cooking fuels in the world when the basics are respected. This guide walks through what actually matters, in the order it matters.",
      },
      { type: 'h2', text: '1. Store the cylinder upright, never on its side' },
      {
        type: 'p',
        text: "LPG cylinders are designed to release gas, not liquid, through the valve when standing upright. Lay one on its side and there's a real risk of liquid LPG escaping instead of vapour — which expands violently and is far harder to control. Keep your cylinder standing on a flat, stable surface at all times, including during transport.",
      },
      { type: 'h2', text: '2. Keep it in a ventilated spot, away from heat' },
      {
        type: 'p',
        text: 'LPG is heavier than air, so if it ever leaks it settles low and can collect in enclosed spaces. Place your cylinder somewhere with airflow near floor level — never in a sealed cupboard, and never next to a jiko, heater, or direct sunlight. A simple kitchen corner with a gap under the door is usually enough.',
      },
      { type: 'h2', text: '3. Do the soapy water test after every reconnection' },
      {
        type: 'p',
        text: "This is the single most useful five-minute habit you can build. Mix a little water with dish soap, brush it over the regulator connection and hose, and open the valve slightly. Bubbles forming means a leak — close the valve immediately and do not light anything. No bubbles, no smell, you're good to cook.",
      },
      {
        type: 'callout',
        title: 'Trust your nose first',
        text: "LPG suppliers add a strong sulphur-like odorant specifically so leaks are noticeable before they're dangerous. If you smell gas, don't search for the source with a lighter or matchstick — open windows, don't switch on any electrical switch, shut the cylinder valve, and get everyone outside.",
      },
      { type: 'h2', text: '4. Check the hose and regulator, not just the cylinder' },
      {
        type: 'p',
        text: "Most leaks happen at the connection points, not inside the cylinder itself. Rubber hoses perish over time — replace yours every couple of years, or sooner if it feels stiff, cracked, or has visible wear near the clamps. A worn hose is a cheaper fix than a kitchen fire.",
      },
      { type: 'h2', text: '5. Turn off the cylinder valve, not just the burner' },
      {
        type: 'list',
        items: [
          "Get into the habit of closing the cylinder valve overnight and whenever you'll be out for a while.",
          'This means even if a burner knob is accidentally bumped, gas cannot flow.',
          "It also lets you confirm the hose holds pressure — if the flame doesn't die out instantly when you shut the valve, get it inspected.",
        ],
      },
      { type: 'h2', text: '6. Only ever buy from verified, sealed cylinders' },
      {
        type: 'p',
        text: "Tampered seals, underweight refills, and swapped valves are how unsafe cylinders end up in kitchens. This is precisely why AquaGas partners exclusively with verified vendors and why every cylinder on our platform is tracked from fill to doorstep — you can see exactly which outlet and batch your gas came from inside the app.",
      },
      { type: 'h2', text: '7. Know your three steps if something goes wrong' },
      {
        type: 'list',
        items: [
          'Shut the cylinder valve first — this stops the source, not just the flame.',
          "Don't touch electrical switches; a spark is what turns a leak into a fire.",
          'Ventilate the room by opening doors and windows, then move everyone outside before calling for help.',
        ],
      },
      {
        type: 'p',
        text: "None of this is meant to make LPG feel scary — millions of Kenyan households cook on it safely every single day. The habits above take a few minutes to build and then become second nature. If you'd rather not think about any of it, ordering through a platform that verifies every vendor and cylinder is the simplest safety upgrade you can make.",
      },
    ],
  },
  {
    slug: 'how-aquagas-tracking-works',
    title: 'From Tap to Doorstep: How Real-Time Tracking Works on AquaGas',
    excerpt:
      "You've watched a boda rider dot move across a map for food delivery — here's how the same idea works for something as essential as your cooking gas, and why it matters more than you'd think.",
    category: 'Technology',
    author: 'AquaGas Engineering',
    authorRole: 'Product & Platform',
    date: '2026-06-05',
    readTime: '5 min read',
    coverGradient: ['#0A3D2B', '#1B5940'],
    content: [
      {
        type: 'p',
        text: "Before AquaGas, ordering gas in most of Nairobi looked the same way it has for a decade: call a supplier, quote a landmark instead of an address, and wait — with no real idea whether your delivery is five minutes away or hasn't left the shop yet. We built our tracking system to close that gap.",
      },
      { type: 'h2', text: 'What happens the moment you place an order' },
      {
        type: 'list',
        items: [
          'Your order is matched to the nearest verified vendor with your cylinder size in stock — not just the biggest or best-known one.',
          "A rider is assigned and the app immediately shows their name, rating, and a live ETA based on distance and Nairobi's real traffic patterns.",
          'Every status change — confirmed, picked up, en route, arrived — updates instantly on your screen and, if you allow it, as a notification.',
        ],
      },
      { type: 'h2', text: 'The map view is more than a nice animation' },
      {
        type: 'p',
        text: "The live map on your order screen pulls the rider's actual GPS position, refreshed continuously, so the ETA adjusts in real time rather than showing a static estimate calculated once at checkout. If traffic on Waiyaki Way backs up, your ETA reflects that instead of quietly going stale.",
      },
      { type: 'h2', text: 'Why this matters beyond convenience' },
      {
        type: 'p',
        text: "Transparency changes behaviour on both sides. Riders know their route is visible, which keeps deliveries direct and accountable. Customers can plan around an accurate window instead of staying pinned near the gate for hours. And because every delivery is logged with timestamps and location data, disputes — a rare but real part of any delivery business — get resolved with evidence instead of guesswork.",
      },
      {
        type: 'callout',
        title: 'Under the hood',
        text: "Rider positions stream over a lightweight socket connection rather than the app repeatedly polling the server, which keeps battery drain low for riders doing a full day of deliveries and keeps your tracking screen smooth even on a modest connection.",
      },
      { type: 'h2', text: "What's next" },
      {
        type: 'p',
        text: "We're extending the same tracking infrastructure to cylinder-level data — smart valve sensors that can flag a near-empty cylinder before you run out, and eventually suggest a reorder automatically. Delivery transparency was step one. Consumption transparency is next.",
      },
    ],
  },
  {
    slug: 'mpesa-gas-delivery-cashless-kenya',
    title: 'M-Pesa and Gas: Why Cashless Payments Are a Bigger Deal Than They Seem',
    excerpt:
      'Paying for gas with M-Pesa feels routine now — but the shift away from cash-on-delivery solved real problems for customers, vendors, and riders alike.',
    category: 'Payments',
    author: 'AquaGas Team',
    authorRole: 'Payments & Operations',
    date: '2026-05-22',
    readTime: '4 min read',
    coverGradient: ['#123F2C', '#0A3D2B'],
    content: [
      {
        type: 'p',
        text: "Not long ago, ordering gas meant having exact change ready, or a rider carrying enough coins to break a KES 1,000 note at your gate. It sounds minor until you count how often it caused delays, disputes, or outright cancelled deliveries.",
      },
      { type: 'h2', text: 'What cash-on-delivery actually cost everyone' },
      {
        type: 'list',
        items: [
          'Riders carrying cash were an easy target, especially on evening deliveries.',
          'Vendors had to reconcile cash at the end of each day, with no clean audit trail.',
          "Customers without exact change often delayed their own delivery, or overpaid and had to chase a refund.",
        ],
      },
      { type: 'h2', text: 'How M-Pesa via Pesapal fits into the AquaGas flow' },
      {
        type: 'p',
        text: "When you check out on AquaGas, your payment is processed through Pesapal, which handles the M-Pesa STK push directly to your phone — you approve the exact amount from your own device, and the order confirms only once payment clears. No rider ever needs to handle your cash, and no one is trusting a screenshot as proof of payment.",
      },
      {
        type: 'callout',
        title: 'Why this protects you, not just us',
        text: "Because the charge originates from your own M-Pesa PIN entry, you're never asked to 'send money to this number first' — a pattern scammers rely on. Legitimate AquaGas payments always happen inside the app or via the official STK prompt tied to your order.",
      },
      { type: 'h2', text: 'The AquaGas Wallet' },
      {
        type: 'p',
        text: "For customers who reorder often — households, kiosks, small restaurants — we added a wallet you can top up once and draw down from on future orders. It removes the need to authorize a new M-Pesa payment every single time, while keeping the same transaction history and receipts you'd expect from any digital payment.",
      },
      {
        type: 'p',
        text: "None of this is about replacing cash out of principle. It's that a delivery business built on trust needed a payment method that leaves a trail, protects riders, and confirms instantly — and for Kenya, that method was already sitting in everyone's pocket.",
      },
    ],
  },
  {
    slug: '6kg-vs-13kg-cylinder-guide',
    title: "6kg or 13kg? A Straight Answer to Kenya's Most Common Gas Question",
    excerpt:
      "The 'right' cylinder size depends on your household size and cooking habits more than anything else. Here's how to actually work it out.",
    category: 'How-To',
    author: 'AquaGas Team',
    authorRole: 'Customer Support',
    date: '2026-05-10',
    readTime: '5 min read',
    coverGradient: ['#072A1E', '#0A3D2B'],
    content: [
      {
        type: 'p',
        text: "This is the single most common question we get from new customers, and the honest answer is: it depends on how many meals you cook a day and how many people you're cooking for — not on which size 'feels' more economical on the shelf.",
      },
      { type: 'h2', text: 'The 6kg cylinder' },
      {
        type: 'list',
        items: [
          'Best for 1–3 person households, students, or bedsitters with limited storage space.',
          'Typically lasts 3–5 weeks for light daily cooking — tea, ugali, one or two hot meals a day.',
          'Lower upfront refill cost, which suits tighter, more frequent budgeting.',
          'Lighter to carry and easier to store in small kitchens or on a shelf.',
        ],
      },
      { type: 'h2', text: 'The 13kg cylinder' },
      {
        type: 'list',
        items: [
          'Better suited to families of 4 or more, or households that cook multiple heavy meals daily.',
          'Works out cheaper per kilogram of gas than buying 6kg refills twice as often.',
          'Fewer reorders means fewer delivery trips to schedule around.',
          'Needs a bit more floor space and is heavier to move, which matters if you carry it yourself between rooms.',
        ],
      },
      { type: 'h2', text: 'A simple way to decide' },
      {
        type: 'p',
        text: "Track how long your current cylinder actually lasts, divide the refill price by the number of weeks it gave you, and compare that to the other size's weekly cost using AquaGas's live pricing in the app. For most single people and couples, 6kg wins on flexibility. For families and anyone running a small food business, 13kg almost always wins on total cost per meal.",
      },
      {
        type: 'callout',
        title: 'Not sure yet? Start smaller.',
        text: "If you're moving into a new place or just switched suppliers, start with a 6kg cylinder for your first order. It's easier to size up once you know your actual usage pattern than to be stuck with a half-used 13kg cylinder you didn't need.",
      },
      { type: 'h2', text: 'What about 3kg and 25kg?' },
      {
        type: 'p',
        text: "3kg cylinders exist mainly as a low-cost entry point or backup for travel and camping — not a primary household size. On the other end, 25kg and larger are built for commercial kitchens, restaurants, and institutions with continuous cooking demand. AquaGas vendors stock both, and business accounts get volume pricing on the larger sizes.",
      },
    ],
  },
  {
    slug: 'refill-vs-swap-true-cost-of-cooking-gas',
    title: 'Refill vs. Swap: The True Cost of Cooking Gas in Kenya',
    excerpt:
      "Swapping your empty cylinder for a full one feels convenient, but it isn't always the cheaper option. Here's the maths most people never actually do.",
    category: 'How-To',
    author: 'AquaGas Team',
    authorRole: 'Customer Support',
    date: '2026-04-28',
    readTime: '5 min read',
    coverGradient: ['#0A3D2B', '#173B29'],
    content: [
      {
        type: 'p',
        text: "There are two ways to get more gas in Kenya: swap your empty cylinder for a pre-filled one at a stall, or have your own cylinder refilled by weight. Most people default to whichever is closest, but the two models have real, predictable cost differences worth knowing.",
      },
      { type: 'h2', text: 'How cylinder swapping works' },
      {
        type: 'p',
        text: "You hand over your empty branded cylinder and pay for an already-full one in exchange. It's fast and requires no waiting — but you're paying for the vendor's inventory convenience, and swapped cylinders don't always come from a source you can verify.",
      },
      { type: 'h2', text: 'How refilling works' },
      {
        type: 'p',
        text: "Your own cylinder is weighed empty, filled to its rated capacity, and weighed again to confirm the exact quantity you received and paid for. This is the model AquaGas vendors use — every refill on the platform shows the before-and-after weight in your order history.",
      },
      { type: 'h2', text: 'Where the real cost difference comes from' },
      {
        type: 'list',
        items: [
          "Swap stalls often underfill cylinders slightly to protect their margin — a widely known industry issue that's genuinely hard for a customer to detect by eye.",
          'Refilling by verified weight means you pay for exactly what goes in, no more and no less.',
          "Swapping also puts you at the mercy of whatever condition that particular cylinder is in — valve wear, dents, or an older manufacture date you can't inspect before the swap.",
        ],
      },
      {
        type: 'quote',
        text: 'A cylinder that reads full on the outside can still be several hundred grams short on the inside — the only way to know for sure is a verified weigh-in.',
      },
      { type: 'h2', text: 'So which should you choose?' },
      {
        type: 'p',
        text: "If speed is your only priority and you trust your local stall, swapping is fine. But if you want price certainty and to keep the same cylinder you know is in good condition, refilling through a verified vendor is the more predictable choice — and it's why every AquaGas refill order shows you the exact weight delivered, not just a price.",
      },
    ],
  },
  {
    slug: 'small-business-gas-supply-reliability',
    title: "Why Reliable Gas Supply Is a Business Problem, Not Just a Kitchen Problem",
    excerpt:
      "For a mama fua joint, a small hotel, or a chapati stall, a delayed gas delivery isn't an inconvenience — it's lost revenue. Here's how to plan around it.",
    category: 'Company News',
    author: 'AquaGas Team',
    authorRole: 'Vendor & Business Accounts',
    date: '2026-04-12',
    readTime: '4 min read',
    coverGradient: ['#1B5940', '#0A3D2B'],
    content: [
      {
        type: 'p',
        text: "For a household, running out of gas means an inconvenient trip to a shop. For a small food business, it means turning away customers, wasting prepped ingredients, or scrambling to borrow a cylinder from a neighbour mid-service. We built AquaGas's business features specifically because this risk is completely avoidable with a bit of planning.",
      },
      { type: 'h2', text: 'The pattern we see most often' },
      {
        type: 'p',
        text: "Most small food businesses order gas reactively — when the flame starts sputtering, not before. That works fine until a delivery is delayed by traffic, stock shortage, or a public holiday rush, and suddenly there's no buffer left at all.",
      },
      { type: 'h2', text: 'Three habits that remove the risk' },
      {
        type: 'list',
        items: [
          'Keep a spare cylinder as a buffer, even if it costs a little more upfront — treat it as insurance against lost trading hours.',
          'Order at a fixed usage threshold (e.g. when your active cylinder is roughly a third full) rather than waiting for it to run dry.',
          'Use scheduled or recurring orders where your usage is predictable — many AquaGas business accounts set a weekly delivery day and never think about it again.',
        ],
      },
      { type: 'h2', text: 'What business accounts get on AquaGas' },
      {
        type: 'list',
        items: [
          'Volume pricing on 13kg and larger cylinders for consistent, higher-usage ordering.',
          'Priority vendor matching so repeat business orders aren\'t queued behind one-off household orders during peak hours.',
          'Consolidated invoicing, which makes monthly expense tracking far less painful than loose receipts.',
        ],
      },
      {
        type: 'callout',
        title: 'Worth doing today',
        text: "If gas is a recurring cost for your business, the highest-leverage change you can make this week is simply switching from reactive ordering to a fixed reorder threshold. It costs nothing and removes almost all delivery-related downtime.",
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getFeaturedPost(): BlogPost {
  return blogPosts.find((p) => p.featured) ?? blogPosts[0];
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, count = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return getAllPosts().slice(0, count);

  const sameCategory = blogPosts.filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = blogPosts.filter(
    (p) => p.slug !== slug && p.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
