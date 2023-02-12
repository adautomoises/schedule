import dayjs from "dayjs";

export interface IErrorResponse {
  message: string;
}
export interface UserNotes {
  color: "RED" | "ORANGE" | "YELLOW" | "CYAN" | "BLUE" | "PURPLE";
  date: dayjs.Dayjs | null;
  description: string;
  taskNotes: TaskProps[];
  time: dayjs.Dayjs | null;
  title: string;
  uuid: string;
}
export interface IFormInputs {
  color: string;
  descriptionNotes: string;
  descriptionTasks: string;
  title: string;
  status: string;
  datePicker: dayjs.Dayjs | null;
  timePicker: dayjs.Dayjs | null;
}
export interface TaskProps {
  description: string;
  status: string;
  uuid: string;
}
