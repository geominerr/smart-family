import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatProgressBarHarness } from '@angular/material/progress-bar/testing';
import { of } from 'rxjs';
import { StatusBarComponent } from './status-bar.component';

describe('StatusBarComponent', () => {
  let component: StatusBarComponent;
  let fixture: ComponentFixture<StatusBarComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [StatusBarComponent, NoopAnimationsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(StatusBarComponent);
    component = fixture.componentInstance;
    fixture.autoDetectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should not display the progress bar when isPendingResponse$ is false', async () => {
    component.isPendingResponce$ = of(false);

    const progressBar = await loader.getHarnessOrNull(MatProgressBarHarness);

    expect(progressBar).toBeNull();
  });

  it('should display the progress bar when isPendingResponse$ is true', async () => {
    component.isPendingResponce$ = of(true);

    const progressBar = await loader.getHarnessOrNull(MatProgressBarHarness);

    expect(progressBar).toBeTruthy();
  });
});
