export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type TodoSortOption = 'date' | 'alphabetical' | 'completed';
export type TodoFilterOption = 'all' | 'active' | 'completed'; 