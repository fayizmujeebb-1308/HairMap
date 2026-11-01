import { ARTICLES, type Article } from './articles'

export type UserContext = {
  norwoodStage: number | null
  daysTracked: number
  adherence: number
  treatmentNames: string[]   // lowercase
  isOnFinasteride: boolean
  isOnMinoxidil: boolean
  isOnKetoconazole: boolean
  streak: number
}

export type ArticleTag = {
  label: string
  style: 'green' | 'blue' | 'amber' | 'gray'
}

export type ScoredArticle = Article & {
  score: number
  tag: ArticleTag | null
  recommended: boolean
}

/* ── Score + tag each article for this user ── */
export function personalizeArticles(ctx: UserContext): ScoredArticle[] {
  return ARTICLES.map(article => {
    let score = 0
    let tag: ArticleTag | null = null

    switch (article.slug) {

      case 'what-is-dht':
        // Always useful, more so if not on a DHT blocker
        score = ctx.isOnFinasteride ? 1 : 3
        if (!ctx.isOnFinasteride && ctx.norwoodStage && ctx.norwoodStage >= 2) {
          tag = { label: 'Key read for your stage', style: 'amber' }
        }
        break

      case 'finasteride-explained':
        if (ctx.isOnFinasteride) {
          score = 2
          tag = { label: 'You\'re taking this', style: 'green' }
        } else if (ctx.norwoodStage && ctx.norwoodStage >= 2) {
          score = 4
          tag = { label: 'Recommended for NW' + ctx.norwoodStage, style: 'amber' }
        } else {
          score = 2
        }
        break

      case 'minoxidil-explained':
        if (ctx.isOnMinoxidil) {
          score = 3
          tag = { label: 'You\'re taking this', style: 'green' }
        } else {
          score = 2
          tag = { label: 'Popular first step', style: 'blue' }
        }
        break

      case 'shedding-phase':
        if (ctx.daysTracked <= 90 && (ctx.isOnMinoxidil || ctx.isOnFinasteride)) {
          score = 5
          tag = { label: 'Read this now — early days', style: 'amber' }
        } else if (ctx.daysTracked <= 90) {
          score = 3
          tag = { label: 'Early days', style: 'blue' }
        } else {
          score = 1
        }
        break

      case 'ketoconazole-shampoo':
        if (ctx.isOnKetoconazole) {
          score = 3
          tag = { label: 'You\'re using this', style: 'green' }
        } else {
          score = 1
        }
        break

      case 'norwood-scale':
        score = ctx.norwoodStage ? 2 : 4
        if (!ctx.norwoodStage) {
          tag = { label: 'Understand your stage', style: 'blue' }
        } else {
          tag = { label: `You\'re at NW${ctx.norwoodStage}`, style: 'green' }
        }
        break

      case 'how-long-does-treatment-take':
        if (ctx.daysTracked <= 180) {
          score = 4
          tag = { label: 'Set your expectations', style: 'blue' }
        } else if (ctx.adherence < 70) {
          score = 3
          tag = { label: 'Worth re-reading', style: 'amber' }
        } else {
          score = 2
        }
        break
    }

    return { ...article, score, tag, recommended: score >= 4 }
  }).sort((a, b) => b.score - a.score)
}

/* ── Per-article contextual callout shown inside the reader ── */
export type Callout = {
  heading: string
  body: string
  style: 'green' | 'blue' | 'amber'
}

export function getCallout(slug: string, ctx: UserContext): Callout | null {
  const days = ctx.daysTracked

  switch (slug) {

    case 'what-is-dht':
      if (!ctx.isOnFinasteride && ctx.norwoodStage && ctx.norwoodStage >= 2) {
        return {
          heading: `You\'re at NW${ctx.norwoodStage} without a DHT blocker`,
          body: `Your current stack does not include finasteride or dutasteride. At NW${ctx.norwoodStage}, DHT continues to miniaturise your follicles unchecked. This is worth discussing with a dermatologist.`,
          style: 'amber',
        }
      }
      if (ctx.isOnFinasteride) {
        return {
          heading: 'You\'re already blocking DHT',
          body: 'Finasteride is actively reducing your scalp DHT. This article explains the mechanism behind what your medication is doing every day.',
          style: 'green',
        }
      }
      return null

    case 'finasteride-explained':
      if (ctx.isOnFinasteride) {
        return {
          heading: `You\'ve been on finasteride for around ${days} days`,
          body: days < 90
            ? 'You\'re still in the early phase — no visible results yet is completely normal. Most men see the first signs of stabilisation at 3–6 months.'
            : days < 180
            ? 'You\'re entering the window where results become visible. Hair loss slowing or stopping is the first milestone — regrowth comes later.'
            : 'You\'ve been on finasteride long enough to have a real sense of whether it\'s working. Compare your earliest photos to your most recent.',
          style: 'green',
        }
      }
      if (ctx.norwoodStage && ctx.norwoodStage >= 2) {
        return {
          heading: `At NW${ctx.norwoodStage}, finasteride is typically the most impactful step`,
          body: 'Your current stage is where finasteride produces the clearest results. The earlier you block DHT, the more follicles you preserve. Talk to a dermatologist about whether it\'s right for you.',
          style: 'amber',
        }
      }
      return null

    case 'minoxidil-explained':
      if (ctx.isOnMinoxidil) {
        return {
          heading: `You\'re ${days} days into your treatment`,
          body: days <= 60
            ? 'You may be in or approaching the shedding phase. Increased hair fall right now is expected — it means the treatment is pushing follicles into a new growth cycle.'
            : days <= 180
            ? 'You\'re in the window where minoxidil starts to show visible results. Consistent daily application is critical — missing doses breaks the cycle.'
            : `At ${days} days, you should have a clear picture of how minoxidil is working for you. Your adherence of ${ctx.adherence}% will have directly shaped your results.`,
          style: 'green',
        }
      }
      return {
        heading: 'You\'re not currently using minoxidil',
        body: 'Minoxidil is available without a prescription and is often the first treatment dermatologists recommend alongside finasteride. It complements DHT blockers by stimulating blood supply to follicles.',
        style: 'blue',
      }

    case 'shedding-phase':
      if ((ctx.isOnMinoxidil || ctx.isOnFinasteride) && days <= 60) {
        return {
          heading: `You started treatment ${days} days ago — this article is for you`,
          body: 'If you\'re seeing more hair fall than usual, do not stop. The shedding phase is one of the most misunderstood parts of treatment. Most people who quit during this window never find out it would have worked.',
          style: 'amber',
        }
      }
      if ((ctx.isOnMinoxidil || ctx.isOnFinasteride) && days <= 120) {
        return {
          heading: 'You may have recently passed the shedding phase',
          body: `At ${days} days, the initial shed should be slowing or over for most users. If you\'re still seeing heavy shedding beyond 3 months, it\'s worth consulting a dermatologist.`,
          style: 'green',
        }
      }
      return null

    case 'ketoconazole-shampoo':
      if (ctx.isOnKetoconazole) {
        return {
          heading: 'You\'re already using ketoconazole shampoo',
          body: 'This article covers the evidence behind what you\'re using and why the 2–3 times per week frequency is the right approach.',
          style: 'green',
        }
      }
      return null

    case 'norwood-scale':
      if (ctx.norwoodStage) {
        const stageContext: Record<number, string> = {
          1: 'NW1 is no visible loss. If you\'re here proactively, you\'re in the best possible position to stay ahead of any future progression.',
          2: 'NW2 is early recession. Medical treatment at this stage has the highest chance of maintaining your current hairline.',
          3: 'NW3 is clinically significant loss. This is the stage where most dermatologists recommend starting treatment if you haven\'t already.',
          4: 'NW4 shows clear progression. A combination protocol (finasteride + minoxidil) is the standard recommendation at this stage.',
          5: 'NW5 is advanced loss. Medical treatment can slow progression, but regrowth expectations should be moderate. Hair transplant consultation may be relevant.',
          6: 'NW6 involves extensive loss across the top. Surgery options become more central at this stage alongside medical maintenance.',
          7: 'NW7 is the most advanced stage. The focus shifts to maintaining donor area health and surgical planning if desired.',
        }
        return {
          heading: `You\'re at Norwood Stage ${ctx.norwoodStage}`,
          body: stageContext[ctx.norwoodStage] ?? 'Understanding your stage helps you set realistic expectations and choose the right treatment approach.',
          style: ctx.norwoodStage <= 3 ? 'green' : ctx.norwoodStage <= 5 ? 'amber' : 'amber',
        }
      }
      return {
        heading: 'You haven\'t set your Norwood stage yet',
        body: 'Complete your hair profile in the account section to get stage-specific guidance throughout HairMap.',
        style: 'blue',
      }

    case 'how-long-does-treatment-take':
      if (days > 0) {
        const milestone = days < 90 ? 'early phase — results are not yet visible for most users'
          : days < 180 ? 'the window where first results typically appear'
          : days < 365 ? 'deep enough in treatment to expect visible changes'
          : 'past the one-year mark — your current photos tell the real story'
        return {
          heading: `You\'re ${days} days in — ${milestone}`,
          body: ctx.adherence >= 80
            ? `Your adherence is ${ctx.adherence}% — that\'s strong. Consistent treatment is the single biggest factor in whether you see results.`
            : ctx.adherence >= 50
            ? `Your adherence is ${ctx.adherence}%. Missing doses slows progress significantly — aim for daily logging to get the most from your treatment.`
            : `Your adherence is ${ctx.adherence}%. At this rate, it\'s difficult to assess whether treatment is working. Focus on consistency before evaluating results.`,
          style: ctx.adherence >= 80 ? 'green' : ctx.adherence >= 50 ? 'blue' : 'amber',
        }
      }
      return null
  }

  return null
}
