/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HoldSalesComponent } from './hold-sales.component';

describe('HoldSalesComponent', () => {
  let component: HoldSalesComponent;
  let fixture: ComponentFixture<HoldSalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HoldSalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HoldSalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
