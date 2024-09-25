import { TodoStatusEnum } from '../enums/TodoStatusEnum';

export interface TodoModel {
  id: number;
  text: string;
  status: TodoStatusEnum;
  isEditing: boolean;
}
