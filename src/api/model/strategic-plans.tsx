export type GetStrategicPlanRespond = {
  id: string;
  name: string;
  description: string;
  count: number;
  organization_id: string;
  year_end: string;
  year_start: string;
};

export const initialCalendarEvents: GetStrategicPlanRespond[] = [];
