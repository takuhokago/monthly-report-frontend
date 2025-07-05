import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-approve-confirm-dialog',
  templateUrl: './approve-confirm-dialog.component.html',
  styleUrls: ['./approve-confirm-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
})
export class ApproveConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ApproveConfirmDialogComponent>) {}

  approve(): void {
    this.dialogRef.close('approve');
  }

  deny(): void {
    this.dialogRef.close('deny');
  }

  close(): void {
    this.dialogRef.close(null);
  }
}
