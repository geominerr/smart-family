import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { SideNavbarComponent } from './side-navbar.component';
import { navLinks } from './nav-link.data';

describe('SideNavbarComponent', () => {
  let fixture: ComponentFixture<SideNavbarComponent>;
  let rootLoader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNavbarComponent, MatIconTestingModule, MatDialogModule],
      providers: [
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNavbarComponent);
    fixture.detectChanges();
    rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  });

  it('should contains links from nav-link-data', async () => {
    const amountLinks = navLinks.length;
    const navListItemSelector = '.nav-list__item';

    const navLinkElements = fixture.debugElement.queryAll(
      By.css(navListItemSelector)
    );

    expect(navLinkElements.length).toBe(amountLinks);
  });

  it('should open the dialog after clicking the last button', async () => {
    const dialogBeforeClick = await rootLoader.getHarnessOrNull(
      MatDialogHarness
    );
    expect(dialogBeforeClick).toBeNull();

    const navListItemSelector = '.nav-list__item';
    const navLinkElements = fixture.debugElement.queryAll(
      By.css(navListItemSelector)
    );
    const logoutButton = navLinkElements[navLinkElements.length - 1];
    logoutButton.triggerEventHandler('click');
    fixture.detectChanges();

    const dialog = await rootLoader.getHarnessOrNull(MatDialogHarness);

    expect(dialog).toBeTruthy();
  });

  it('should open the sidebar after clicking the burger button ', () => {
    const sidebarSelector = '.sidebar';
    const burgerButtonSelector = '.button--menu';
    const sidebarOpenedClass = 'sidebar--opened';

    const sidebar = fixture.debugElement.query(By.css(sidebarSelector));
    expect(sidebar.classes).not.toHaveProperty(sidebarOpenedClass);

    const burgerButton = fixture.debugElement.query(
      By.css(burgerButtonSelector)
    );
    burgerButton.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();

    expect(sidebar.classes).toHaveProperty(sidebarOpenedClass);
  });

  it('should close the sidebar after clicking the close button ', () => {
    const sidebarSelector = '.sidebar';
    const burgerButtonSelector = '.button--menu';
    const closeButtonSelector = '.button--close';
    const sidebarOpenedClass = 'sidebar--opened';

    const sidebar = fixture.debugElement.query(By.css(sidebarSelector));
    const burgerButton = fixture.debugElement.query(
      By.css(burgerButtonSelector)
    );
    const closeButton = fixture.debugElement.query(By.css(closeButtonSelector));

    burgerButton.triggerEventHandler('click', { stopPropagation: () => {} });
    fixture.detectChanges();

    expect(sidebar.classes).toHaveProperty(sidebarOpenedClass);

    closeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(sidebar.classes).not.toHaveProperty(sidebarOpenedClass);
  });
});
