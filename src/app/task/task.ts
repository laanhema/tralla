import { Component, effect, inject, input, signal } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { ITask } from '../types/task';
import { DataStore } from '../datastore';
import { TuiButtonClose } from '@taiga-ui/kit';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  imports: [TuiButton, TuiButtonClose, FormsModule],
  templateUrl: './task.html',
  styleUrl: './task.less',
})
export class Task {
  taskData = input<ITask>();
  boardId = input<number>();
  listId = input<number>();
  taskId = input<number>();
  taskDone = signal(false);
  private dataStore = inject(DataStore);
  isEditingTitle = signal(false);
  editedTitle = '';

  constructor() {
    // Watch for changes in taskData and update taskDone accordingly
    effect(() => {
      const data = this.taskData();
      if (data) {
        this.taskDone.set(data.taskDone);
      }
    });
  }

  taskClicked() {
    this.dataStore.updateTask(this.boardId()!, this.listId()!, this.taskId()!);
  }

  deleteTask() {
    this.dataStore.deleteTask(this.boardId()!, this.listId()!, this.taskId()!);
  }

  startEditingTitle() {
    this.editedTitle = this.taskData()!.title;
    this.isEditingTitle.set(true);
  }

  saveTitle() {
    if (this.editedTitle.trim()) {
      this.dataStore.updateTaskTitle(
        this.boardId()!,
        this.listId()!,
        this.taskId()!,
        this.editedTitle.trim()
      );
    }
    this.endEditingTitle();
  }

  endEditingTitle() {
    this.isEditingTitle.set(false);
  }
}
