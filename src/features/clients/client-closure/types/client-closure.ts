import type {
  ClientCloseReason,
  ClosedClientItem,
  ClosedClientReasonLabel,
} from '@/entities/client/model/types';

export interface ClientClosePayload {
  reason: ClientCloseReason;
  detail: string;
}

export interface ClientCloseResponse {
  success: boolean;
  data?: {
    clientId: string;
    reason: ClientCloseReason;
    detail: string;
    closedAt: string;
  };
  message?: string;
}

export interface ClientRestoreResponse {
  success: boolean;
  data?: {
    clientId: string;
    restoredAt: string;
  };
  message?: string;
}

export interface ClosedClientsResponse {
  success: boolean;
  data?: ClosedClientItem[];
  message?: string;
}

export type { ClientCloseReason, ClosedClientItem, ClosedClientReasonLabel };
