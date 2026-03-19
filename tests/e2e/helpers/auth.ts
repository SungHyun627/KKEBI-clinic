import type { BrowserContext, Page } from '@playwright/test';

export const withMockedAuthenticatedSession = async (context: BrowserContext, page: Page) => {
  await context.addInitScript(() => {
    window.localStorage.setItem(
      'kkebi-auth-session',
      JSON.stringify({
        email: 'tester@kkebi.com',
        password: 'Password123',
        userName: 'Tester',
        authenticated: true,
      }),
    );
  });

  await page.route('**/api/v1/counselor/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { accessToken: 'test-access-token' },
      }),
    });
  });

  await page.route('**/api/v1/notifications/unread/count', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: 0,
      }),
    });
  });

  await page.route(/\/api\/v1\/notifications\/subscribe(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
      body: '',
    });
  });

  await page.route('**/api/v1/counselor/dashboard/weekly-stats', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {},
      }),
    });
  });

  await page.route('**/api/v1/counselor/dashboard/today-schedule', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          schedules: [],
        },
      }),
    });
  });

  await page.route('**/api/v1/counselor/dashboard/risk-alerts', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          items: [],
        },
      }),
    });
  });

  await page.route('**/api/v1/clients?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          content: [],
          totalElements: 0,
          totalPages: 0,
        },
      }),
    });
  });

  await page.route('**/api/v1/sessions?**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {
          scheduledSessions: [],
          completedSessions: [],
        },
      }),
    });
  });

  await page.route(/\/api\/v1\/sessions\/\d+\/insights\/stream(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      headers: {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
      },
      body: '',
    });
  });

  await page.route(/\/api\/v1\/sessions\/\d+\/summary(\?.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: {},
      }),
    });
  });
};

export const withClientRegistrationDraft = async (context: BrowserContext) => {
  await context.addInitScript(() => {
    window.sessionStorage.setItem(
      'kkebi-client-registration-draft-v1',
      JSON.stringify({
        step: 'intake-interview-info',
        basicInfo: {
          name: '홍길동',
          phone: '010-1111-2222',
          email: 'test@kkebi.com',
          birthDate: '1990-01-01',
          gender: 'male',
        },
        counselingInfo: {
          counselingStartDate: '2026-03-15',
          counselingStartTime: '09:00',
          counselingEndTime: '10:00',
          chiefConcern: '불안',
          referralPath: 'search',
        },
        paymentInfo: {
          paymentType: 'insurance',
          insuranceCompany: '건강보험',
        },
        kkebiNickname: {
          kkebiNickname: '케비',
        },
        assessmentResults: {
          phq9Score: 10,
          pss10Score: 12,
          mbiScore: 20,
          additionalResults: [{ testName: 'GAD-7', testResult: 8 }],
          draftTestName: '',
        },
        intakeInterview: {
          reasonForVisit: '스트레스',
          mostImportantChange: '불안 완화',
          similarPastExperience: '있음',
          attemptedSolution: '운동',
          attemptedSolutionEffectiveness: '보통',
          currentBiggestConcern: '업무',
          averageSleepPattern: '6시간',
          sleepQuality: '보통',
          exerciseTypeAndFrequency: '걷기 주 3회',
          mealsPerDay: '3회',
          mostReliablePerson: '배우자',
          reasonForReliance: '지지',
          familyBond: '양호',
          reasonForFamilyBond: '소통',
          selfDescriptionSentence: '성실함',
        },
      }),
    );
  });
};
