export { getClientDetail, getClientDetailMock, getClientDetailServer } from './api/getClientDetail';
export { updateClientDetail, updateClientDetailMock } from './api/updateClientDetail';
export { closeClient, closeClientMock } from './api/closeClient';
export type {
  ClientLookupItem,
  ClientDetailData,
  ClientDetailResponse,
  ClientDetailUpdatePayload,
  ClientDetailUpdateResponse,
  ClientCloseReason,
  ClientClosePayload,
  ClientCloseResponse,
  CounselingChiefConcern,
  RiskReason,
} from './types/client';
