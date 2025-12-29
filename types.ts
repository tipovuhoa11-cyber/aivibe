
export interface Module {
  id: string;
  title: string;
  description: string;
}

export interface TargetGroup {
  title: string;
  items: string[];
}

export interface PricingInfo {
  actualValue: string;
  specialPrice: string;
  discountCode: string;
}
