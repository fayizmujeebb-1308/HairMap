export type SubscriptionStatus = 'free' | 'trialing' | 'pro' | 'clinic' | 'cancelled'

export interface Profile {
  id: string
  user_id: string
  hairmap_id: string
  first_name: string
  last_name: string
  email: string
  avatar_url: string | null
  join_date: string
  hair_health_score: number | null
  hair_age: number | null
  treatment_status: string | null
  norwood_stage: number | null
  age: number | null
  gender: string | null
  country: string | null
  ethnicity: string | null
  onboarding_completed: boolean
  is_admin: boolean
  email_verified: boolean
  notification_medication: boolean
  notification_photo: boolean
  notification_reports: boolean
  paddle_customer_id: string | null
  paddle_subscription_id: string | null
  subscription_status: SubscriptionStatus
  created_at: string
  updated_at: string
}

export interface ProgressPhoto {
  id: string
  user_id: string
  angle: 'front' | 'left' | 'right' | 'top' | 'crown' | 'hairline' | 'donor'
  storage_path: string
  thumb_path: string | null
  notes: string | null
  taken_at: string
  created_at: string
}

export interface TreatmentLog {
  id: string
  user_id: string
  treatment_name: string
  treatment_type: string
  dose: string | null
  frequency: string | null
  taken_at: string
  notes: string | null
  side_effects: string | null
  created_at: string
}

export interface HairAnalysis {
  id: string
  user_id: string
  photo_id: string | null
  hair_age: number | null
  health_score: number | null
  hairline_score: number | null
  crown_score: number | null
  donor_score: number | null
  norwood_detected: number | null
  risk_flags: string[] | null
  forecast_1yr: string | null
  forecast_5yr: string | null
  forecast_10yr: string | null
  ai_recommendations: string | null
  model_used: string | null
  created_at: string
}
