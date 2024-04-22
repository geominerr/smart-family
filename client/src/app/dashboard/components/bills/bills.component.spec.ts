import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillsComponent } from './bills.component';

describe('BillsComponent', () => {
  let component: BillsComponent;
  let fixture: ComponentFixture<BillsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BillsComponent]
    });
    fixture = TestBed.createComponent(BillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
