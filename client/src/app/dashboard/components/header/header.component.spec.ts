import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { By } from '@angular/platform-browser';

import { MatDialog } from '@angular/material/dialog';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { UserState } from '@app/store/user/user.reducer';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dialog: MatDialog;
  const buttonSelector = '.finance__button';
  const dataUser: UserState = {
    id: 'userId',
    username: 'username',
    email: 'mail@mail.com',
    budgetId: 'budgetId',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent, MatIconTestingModule],
      providers: [
        provideHttpClient(),
        { provide: MatDialog, useValue: { open: () => {} } },
      ],
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.user = dataUser;
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
  });

  it('should show buttons if there is a budget id', async () => {
    const buttons = fixture.debugElement.queryAll(By.css(buttonSelector));
    expect(buttons.length).toBe(2);
  });

  it('buttons should not be displayed if there is no budget id', async () => {
    fixture.componentRef.setInput('user', {
      ...dataUser,
      budgetId: undefined,
    });
    fixture.detectChanges();

    const buttonsAfter = fixture.debugElement.queryAll(By.css(buttonSelector));
    expect(buttonsAfter.length).toBeFalsy();
  });

  it('should open a dialog after clicking the button "expense"', async () => {
    const openSpyon = jest.spyOn(dialog, 'open');
    const buttons = fixture.debugElement.queryAll(By.css(buttonSelector));
    const expenseButton = buttons[0];

    expenseButton.triggerEventHandler('click', null);

    expect(openSpyon).toHaveBeenCalled();
  });

  it('should open a dialog after clicking the button "income"', async () => {
    const openSpyon = jest.spyOn(dialog, 'open');
    const buttons = fixture.debugElement.queryAll(By.css(buttonSelector));
    const incomeButton = buttons[1];

    incomeButton.triggerEventHandler('click', null);

    expect(openSpyon).toHaveBeenCalled();
  });
});
