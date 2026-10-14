export interface BackgroundAlertOptions {
  title: string;
  body: string;
}

export interface IBackgroundAlertService {
  scheduleAlert: (options: BackgroundAlertOptions, triggerSeconds: number) => Promise<void>;
  cancelAlerts: () => Promise<void>;
}

export const backgroundAlertService: IBackgroundAlertService = {
  scheduleAlert: async (_options: BackgroundAlertOptions, _triggerSeconds: number): Promise<void> => {
    // TODO: Implement
  },
  cancelAlerts: async (): Promise<void> => {
    // TODO: Implement
  },
};
