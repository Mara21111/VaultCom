import { Routes } from '@angular/router';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { RegisterComponent } from './Pages/register-page/register-page.component';
import { AdminAllUsersPageComponent } from './Pages/admin-all-users-page/admin-all-users-page.component';
import { AdminMenuPageComponent } from './Pages/admin-menu-page/admin-menu-page.component';
import { PublicChatsPageComponent } from './Pages/public-chats-page/public-chats-page.component';
import { ReportsPageComponent } from './Pages/reports-page/reports-page.component';
import { UserFriendsPageComponent } from './Pages/user-friends-page/user-friends-page.component';
import { UserProfilePageComponent } from './Pages/user-profile-page/user-profile-page.component';
import { MainPageComponent } from './Pages/main-page/main-page.component';
import { BaseUiComponent } from './Components/base-ui/base-ui.component';
import { DatabaseStatsComponent } from './Pages/database-stats/database-stats.component';
import { authenticationGuard } from './authentication.guard';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: '', component: LoginPageComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin-all-users', component: AdminAllUsersPageComponent, canActivate: [authenticationGuard, adminGuard]},
  { path: 'admin-menu', component: AdminMenuPageComponent, canActivate: [authenticationGuard, adminGuard]},
  { path: 'public-chats', component: PublicChatsPageComponent, canActivate: [authenticationGuard, adminGuard]},
  { path: 'reports', component: ReportsPageComponent, canActivate: [authenticationGuard, adminGuard]},
  { path: 'user-friends', component: UserFriendsPageComponent, canActivate: [authenticationGuard]},
  { path: 'user-profile', component: UserProfilePageComponent, canActivate: [authenticationGuard]},
  { path: 'main', component: MainPageComponent, canActivate: [authenticationGuard]},
  { path: 'base', component: BaseUiComponent, canActivate: [authenticationGuard, adminGuard]},
  { path: 'database-stats', component: DatabaseStatsComponent, canActivate: [authenticationGuard, adminGuard]}
];
