import { Routes } from '@angular/router';
import { Quiz } from './pages/quiz/quiz';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Quiz },
  { path: 'admin', component: Admin },
];
