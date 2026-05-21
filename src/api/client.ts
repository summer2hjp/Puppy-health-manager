import { apiRequest } from './http';
import type {
  CmsSubmission,
  DashboardMetrics,
  LoginResponse,
  PetPayload,
  Reminder,
  VetQueueItem
} from './types';

export function login(username: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password }
  });
}

export function getDashboardMetrics(token: string): Promise<DashboardMetrics> {
  return apiRequest<DashboardMetrics>('/dashboard/metrics', { token });
}

export function createPet(token: string, payload: PetPayload): Promise<{ id: number }> {
  return apiRequest<{ id: number }>('/pets', {
    method: 'POST',
    token,
    body: payload
  });
}

export function getOwnerReminders(token: string): Promise<Reminder[]> {
  return apiRequest<Reminder[]>('/user/reminders', { token });
}

export function getVetQueue(token: string): Promise<VetQueueItem[]> {
  return apiRequest<VetQueueItem[]>('/vet/queue', { token });
}

export function getCmsSubmissions(token: string): Promise<CmsSubmission[]> {
  return apiRequest<CmsSubmission[]>('/cms/submissions', { token });
}

export function patchCmsSubmissionStatus(
  token: string,
  submissionId: number,
  status: CmsSubmission['status']
): Promise<CmsSubmission> {
  return apiRequest<CmsSubmission>(`/cms/submissions/${submissionId}`, {
    method: 'PATCH',
    token,
    body: { status }
  });
}
