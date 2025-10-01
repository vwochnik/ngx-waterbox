import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxWaterbox } from './ngx-waterbox';

describe('NgxWaterbox', () => {
  let component: NgxWaterbox;
  let fixture: ComponentFixture<NgxWaterbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxWaterbox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxWaterbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
