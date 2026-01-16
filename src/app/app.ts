import { TuiRoot } from '@taiga-ui/core';
// Taiga UI root-elementti (tarvitaan jotta muutkin Taiga UI elementit toimivat)
import { Component, inject } from '@angular/core';
import { Navigation } from './navigation/navigation';
import { TUI_DARK_MODE } from '@taiga-ui/core';
import { RouterOutlet } from '@angular/router';
import { DataStore } from './datastore';

@Component({
  selector: 'app-root',
  imports: [TuiRoot, Navigation, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.less',
})
export class App {
  // signalstore
  dataStore = inject(DataStore);
  // dark-mode muuttuja
  darkMode = inject(TUI_DARK_MODE);

  // loads data from server on app start
  ngOnInit() {
    this.dataStore.loadData();
  }

  // changes darkmode on or off, uses output emit from navigation.ts
  onDarkModeChange(value: boolean) {
    this.darkMode.set(value);
  }
}
