import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  AsyncPipe,
  DatePipe,
  NgFor,
  NgIf,
  TitleCasePipe,
} from '@angular/common';
import { Observable } from 'rxjs';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { Store } from '@ngrx/store';
import { selectUser } from '@app/store/user/user.selectors';
import { UserState } from '@app/store/user/user.reducer';
import { User } from '@app/shared/models/user.model';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe,
    TitleCasePipe,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
  ],
})
export class PorfileComponent implements OnInit {
  user$: Observable<UserState> | undefined;

  fields: string[] = ['username', 'email', 'createdAt', 'updatedAt'];

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectUser);
  }

  getEntries(data: UserState) {
    return this.fields.map((field) => [
      field,
      data?.[field as keyof UserState]?.toString(),
    ]);
  }
}
