import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { PanelMenu } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  imports: [Button, PanelMenu],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  sidebarVisible = true;

  menuItems: MenuItem[] = [
    {
      label: 'Catalogo',
      icon: 'pi pi-book',
      routerLink: ['/libri'],
    },
    {
      label: 'Magazzino',
      icon: 'pi pi-box',
      routerLink: ['/magazzino'],
    },
    {
      label: 'Gestione',
      icon: 'pi pi-cog',
      items: [
        { label: 'Autori', icon: 'pi pi-users', routerLink: ['/autori'] },
        { label: 'Generi', icon: 'pi pi-tags', routerLink: ['/generi'] },
        { label: 'Nazionalità', icon: 'pi pi-globe', routerLink: ['/nazionalita'] },
        { label: 'Case editrici', icon: 'pi pi-building', routerLink: ['/case-editrici'] },
      ],
    },
  ];

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
