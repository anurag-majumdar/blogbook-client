import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { TagInputModule } from 'ngx-chips';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MaterializeModule } from 'ng2-materialize';

import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { ServicesModule } from './services';

import { AppComponent } from './app.component';
import { PostsComponent } from './posts/all-posts/posts.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { UpdatePostComponent } from './posts/update-post/update-post.component';
import { PageFooterComponent } from './page-footer/page-footer.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UserDetailsComponent } from './user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    PostsComponent,
    NavbarComponent,
    HomeComponent,
    PostDetailsComponent,
    CreatePostComponent,
    UpdatePostComponent,
    PageFooterComponent,
    SignUpComponent,
    LoginComponent,
    DashboardComponent,
    MyPostsComponent,
    EditUserComponent,
    SearchResultsComponent,
    UserDetailsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TagInputModule,
    FormsModule,
    HttpModule,
    ServicesModule,
    AppRoutingModule,
    MaterializeModule.forRoot()
  ],
  providers: [ DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { 
}
