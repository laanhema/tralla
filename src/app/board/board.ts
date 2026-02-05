import { Component, effect, inject, signal } from '@angular/core';
import { List } from '../list/list';
import { IBoard } from '../types/board';
import { ActivatedRoute, Router } from '@angular/router';
import { DataStore } from '../datastore';
import { TuiButtonClose, TuiShimmer } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board',
  imports: [List, TuiButtonClose, TuiButton, TuiShimmer, TuiIcon, FormsModule],
  templateUrl: './board.html',
  styleUrl: './board.less',
})
export class Board {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  dataStore = inject(DataStore);
  board = signal<IBoard | null>(null);
  boardId = signal<number | null>(null);
  isEditingTitle = signal(false);
  editedTitle = '';
  private isDown = false;
  private startX = 0;
  private scrollLeft = 0;

  constructor() {
    // Get initial route param immediately from snapshot
    const initialId = this.activatedRoute.snapshot.paramMap.get('id');
    if (initialId) {
      this.boardId.set(+initialId);
    }

    // Subscribe to route param changes to update boardId
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.boardId.set(+id);
      }
    });

    // Use effect to reactively get board from dataStore when boardId or boards change
    effect(() => {
      const id = this.boardId();
      const boards = this.dataStore.boards(); // Track boards signal
      if (id !== null) {
        const boardData = boards.find((board) => board.bid === id);
        if (boardData) {
          this.board.set(boardData);
        }
      }
    });
  }

  onMouseDown(event: MouseEvent) {
    const container = event.currentTarget as HTMLElement;
    this.isDown = true;
    container.style.cursor = 'grabbing';
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2; // Scroll speed multiplier
    container.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDown = false;
    const containers = document.querySelectorAll('.board-container');
    containers.forEach((container) => {
      (container as HTMLElement).style.cursor = 'grab';
    });
  }

  deleteBoard(id: number) {
    this.dataStore.deleteBoard(id);
    const firstBoardId = this.dataStore.getFirstBoardId();
    this.router.navigate([`board/${firstBoardId}`]); // this changes url away from the board we just deleted
  }

  createNewList() {
    this.dataStore.createNewList(this.boardId()!);
  }

  startEditingTitle() {
    this.editedTitle = this.board()!.title;
    this.isEditingTitle.set(true);
  }

  saveTitle() {
    if (this.editedTitle.trim()) {
      this.dataStore.updateBoardTitle(this.board()!.bid, this.editedTitle.trim());
    }
    this.endEditingTitle();
  }

  endEditingTitle() {
    this.isEditingTitle.set(false);
  }
}
