import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Playlist } from '../../models/playlist';
import { PlaylistService } from '../services/playlist.service';

@Component({
  selector: 'app-playlist-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CardModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './playlist-list.component.html',
  styleUrls: ['./playlist-list.component.css'],
  providers: [MessageService],
})
export class PlaylistListComponent implements OnInit {
  playlists: Playlist[] = [];

  constructor(
    private playlistService: PlaylistService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadPlaylists();
  }

  loadPlaylists(): void {
    this.playlistService.getPlaylists().subscribe({
      next: (playlists) => (this.playlists = playlists),
      error: (err) => {
        console.error('Error al cargar las listas', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las listas de reproducción',
        });
      },
    });
  }

  navigateToCreatePlaylist(): void {
    this.router.navigate(['/playlists/create']);
  }

  viewPlaylistDetails(name: string): void {
    this.router.navigate(['/playlists', name]);
  }

  deletePlaylist(name: string): void {
    this.playlistService.deletePlaylist(name).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Lista eliminada correctamente',
        });
        this.loadPlaylists();
      },
      error: (err) => {
        console.error('Error al eliminar la lista', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar la lista',
        });
      },
    });
  }
}
