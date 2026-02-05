import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiButtonClose } from '@taiga-ui/kit';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';
import { Task } from '../task/task';
import { IList } from '../types/list';
import { DataStore } from '../datastore';
import { FormsModule } from '@angular/forms';
import { TuiAutoFocus } from '@taiga-ui/cdk';

@Component({
  selector: 'app-list',
  imports: [
    TuiAppearance,
    TuiButton,
    TuiCardLarge,
    TuiHeader,
    TuiTitle,
    Task,
    TuiButtonClose,
    FormsModule,
    TuiAutoFocus,
  ],
  templateUrl: './list.html',
  styleUrl: './list.less',
})
export class List {
  listData = input<IList>();
  boardId = input<number>();
  listId = input<number>();
  private dataStore = inject(DataStore);
  listContainer = viewChild<ElementRef>('listContainer');
  isEditingTitle = signal(false);
  editedTitle = '';

  createNewTask() {
    this.dataStore.createNewTask(this.boardId()!, this.listId()!);

    // Scroll to bottom after a short delay to allow DOM update
    setTimeout(() => {
      const container = this.listContainer()?.nativeElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  }

  deleteList() {
    this.dataStore.deleteList(this.boardId()!, this.listId()!);
  }

  startEditingTitle() {
    this.editedTitle = this.listData()!.title;
    this.isEditingTitle.set(true);
  }

  saveTitle() {
    if (this.editedTitle.trim()) {
      this.dataStore.updateListTitle(this.boardId()!, this.listId()!, this.editedTitle.trim());
    }
    this.endEditingTitle();
  }

  endEditingTitle() {
    this.isEditingTitle.set(false);
  }
}
