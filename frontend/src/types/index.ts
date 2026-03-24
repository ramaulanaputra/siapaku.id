import { MBTIType, Squad } from "@/lib/mbtiData";

export interface User {
  id: string;
  google_id: string;
  email: string;
  nama: string;
  no_hp?: string;
  alamat?: string;
  tentang_diri?: string;
  profile_picture_url?: string;
  role: "user" | "admin";
  created_at: string;
}

export interface TestRecord {
  id: string;
  user_id: string;
  mbti_type: MBTIType;
  squad: Squad;
  score_ei: DimScore;
  score_sn: DimScore;
  score_tf: DimScore;
  score_jp: DimScore;
  test_date: string;
  next_test_available_date: string;
}

export interface DimScore {
  dimension: string;
  scoreA: number;
  scoreB: number;
  total: number;
  percentage: number;
  result: string;
  strength: "strong" | "moderate" | "slight";
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  package_type: "starter" | "growth" | "premium" | "merchandise";
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  total_price: number;
  payment_status: "pending" | "paid" | "failed" | "refunded" | "expired";
  order_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  tracking_number?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: Record<string, string>;
}

export interface Certificate {
  id: string;
  order_id: string;
  user_id: string;
  certificate_code: string;
  certificate_type: "starter" | "growth" | "premium";
  pdf_url?: string;
  verification_code: string;
  mbti_type: MBTIType;
  issued_date: string;
  is_valid: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  is_customizable: boolean;
  weight_grams: number;
}

export interface CertificatePackage {
  id: string;
  name: string;
  slug: string;
  price: number;
  features: string[];
}
