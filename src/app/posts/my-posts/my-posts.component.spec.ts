import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPostsComponent } from './my-posts.component';

describe('MyPostComponent', () => {
  let component: MyPostsComponent;
  let fixture: ComponentFixture<MyPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
