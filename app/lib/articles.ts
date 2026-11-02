export type Article = {
  slug: string
  title: string
  subtitle: string
  readTime: string
  category: string
  content: Section[]
}

type Section = {
  heading?: string
  body: string
}

export const ARTICLES: Article[] = [
  {
    slug: 'what-is-dht',
    title: 'What is DHT and why does it cause hair loss?',
    subtitle: 'The hormone behind 95% of male hair loss — explained simply.',
    readTime: '4 min',
    category: 'Science',
    content: [
      {
        body: 'Dihydrotestosterone — DHT — is a hormone derived from testosterone. It is the primary driver of androgenetic alopecia, the most common form of male hair loss. Understanding it is the foundation of understanding your treatment.',
      },
      {
        heading: 'How DHT is made',
        body: 'An enzyme called 5-alpha reductase converts testosterone into DHT inside hair follicle cells. DHT is actually more potent than testosterone — it binds to androgen receptors roughly five times more tightly.',
      },
      {
        heading: 'What it does to follicles',
        body: 'In men genetically predisposed to hair loss, DHT binds to receptors in scalp follicles and triggers a process called miniaturisation. The follicle shrinks over successive growth cycles — producing finer, shorter, lighter hairs — until it eventually stops producing visible hair altogether. This process is slow but cumulative and largely irreversible once a follicle is lost.',
      },
      {
        heading: 'Why only some follicles are affected',
        body: 'Follicles at the front and crown of the scalp have far more androgen receptors than follicles at the back and sides. This is why the classic male pattern — a receding hairline and thinning crown — follows a predictable path. The hair at the back (the donor zone) is genetically resistant to DHT and almost never miniaturises.',
      },
      {
        heading: 'What this means for treatment',
        body: 'The most effective treatments work by either blocking DHT production (finasteride, dutasteride) or compensating for its effects by stimulating follicle blood supply (minoxidil). Blocking DHT is the more targeted approach — if DHT cannot bind to follicle receptors, the miniaturisation process halts.',
      },
      {
        heading: 'Key takeaway',
        body: 'Hair loss is not caused by "too much" testosterone. It is caused by genetic sensitivity of your follicles to a normal level of DHT. You cannot out-eat, out-sleep, or out-exercise this process — but you can block the mechanism driving it.',
      },
    ],
  },
  {
    slug: 'minoxidil-explained',
    title: 'Minoxidil — how it works and what to expect',
    subtitle: 'The most widely used hair loss treatment, decoded.',
    readTime: '5 min',
    category: 'Treatments',
    content: [
      {
        body: 'Minoxidil is a topical (or oral) vasodilator that was originally developed as a blood pressure medication. Its effect on hair growth was discovered by accident — patients taking it orally noticed unexpected hair growth across their body. It has since become the most commonly used hair loss treatment worldwide.',
      },
      {
        heading: 'How it works',
        body: 'Minoxidil\'s exact mechanism in hair follicles is not fully understood, but the leading theory is that it widens blood vessels around follicles, increasing the supply of oxygen and nutrients. It also appears to prolong the anagen (growth) phase of the hair cycle and may have a direct effect on follicle cell proliferation.',
      },
      {
        heading: 'What it does not do',
        body: 'Minoxidil does not block DHT. It does not address the underlying cause of hair loss — it compensates for it. This means it must be used continuously to maintain results. Stopping minoxidil causes all regrown hair to shed within 3–6 months as follicles return to their miniaturised state.',
      },
      {
        heading: 'Timeline — what to expect',
        body: 'Weeks 1–8: You may notice increased shedding. This is the shedding phase — minoxidil pushes resting follicles into the growth phase, causing them to shed their old hair first. It is normal and a sign the treatment is working.\n\nMonths 2–4: Shedding slows. New, fine hairs begin to appear.\n\nMonths 4–6: Visible improvement begins for most users. Hair appears thicker and fuller.\n\nMonths 6–12: Peak results. Most of the regrowth you will see from minoxidil occurs in the first 12 months.',
      },
      {
        heading: 'Topical vs oral',
        body: 'Topical minoxidil (2% or 5% solution or foam) is applied directly to the scalp twice daily. Oral minoxidil (0.625mg–2.5mg daily) is increasingly used off-label and may be more convenient and effective for some users, but carries a higher risk of systemic side effects including fluid retention and facial hair growth.',
      },
      {
        heading: 'Side effects',
        body: 'Topical: scalp irritation, dryness, or flaking — often from the propylene glycol carrier, not the minoxidil itself. Foam formulations cause fewer skin reactions. Systemic effects from topical use are rare but possible.\n\nOral: low blood pressure, dizziness, fluid retention, increased body hair. These are dose-dependent — lower doses (0.625mg–1.25mg) have a much milder side effect profile.',
      },
      {
        heading: 'Key takeaway',
        body: 'Minoxidil is effective, well-tolerated, and available without a prescription. It works best as part of a combined protocol — particularly alongside finasteride, which addresses the DHT cause while minoxidil compensates for it.',
      },
    ],
  },
  {
    slug: 'finasteride-explained',
    title: 'Finasteride — benefits, side effects, and timeline',
    subtitle: 'The only oral treatment with decades of evidence behind it.',
    readTime: '6 min',
    category: 'Treatments',
    content: [
      {
        body: 'Finasteride 1mg (brand name Propecia) is an oral medication that blocks 5-alpha reductase, the enzyme that converts testosterone into DHT. It reduces scalp DHT by approximately 60–70%. It is the most evidence-backed oral treatment for androgenetic alopecia.',
      },
      {
        heading: 'How it works',
        body: 'By blocking 5-alpha reductase type 2, finasteride reduces DHT levels in the bloodstream and scalp. With less DHT available to bind to follicle receptors, the miniaturisation process slows or stops. In many users, follicles that have been partially miniaturised can partially recover, producing thicker hair.',
      },
      {
        heading: 'What the evidence says',
        body: 'The landmark clinical trials showed that after 5 years of use, 90% of men taking finasteride maintained or improved their hair count, compared to 75% of those who lost hair on placebo. About 65% saw visible improvement. Finasteride is most effective at the crown and mid-scalp — less so at the hairline.',
      },
      {
        heading: 'Timeline',
        body: 'Months 1–3: No visible change. The medication is stabilising DHT levels.\n\nMonths 3–6: Hair loss slows or stops. Some early regrowth possible.\n\nMonths 6–12: Visible improvement for most users. Hair appears thicker.\n\nYear 2 onwards: Continued improvement, plateauing around years 2–3. Results are maintained as long as you continue taking it.',
      },
      {
        heading: 'Side effects',
        body: 'The most discussed side effects are sexual — reduced libido, erectile dysfunction, and decreased ejaculate volume. Clinical trials reported these in approximately 2–4% of users, similar to placebo rates in some studies. The vast majority of men take finasteride for years without sexual side effects.\n\nPost-finasteride syndrome (PFS) is a controversial condition claimed by some users who report persistent sexual or cognitive symptoms after stopping. Its existence and prevalence are debated in the medical literature. The rate is not well-established but is considered rare.',
      },
      {
        heading: 'Who should not take it',
        body: 'Finasteride is not suitable for women who are or may become pregnant — it can cause serious harm to a male foetus. It is also not recommended for men whose PSA (prostate-specific antigen) levels are being monitored, as it artificially lowers PSA, potentially masking prostate cancer.',
      },
      {
        heading: 'Key takeaway',
        body: 'Finasteride is the single most effective non-surgical option for stopping hair loss in men with androgenetic alopecia. The risk of side effects is real but overstated by online communities. For most men, the risk-benefit calculation strongly favours trying it — especially when combined with minoxidil.',
      },
    ],
  },
  {
    slug: 'norwood-scale',
    title: 'The Norwood Scale explained',
    subtitle: 'How doctors classify male pattern hair loss — and what your stage means.',
    readTime: '3 min',
    category: 'Science',
    content: [
      {
        body: 'The Norwood-Hamilton Scale is the standard classification system for male pattern hair loss. Developed by Dr James Hamilton in the 1950s and revised by Dr O\'Tar Norwood in the 1970s, it describes seven stages of progression from no visible loss to advanced balding.',
      },
      {
        heading: 'The stages',
        body: 'NW1: No significant hair loss. The hairline is in its juvenile position.\n\nNW2: Minor recession at the temples. The hairline has moved back slightly but is not significantly thinning.\n\nNW3: The first stage considered clinically significant. Deep recession at temples forming an M, U, or V shape. NW3 Vertex is a variation where early crown thinning is the primary feature.\n\nNW4: More severe temple recession with crown thinning beginning. The two affected areas are separated by a band of hair.\n\nNW5: The two areas of loss are partially connected. The band of hair between temples and crown is narrowing.\n\nNW6: The band between temple and crown is gone. One large area of hair loss across the top of the scalp.\n\nNW7: Only a horseshoe-shaped band of hair remains at the sides and back of the scalp.',
      },
      {
        heading: 'What your stage means for treatment',
        body: 'Earlier stages (NW1–3) respond better to medical treatment — there are more viable follicles to rescue. Medical treatment (finasteride + minoxidil) is most effective at halting progression and achieving some regrowth at these stages.\n\nLater stages (NW5–7) have fewer active follicles to work with. Medical treatment can still slow progression but significant regrowth is less likely. Hair transplant surgery becomes more relevant at these stages, using DHT-resistant donor hair from the back and sides.',
      },
      {
        heading: 'Limitations of the scale',
        body: 'The Norwood scale was designed for classification, not prediction. Not every NW3 will progress to NW7. Progression rate depends on genetics, age of onset, and treatment. Some men stabilise at NW3 for decades. The scale also does not capture hair density — two men at the same Norwood stage can look very different depending on how fine or coarse their remaining hair is.',
      },
      {
        heading: 'Key takeaway',
        body: 'Your Norwood stage is a useful reference point but not a destiny. The most important thing is how quickly you are progressing — and whether your current treatment is slowing or stopping that progression.',
      },
    ],
  },
  {
    slug: 'shedding-phase',
    title: 'The shedding phase — why it gets worse before it gets better',
    subtitle: 'One of the most misunderstood parts of starting treatment.',
    readTime: '3 min',
    category: 'Treatments',
    content: [
      {
        body: 'One of the most common reasons people stop their treatment too early is the shedding phase. Shortly after starting minoxidil — and sometimes finasteride — hair loss appears to accelerate. This is alarming but expected, and stopping treatment at this point is the worst thing you can do.',
      },
      {
        heading: 'Why it happens',
        body: 'Your hair follicles cycle through three phases: anagen (growth), catagen (transition), and telogen (resting/shedding). When minoxidil is introduced, it pushes follicles that are in the resting phase into the growth phase. To begin a new growth cycle, a follicle must first shed its existing hair. The result is a temporary increase in shedding as many follicles restart simultaneously.',
      },
      {
        heading: 'How long does it last',
        body: 'The shedding phase typically begins 2–8 weeks after starting treatment and lasts 4–12 weeks. For most users it is over within 3 months. The severity varies — some users barely notice it, others find it distressing. The more follicles that were in a resting phase when you started, the more pronounced the shed.',
      },
      {
        heading: 'Finasteride and shedding',
        body: 'Finasteride can also cause a mild shedding phase, though it is typically less pronounced than with minoxidil. The mechanism is similar — as DHT levels drop, follicles that were in a prolonged telogen phase are triggered to cycle again.',
      },
      {
        heading: 'How to tell the difference',
        body: 'Normal shedding phase: diffuse, short-lived (under 3 months), followed by recovery and visible improvement.\n\nTreatment not working: continued or worsening loss beyond 6 months with no signs of recovery.\n\nIf shedding continues past 3–4 months without any sign of slowing, discuss it with a dermatologist.',
      },
      {
        heading: 'Key takeaway',
        body: 'The shedding phase is not your hair falling out because of the treatment — it is your follicles being reactivated by the treatment. Push through it. Most people who quit during the shedding phase never find out that it would have worked.',
      },
    ],
  },
  {
    slug: 'ketoconazole-shampoo',
    title: 'Ketoconazole shampoo — what the evidence actually says',
    subtitle: 'A misunderstood adjunct treatment with real but limited evidence.',
    readTime: '3 min',
    category: 'Treatments',
    content: [
      {
        body: 'Ketoconazole is an antifungal medication used primarily to treat seborrheic dermatitis and dandruff. It also has a role in hair loss treatment — though a supporting one, not a frontline one.',
      },
      {
        heading: 'Why it might help',
        body: 'Ketoconazole has mild anti-androgenic properties. In the scalp, it appears to reduce local DHT activity and has anti-inflammatory effects. Chronic scalp inflammation is thought to contribute to follicle miniaturisation, so reducing it may slow hair loss progression.',
      },
      {
        heading: 'What the evidence shows',
        body: 'The most cited study (Piérard-Franchimont et al., 1998) compared 2% ketoconazole shampoo to 1% zinc pyrithione shampoo in men with androgenetic alopecia. After 6 months, both groups showed increased hair density and improved shaft diameter. The study was small (n=39) and not placebo-controlled — so the results should be interpreted cautiously.\n\nNo large, randomised, placebo-controlled trials have established ketoconazole as a standalone treatment for hair loss.',
      },
      {
        heading: 'How to use it',
        body: '2% ketoconazole shampoo (Nizoral or generic) used 2–3 times per week. Leave it on the scalp for 2–5 minutes before rinsing. Daily use is not recommended — it can cause scalp dryness and irritation.',
      },
      {
        heading: 'What it is not',
        body: 'Ketoconazole is not a replacement for finasteride or minoxidil. The evidence for it as a primary hair loss treatment is weak. It is best used as a low-cost, low-risk addition to an established protocol — particularly if you have any dandruff or scalp irritation.',
      },
      {
        heading: 'Key takeaway',
        body: 'Ketoconazole shampoo is a reasonable adjunct to your main treatment protocol. It is cheap, widely available, and has a plausible mechanism. Do not rely on it as your primary treatment — but it is worth including if you want to cover all bases.',
      },
    ],
  },
  {
    slug: 'how-long-does-treatment-take',
    title: 'How long does hair loss treatment take to work?',
    subtitle: 'Setting realistic expectations from month one.',
    readTime: '4 min',
    category: 'Progress',
    content: [
      {
        body: 'The single biggest reason people abandon effective treatment is unrealistic expectations about timeline. Hair grows slowly. The biology of follicle recovery is slow. Most treatments take 6–12 months before visible results are apparent — and this is completely normal.',
      },
      {
        heading: 'Why hair growth is slow',
        body: 'The average hair grows about 1.25cm (half an inch) per month. A follicle that has been miniaturised by DHT and then reactivated by treatment still needs to grow a new, full-diameter shaft from scratch. That takes time — and because follicles cycle asynchronously (not all at once), regrowth appears gradually rather than all at once.',
      },
      {
        heading: 'Minoxidil timeline',
        body: 'Weeks 2–8: Possible shedding phase.\nMonths 2–4: Shedding slows, early vellus (fine) hairs appear.\nMonths 4–6: First visible improvement. Hair density increases.\nMonths 6–12: Continued improvement. Peak results at 12 months.\nOngoing: Results are maintained with continued use.',
      },
      {
        heading: 'Finasteride timeline',
        body: 'Months 1–3: No visible change. DHT suppression is stabilising.\nMonths 3–6: Hair loss slows. Some men notice reduced shedding.\nMonths 6–12: Visible improvement — especially at crown.\nYear 2: Further improvement possible. Most results established by year 2.',
      },
      {
        heading: 'Combined protocol timeline',
        body: 'Using finasteride and minoxidil together typically produces better results than either alone. The mechanisms are complementary — finasteride removes the cause (DHT) while minoxidil stimulates follicle activity. Users on both typically see earlier and more significant results than either alone.',
      },
      {
        heading: 'How to measure progress',
        body: 'Consistent progress photos taken from the same angles, under the same lighting, at regular intervals (monthly) are the most reliable way to track change. Subjective daily assessment is unreliable — hair density changes too slowly to perceive day-to-day.\n\nHairMap\'s photo comparison and adherence tracking are designed for exactly this: removing the subjectivity and letting the data tell you what is actually happening.',
      },
      {
        heading: 'Key takeaway',
        body: 'Give any treatment a full 12 months before judging whether it is working. If you are logging consistently and taking monthly photos, you will have objective evidence to evaluate. Most people who see results do so between months 6 and 12 — but only if they stay consistent long enough to get there.',
      },
    ],
  },
  {
    slug: 'dutasteride-vs-finasteride',
    title: 'Dutasteride vs finasteride — is the stronger option worth it?',
    subtitle: 'A deeper DHT blocker with stronger evidence and more side effect caution.',
    readTime: '5 min',
    category: 'Treatments',
    content: [
      {
        body: 'Dutasteride is a 5-alpha reductase inhibitor like finasteride, but it blocks both type 1 and type 2 isoenzymes rather than just type 2. The result is more complete DHT suppression — roughly 90% compared to finasteride\'s 60–70%. It is approved for benign prostatic hyperplasia (BPH) and used off-label for hair loss.',
      },
      {
        heading: 'What the evidence shows',
        body: 'A large multinational trial (Olsen et al., 2006) compared dutasteride 0.5mg to finasteride 1mg and placebo in 416 men over 24 weeks. Dutasteride produced significantly greater hair count increases than finasteride at all time points. A Korean study over 6 months found similar superiority. Hair loss is not an approved indication in most countries, but many dermatologists prescribe it off-label based on this evidence.',
      },
      {
        heading: 'Side effects — what changes',
        body: 'The side effect profile of dutasteride is similar to finasteride but potentially more pronounced, given the deeper hormonal suppression. Sexual side effects (reduced libido, erectile dysfunction) are reported at similar rates in trials — roughly 2–5% — but dutasteride has a much longer half-life (5 weeks vs finasteride\'s 6 hours). This means any side effects persist longer after stopping the drug.',
      },
      {
        heading: 'Post-finasteride syndrome note',
        body: 'A small subset of men report persistent sexual or cognitive side effects after stopping finasteride — so-called post-finasteride syndrome. The mechanism is not established and the condition is contested in the medical literature, but it is real for those who experience it. Dutasteride carries a similar theoretical risk and the longer half-life means longer exposure to the hormonal change. Anyone with a history of sensitivity to finasteride should approach dutasteride with caution.',
      },
      {
        heading: 'Who should consider it',
        body: 'Dutasteride is most often considered by men who have been on finasteride for 12+ months without satisfactory results, or whose hair loss has progressed despite finasteride. It is also sometimes chosen from the start by men who want maximum DHT suppression and accept the trade-off of a longer-acting drug.',
      },
      {
        heading: 'Key takeaway',
        body: 'Dutasteride is more potent than finasteride for hair retention and regrowth. The stronger evidence is real. But the longer half-life means side effects — if they occur — take longer to resolve after stopping. Start with finasteride. Move to dutasteride with a doctor\'s guidance if you need stronger suppression.',
      },
    ],
  },
  {
    slug: 'topical-finasteride',
    title: 'Topical finasteride — lower systemic exposure, same results?',
    subtitle: 'A newer delivery method that may reduce side effect risk.',
    readTime: '4 min',
    category: 'Treatments',
    content: [
      {
        body: 'Topical finasteride applies the drug directly to the scalp rather than swallowing a tablet. The goal is to achieve high local DHT suppression in the scalp while limiting the amount of finasteride that reaches the bloodstream — potentially reducing the risk of systemic side effects.',
      },
      {
        heading: 'Does it actually reduce systemic absorption?',
        body: 'Yes, significantly. Studies show that topical finasteride produces roughly 50–75% less systemic finasteride exposure than oral dosing. This translates to less suppression of serum DHT (around 30–40% vs 60–70% for oral), but comparable scalp DHT suppression — which is what matters for hair retention.',
      },
      {
        heading: 'Evidence for efficacy',
        body: 'A 2021 randomised controlled trial published in JAMA Dermatology found topical finasteride 0.25% twice daily was non-inferior to oral finasteride 1mg daily for hair count after 24 weeks, with significantly lower serum DHT suppression. This supports the hypothesis that local scalp DHT suppression is what drives the hair benefit, not systemic suppression.',
      },
      {
        heading: 'Combined topical formulations',
        body: 'Compounding pharmacies and specialist hair loss clinics often offer topical formulations that combine finasteride with minoxidil in a single solution applied to the scalp once daily. This simplifies the treatment protocol significantly and may improve adherence. The combination approach has growing evidence and is increasingly used as a first-line protocol.',
      },
      {
        heading: 'Who should consider it',
        body: 'Topical finasteride is worth considering if you are reluctant to take an oral medication due to concerns about systemic side effects, or if you have experienced side effects on oral finasteride that were mild enough to tolerate topically. It is not widely available over-the-counter and typically requires a prescription and/or a compounding pharmacy.',
      },
      {
        heading: 'Key takeaway',
        body: 'Topical finasteride appears to be as effective as oral for hair retention with meaningfully lower systemic exposure. It is a compelling option for men who want the benefits of DHT suppression with reduced systemic risk. Ask your dermatologist — it is not a fringe option; it is increasingly mainstream.',
      },
    ],
  },
  {
    slug: 'nutrition-and-hair',
    title: 'Does diet affect hair loss? What the evidence says.',
    subtitle: 'Sorting what matters from what is marketing.',
    readTime: '5 min',
    category: 'Lifestyle',
    content: [
      {
        body: 'The supplement and "hair food" market is enormous, and mostly noise. The honest answer about nutrition and androgenetic alopecia (male pattern baldness): your diet is unlikely to cause it, and improving your diet alone is unlikely to reverse it. But nutrient deficiencies can make hair loss worse and slow regrowth — so they are worth addressing.',
      },
      {
        heading: 'What can cause hair loss through nutrition',
        body: 'Iron deficiency is the most common nutritional driver of hair loss, particularly diffuse thinning (hair loss across the whole scalp rather than patterned). Ferritin levels below 70ng/mL are associated with increased shedding. Zinc deficiency is also linked to hair loss and can be corrected with supplementation. Severe caloric restriction — crash diets, very low calorie diets — causes telogen effluvium: diffuse shedding triggered by physiological stress that typically resolves 3–6 months after normal eating resumes.',
      },
      {
        heading: 'Protein',
        body: 'Hair is made of keratin, a protein. Chronically low protein intake can impair hair growth. Most people eating a normal diet get adequate protein. Consuming more protein than adequate does not accelerate hair growth. If you are in aggressive caloric restriction or eat a restrictive diet (very low carb, vegan without planning), check that you are meeting minimum protein needs — roughly 0.8g per kg of body weight as a floor.',
      },
      {
        heading: 'Biotin — the overhyped supplement',
        body: 'Biotin (vitamin B7) deficiency can cause hair loss, but true biotin deficiency is extremely rare in people eating normally. Most people taking biotin supplements have no deficiency and derive no benefit for hair. The abundance of biotin supplements targeting hair loss is driven by marketing, not evidence. Do not waste money on high-dose biotin unless you have a confirmed deficiency.',
      },
      {
        heading: 'Vitamins D and B12',
        body: 'Vitamin D deficiency (serum 25-OH-D below 30ng/mL) is common and is associated with hair loss in several studies, though causation is not definitively established. Vitamin B12 deficiency — more common in vegans and those on long-term metformin — can contribute to hair thinning. Both are worth checking in a blood panel if you have not done so.',
      },
      {
        heading: 'What to actually do',
        body: 'Get a basic blood panel including ferritin, vitamin D, zinc, B12, and thyroid (TSH). Address any deficiencies found. Eat a diet with adequate protein and micronutrients — a normal balanced diet achieves this without supplements. Then focus your efforts where the evidence is much stronger: DHT-blocking medication and minoxidil.',
      },
      {
        heading: 'Key takeaway',
        body: 'Nutrition matters for overall hair health, but androgenetic alopecia is driven by genetics and DHT — not diet. Fix any deficiencies (iron, vitamin D, zinc, B12) and eat adequately. Beyond that, supplements will not replace medical treatment. Save the supplement budget for finasteride and minoxidil.',
      },
    ],
  },
  {
    slug: 'hair-transplant-basics',
    title: 'Hair transplants — what they are, who they are for, and when',
    subtitle: 'A clear-eyed overview of surgical restoration.',
    readTime: '6 min',
    category: 'Science',
    content: [
      {
        body: 'A hair transplant is a surgical procedure that moves DHT-resistant follicles from the back and sides of your scalp (the donor zone) to thinning or bald areas (the recipient zone). The transplanted follicles retain their genetic resistance to DHT and continue to grow in their new location permanently.',
      },
      {
        heading: 'FUE vs FUT — the two techniques',
        body: 'FUT (Follicular Unit Transplantation, also called "strip"): a strip of scalp skin is surgically removed from the donor zone, dissected into individual follicular units, and transplanted. Leaves a linear scar. Higher graft yield per session.\n\nFUE (Follicular Unit Extraction): individual follicular units are extracted one-by-one using a small punch tool. No linear scar — leaves small dot scars that are typically invisible with short hair. Slightly lower graft yield but more flexible for patients who wear their hair short. FUE is now the dominant technique globally.',
      },
      {
        heading: 'Who is a good candidate',
        body: 'Candidates for transplant should: have stable hair loss (not rapidly progressing), have an adequate donor zone (sufficient DHT-resistant follicles to harvest), be realistic about what surgery can achieve (transplants redistribute existing hair, they do not create new hair), and ideally already be on medical treatment to stabilise the remaining native hair. Age matters: operating on a 22-year-old with progressing loss risks creating an unnatural result as native hair continues to fall. Most surgeons prefer to wait until loss has significantly stabilised, typically mid-to-late 20s or later.',
      },
      {
        heading: 'What transplants cannot do',
        body: 'A transplant cannot give you the hair density you had at 18 — the donor zone has a finite supply of follicles. If you are a Norwood 6 or 7 (extensive loss), the donor supply may not cover the recipient area adequately. Transplanted hair restores coverage and density but cannot replicate the exact original density. Managing expectations here is critical.',
      },
      {
        heading: 'Medical treatment and transplants',
        body: 'A hair transplant addresses existing bald areas but does not stop your native hair from continuing to thin. This is why medical treatment (finasteride, minoxidil) is strongly recommended before, during, and after surgery — to protect the remaining native hair and preserve the result. A transplant without continued medical treatment often results in the transplanted area looking isolated as the surrounding native hair continues to recede.',
      },
      {
        heading: 'Timeline post-transplant',
        body: 'Weeks 1–2: Scabbing, redness, swelling — all normal.\nWeeks 2–4: Transplanted hairs shed. This is expected — the follicles are not lost, just resting.\nMonths 3–4: New growth begins.\nMonths 6–9: Noticeable density improvement.\nMonth 12–18: Full result visible. Continued improvement until 18 months.',
      },
      {
        heading: 'Key takeaway',
        body: 'Hair transplants offer permanent, natural-looking results for suitable candidates. The foundation should be: stable loss, realistic expectations, adequate donor zone, and a plan for continued medical treatment post-op. Surgery is not a shortcut — it works best as a complement to medical treatment, not a replacement for it.',
      },
    ],
  },
]

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug)
}

export const CATEGORIES = ARTICLES.map(a => a.category).filter((c, i, arr) => arr.indexOf(c) === i)
