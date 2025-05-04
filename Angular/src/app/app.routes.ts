import { Routes } from '@angular/router';
import { LoginPageComponent } from './Pages/login-page/login-page.component';
import { RegisterComponent } from './Pages/register-page/register-page.component';
import { AdminAllUsersPageComponent } from './Pages/admin-all-users-page/admin-all-users-page.component';
import { AdminMenuPageComponent } from './Pages/admin-menu-page/admin-menu-page.component';
import { AdminUserInfoPageComponent } from './Pages/admin-user-info-page/admin-user-info-page.component';
import { PublicChatsPageComponent } from './Pages/public-chats-page/public-chats-page.component';
import { ReportsPageComponent } from './Pages/reports-page/reports-page.component';
import { UserFriendsPageComponent } from './Pages/user-friends-page/user-friends-page.component';
import { UserProfilePageComponent } from './Pages/user-profile-page/user-profile-page.component';
import { MainPageComponent } from './Pages/main-page/main-page.component';
import { BaseUiComponent } from './Components/base-ui/base-ui.component';
import { DatabaseStatsComponent } from './Pages/database-stats/database-stats.component';

export const routes: Routes = [
  { path: '', component: LoginPageComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'admin-all-users', component: AdminAllUsersPageComponent},
  { path: 'admin-menu', component: AdminMenuPageComponent},
  { path: 'admin-user-info/:id', component: AdminUserInfoPageComponent},
  { path: 'public-chats', component: PublicChatsPageComponent},
  { path: 'reports', component: ReportsPageComponent},
  { path: 'user-friends', component: UserFriendsPageComponent},
  { path: 'user-profile', component: UserProfilePageComponent},
  { path: 'main', component: MainPageComponent},
  { path: 'base', component: BaseUiComponent},
  { path: 'database-stats', component: DatabaseStatsComponent}
];
