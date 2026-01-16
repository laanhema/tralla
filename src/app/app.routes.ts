// application routes

import { Routes } from '@angular/router';
import { Board } from './board/board';
import { inject } from '@angular/core';
import { DataStore } from './datastore';

const routes: Routes = [
  // writing just "/" to url bar redirects to board 1 by default (board 1 cannot be deleted, there has to be at least one board)
  {
    path: '',
    redirectTo: () => {
      const dataStore = inject(DataStore);
      const firstBoardId = dataStore.boards()[0].bid;
      return `/board/${firstBoardId}`;
    },
    pathMatch: 'full',
  },
  // just basic routes for individual boards
  {
    path: 'board/:id',
    component: Board,
  },
];

export { routes };
