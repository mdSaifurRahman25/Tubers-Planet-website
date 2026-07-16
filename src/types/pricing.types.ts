export interface PricingPlan {
    name: string;
    price: number;
    period: string;
    features: string[];
    mostPopular: boolean;
}