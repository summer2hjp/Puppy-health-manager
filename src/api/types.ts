export type Role = 'owner' | 'vet' | 'admin';

export type LoginResponse = {
  token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    role: Role;
  };
};

export type DashboardMetrics = {
  daily_active_users: number;
  consult_conversion_rate: number;
  profile_creation_rate: number;
  pet_profile_count: number;
  open_consult_count: number;
};

export type Reminder = {
  id: number;
  pet_name: string;
  species: string;
  type: string;
  due_date: string;
  status: string;
};

export type VetQueueItem = {
  id: number;
  owner: string;
  symptom: string;
  level: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CmsSubmission = {
  id: number;
  title: string;
  author: string;
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export type PetPayload = {
  name: string;
  species: string;
  breed: string;
  age_months: number;
  weight_kg: number;
  allergy_notes?: string;
};
