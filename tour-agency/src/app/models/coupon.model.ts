export interface Coupon {
  id: number;
  code: string;
  value: number;
  type: string;
  validFrom: string;
  validTo: string;
  isUsed: boolean;
  createdAt: string;
}
