export type {
  ClientCloseReason,
  ClientLookupItem,
  ClosedClientItem,
  ClosedClientReasonLabel,
} from '@/entities/client/model/types';

export type {
  CounselingChiefConcern,
  ClientCheckinRecord,
  ClientCounselingRecord,
  ClientDetailData,
  ClientDetailResponse,
  ClientDetailUpdatePayload,
  ClientDetailUpdateResponse,
  ClientIntakeAnswers,
  ClientRiskRecord,
  PaymentStatus,
  RiskReason,
  TaskStatus,
} from '@/features/clients/client-detail/types/client-detail';

export type {
  ClientClosePayload,
  ClientCloseResponse,
  ClientRestoreResponse,
  ClosedClientsResponse,
} from '@/features/clients/client-closure/types/client-closure';
