import type { NotificationApiType, NotificationItem } from '../types/notification';

const CLIENT_DETAIL_QUERY = 'openAt';

const isRiskType = (type: NotificationApiType) => type === 'HIGH_PHQ9' || type === 'APP_INACTIVE';

export const isRiskNotification = (notification: NotificationItem) => isRiskType(notification.type);

export const getNotificationTypeLabelKey = (type: NotificationApiType) => {
  if (type === 'SCHEDULE_CHANGE_REQUEST') {
    return 'typeScheduleChange';
  }

  if (isRiskType(type)) {
    return 'typeRisk';
  }

  return 'typeIntake';
};

export const buildNotificationTargetPath = (notification: NotificationItem): string | null => {
  const referenceId = notification.referenceId;
  const openAt = `${Date.now()}`;

  if ((notification.type === 'HIGH_PHQ9' || notification.type === 'APP_INACTIVE') && referenceId) {
    return `/clients?clientId=${encodeURIComponent(referenceId)}&${CLIENT_DETAIL_QUERY}=${openAt}`;
  }

  if (notification.type === 'HIGH_PHQ9') {
    return `/clients?risk=high&${CLIENT_DETAIL_QUERY}=${openAt}`;
  }

  if (notification.type === 'INTAKE_ANALYSIS_COMPLETE' && referenceId) {
    return `/session/${encodeURIComponent(referenceId)}/summary`;
  }

  if (notification.type === 'INTAKE_ANALYSIS_READY_FOR_REVIEW' && referenceId) {
    return `/session/${encodeURIComponent(referenceId)}/summary`;
  }

  if (notification.type === 'SCHEDULE_CHANGE_REQUEST' && referenceId) {
    return `/clients?clientId=${encodeURIComponent(referenceId)}&${CLIENT_DETAIL_QUERY}=${openAt}`;
  }

  return null;
};
