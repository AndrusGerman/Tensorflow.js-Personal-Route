import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clase1Component } from './clase1.component';

describe('Clase1Component', () => {
  let component: Clase1Component;
  let fixture: ComponentFixture<Clase1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Clase1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Clase1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
