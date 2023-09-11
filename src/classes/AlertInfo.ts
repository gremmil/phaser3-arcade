
export class AlertInfo {
  message: string = '';
  action: AlertInfoAction;
}
export type AlertInfoAction = 'restart' | 'resume' | 'next' | 'reload';
