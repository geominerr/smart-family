import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('button "all" should emit cahngeTabEvent with array ["expenses", "income"]', async () => {
    const spyOn = jest.spyOn(component.changeTabEvent, 'emit');
    const correctValue = ['expenses', 'income'];
    const buttons = await loader.getAllHarnesses(MatButtonHarness);

    await buttons[0].click();

    expect(spyOn).toHaveBeenCalledWith(correctValue);
  });

  it('button "income" should emit cahngeTabEvent with array ["income"]', async () => {
    const spyOn = jest.spyOn(component.changeTabEvent, 'emit');
    const correctValue = ['income'];
    const buttons = await loader.getAllHarnesses(MatButtonHarness);

    await buttons[1].click();

    expect(spyOn).toHaveBeenCalledWith(correctValue);
  });

  it('button "expenses" should emit cahngeTabEvent with array ["expenses"]', async () => {
    const spyOn = jest.spyOn(component.changeTabEvent, 'emit');
    const correctValue = ['expenses'];
    const buttons = await loader.getAllHarnesses(MatButtonHarness);

    await buttons[2].click();

    expect(spyOn).toHaveBeenCalledWith(correctValue);
  });
});
