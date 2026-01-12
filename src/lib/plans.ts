export const PLAN_LIMITS = {
    FREE: {
        newslettersPerMonth: 5,
        maxRssFeeds: 1,
    },
    PRO: {
        newslettersPerMonth: Infinity,
        maxRssFeeds: Infinity,
    },
    ENTERPRISE: {
        newslettersPerMonth: Infinity,
        maxRssFeeds: Infinity,
    }
}

export type PlanType = keyof typeof PLAN_LIMITS;

export function getPlanLimits(plan: string | null | undefined) {
    const normalizedPlan = (plan?.toUpperCase() || 'FREE') as PlanType;
    return PLAN_LIMITS[normalizedPlan] || PLAN_LIMITS.FREE;
}
