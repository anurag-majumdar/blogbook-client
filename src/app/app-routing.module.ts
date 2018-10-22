import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuardService } from './services/auth-guard/auth-guard.service';

import { HomeComponent } from './home/home.component';
import { CreatePostComponent } from './posts/create-post/create-post.component';
import { PostsComponent } from './posts/all-posts/posts.component';
import { UpdatePostComponent } from './posts/update-post/update-post.component';
import { PostDetailsComponent } from './posts/post-details/post-details.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyPostsComponent } from './posts/my-posts/my-posts.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { SearchResultsComponent } from './search-results/search-results.component';
import { UserDetailsComponent } from './user-details/user-details.component';

const routes: Routes = [
    { path: 'user-details/:id', component: UserDetailsComponent, canActivate: [ AuthGuardService ] },
    { path: 'search-results/:query', component: SearchResultsComponent, canActivate: [ AuthGuardService ] },
    { path: 'edit-user', component: EditUserComponent, canActivate: [ AuthGuardService ] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuardService ] },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'update-post/:id', component: UpdatePostComponent, canActivate: [ AuthGuardService ] },
    { path: 'post', component: CreatePostComponent, canActivate: [ AuthGuardService ] },
    { path: 'post/:id', component: PostDetailsComponent, canActivate: [ AuthGuardService ] },
    { path: 'posts', component: PostsComponent, canActivate: [ AuthGuardService ] },
    { path: 'my-posts', component: MyPostsComponent, canActivate: [ AuthGuardService ] },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' }
]

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    providers: [ AuthGuardService ],
    exports: [ RouterModule ]
})
export class AppRoutingModule{
}