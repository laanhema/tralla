import { Component, signal, effect, output, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { tuiAsPortal, TuiPortals, TuiAutoFocus } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiAlertService,
  TuiButton,
  TuiDataList,
  TuiDialog,
  TuiDropdown,
  TuiDropdownService,
  TuiIcon,
  TuiTextfield,
} from '@taiga-ui/core';
import { TuiAvatar, TuiFade, TuiSwitch, TuiTabs } from '@taiga-ui/kit';
import { TuiNavigation } from '@taiga-ui/layout';
import { DataStore } from '../datastore';
import { IBoard } from '../types/board';

@Component({
  selector: 'app-navigation',
  imports: [
    FormsModule,
    RouterLink,
    TuiAppearance,
    TuiAvatar,
    TuiButton,
    TuiDataList,
    TuiDialog,
    TuiDropdown,
    TuiFade,
    TuiIcon,
    TuiNavigation,
    TuiSwitch,
    TuiTabs,
    TuiTextfield,
    ReactiveFormsModule,
    TuiAutoFocus,
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.less',
  // Ignore portal related code, it is only here to position drawer inside the example block
  providers: [TuiDropdownService, tuiAsPortal(TuiDropdownService)],
})
export class Navigation extends TuiPortals {
  private dataStore = inject(DataStore);
  boards = signal<IBoard[]>([]);
  // muuttuja sitä varten kun luodaan uusi board
  newBoardName: string;
  darkModeSliderOn = signal(true);
  darkModeChangeEvent = output<boolean>();
  modalOpen = signal(false);
  router = inject(Router);
  alerts = inject(TuiAlertService);

  constructor() {
    super();
    // this-viite ei toimi ellei kutsuta super();
    this.newBoardName = '';
    // Emit fires an event whenever darkModeSliderOn changes
    effect(() => {
      this.darkModeChangeEvent.emit(this.darkModeSliderOn());
    });

    effect(() => {
      this.boards.set(this.dataStore.boards());
    });
  }

  // opens modal window
  openModalFunction() {
    this.modalOpen.set(true);
  }

  // creates a new board
  createNewBoard() {
    const newBoardId = this.dataStore.createNewBoard(this.newBoardName);
    this.modalOpen.set(false);
    this.newBoardName = '';
    this.router.navigate([`board/${newBoardId}`]);
  }

  showNotification() {
    this.alerts.open('', { label: 'Saved changes!' }).subscribe();
  }
}
