// ngrx signalstore joka pitää sisällään kaikkien boardien, listien ja taskien tilat (muuttujat, arvot)
// sisältää myös perus create, delete, update metodit

import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { IBoard } from './types/board';
import { IList } from './types/list';
import { ITask } from './types/task';
import { DataFetchService } from './data-fetch.service';

const initialState = { boards: [] as IBoard[] };

const DataStore = signalStore(
  // globally accessible service, singleton
  { providedIn: 'root' },
  withState(initialState),

  // methods
  withMethods((store, dataFetchService = inject(DataFetchService)) => ({
    // loads data from server
    loadData() {
      dataFetchService.getAllBoards().subscribe((boards) => {
        patchState(store, { boards });
      });
    },

    // --------------------------- GET METHODS: ---------------------------

    // returns a specific board by id
    getBoardById(boardId: number): IBoard {
      const board = store.boards().find((x) => x.bid === boardId)!;
      return board;
    },

    // returns all lists for a specific board
    getListsByBoardId(boardId: number): IList[] {
      const board = store.boards().find((x) => x.bid === boardId)!;
      return board.content;
    },

    // returns all tasks for a specific list inside a specific board
    getTasksByListId(boardId: number, listId: number): ITask[] {
      const board = store.boards().find((x) => x.bid === boardId)!;
      const list = board.content.find((x) => x.lid === listId);
      return list.content;
    },
    // returns id of the first board
    getFirstBoardId(): number {
      return store.boards().at(0)!.bid;
    },

    // --------------------------- CREATE METHODS: ---------------------------

    // creates a new board and returns freshly created board id
    createNewBoard(name: string) {
      const lastUsedIndex = store.boards().at(store.boards().length - 1)!.bid;
      const newBoardId = lastUsedIndex + 1;

      const newBoard: IBoard = {
        bid: newBoardId,
        title: name,
        content: [],
      };

      const update = [...store.boards(), newBoard];
      patchState(store, { boards: update });
      return newBoardId;
    },

    // creates a new list
    createNewList(boardId: number) {
      const currentLists = this.getListsByBoardId(boardId);
      const lastUsedId = currentLists.length > 0 ? currentLists[currentLists.length - 1].lid : 1;

      const newList: IList = {
        lid: lastUsedId + 1,
        title: '',
        content: [],
      };

      const update = store.boards().map((x) => {
        if (x.bid !== boardId) return x;

        return {
          ...x,
          content: [...currentLists, newList],
        };
      });

      patchState(store, { boards: update });
    },

    // creates a new task
    createNewTask(boardId: number, listId: number) {
      const currentTasks = this.getTasksByListId(boardId, listId);
      const lastUsedId = currentTasks.length > 0 ? currentTasks[currentTasks.length - 1].tid : 1;

      const newTask: ITask = {
        tid: lastUsedId + 1,
        title: '',
        taskDone: false,
      };

      const update = store.boards().map((x) => {
        if (x.bid !== boardId) return x;

        return {
          ...x,
          content: x.content.map((x) => {
            if (x.lid !== listId) return x;

            return {
              ...x,
              content: [...currentTasks, newTask],
            };
          }),
        };
      });

      patchState(store, { boards: update });
    },

    // --------------------------- DELETE METHODS: ---------------------------

    // deletes a board
    deleteBoard(id: number) {
      const currentBoards = store.boards();

      if (currentBoards.length > 1) {
        const update = currentBoards.filter((x) => {
          return x.bid !== id;
        });

        patchState(store, { boards: update });
      } else {
        return;
      }
    },

    // deletes a list
    deleteList(boardId: number, listId: number) {
      const currentBoards = store.boards();

      const updatedLists = this.getListsByBoardId(boardId).filter((x) => {
        return x.lid !== listId;
      });

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) return x;

        return {
          ...x,
          content: updatedLists,
        };
      });

      patchState(store, { boards: update });
    },

    // deletes a task
    deleteTask(boardId: number, listId: number, taskId: number) {
      const currentBoards = store.boards();
      const currentLists = this.getListsByBoardId(boardId);
      const currentTasks = this.getTasksByListId(boardId, listId);

      const updatedTasks = currentTasks.filter((x) => {
        return x.tid !== taskId;
      });

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) {
          return x;
        }

        return {
          ...x,
          content: currentLists.map((x) => {
            if (x.lid !== listId) {
              return x;
            }

            return {
              ...x,
              content: updatedTasks,
            };
          }),
        };
      });

      patchState(store, { boards: update });
    },

    // --------------------------- UPDATE METHODS: ---------------------------

    // updates title of a specific board
    updateBoardTitle(boardId: number, newTitle: string) {
      const currentBoards = store.boards();

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) {
          return x;
        }

        return {
          ...x,
          title: newTitle,
        };
      });

      patchState(store, { boards: update });
    },

    // updates title of a specific list
    updateListTitle(boardId: number, listId: number, newTitle: string) {
      const currentBoards = store.boards();
      const currentLists = this.getListsByBoardId(boardId);

      const updatedLists = currentLists.map((x) => {
        if (x.lid !== listId) {
          return x;
        }

        return {
          ...x,
          title: newTitle,
        };
      });

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) {
          return x;
        }

        return {
          ...x,
          content: updatedLists,
        };
      });

      patchState(store, { boards: update });
    },

    // updates title of a specific task
    updateTaskTitle(boardId: number, listId: number, taskId: number, newTitle: string) {
      const currentBoards = store.boards();
      const currentLists = this.getListsByBoardId(boardId);
      const currentTasks = this.getTasksByListId(boardId, listId);

      const updatedTasks = currentTasks.map((x) => {
        if (x.tid !== taskId) {
          return x;
        }

        return {
          ...x,
          title: newTitle,
        };
      });

      const updatedLists = currentLists.map((x) => {
        if (x.lid !== listId) {
          return x;
        }

        return {
          ...x,
          content: updatedTasks,
        };
      });

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) {
          return x;
        }

        return {
          ...x,
          content: updatedLists,
        };
      });

      patchState(store, { boards: update });
    },

    // updates a task's done status (invoked when user clicks on a task checkmark)
    updateTask(boardId: number, listId: number, taskId: number) {
      const currentBoards = store.boards();
      const currentLists = this.getListsByBoardId(boardId);
      const currentTasks = this.getTasksByListId(boardId, listId);

      const update = currentBoards.map((x) => {
        if (x.bid !== boardId) {
          return x;
        }

        return {
          ...x,
          content: currentLists.map((x) => {
            if (x.lid !== listId) {
              return x;
            }

            return {
              ...x,
              content: currentTasks.map((x: ITask) => {
                if (x.tid !== taskId) {
                  return x;
                }

                // x has to be ITask so we know it has taskDone property
                // this here flips x.taskDone from done to undone and vice versa
                return {
                  ...x,
                  taskDone: !x.taskDone,
                };
              }),
            };
          }),
        };
      });

      patchState(store, { boards: update });
    },
  })),
);

// exports signalstore for usage
export { DataStore };
