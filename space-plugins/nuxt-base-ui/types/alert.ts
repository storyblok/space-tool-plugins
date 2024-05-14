export type AlertType = 'success' | 'error' | 'info' | 'warning';

export type Alert = {
	type: AlertType;
	show: boolean;
	message: string;
};
