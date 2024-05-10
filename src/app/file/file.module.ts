import { ObjectEditComponent } from './components/object-edit/object-edit.component';
import { NgModule } from '@angular/core';
import { FilePageRoutingModule } from './file-routing.module';

import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { FileItemComponent } from './components/file-item/file-item.component';
import { SharedModule } from '../shared/shared.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DirectoryItemComponent } from './components/directory-item/directory-item.component';
import { NgxFileHelpersModule } from 'ngx-file-helpers';
import { ReadModePipe } from './read-mode.pipe';
import { ObjectDetailsComponent } from './components/object-details/object-details.component';
import { EditAccessComponent } from './components/edit-access/edit-access.component';
import { UserPageModule } from '../user/user.module';
import { AddAccessKeyComponent } from './components/add-access-key/add-access-key.component';
import { SharedFilesPage } from './pages/shared-files/shared-files.page';
import { MyFilesPage } from './pages/my-files/my-files.page';
import { BinPage } from './pages/bin/bin.page';
import { FavoritePage } from './pages/favorite/favorite.page';
import { FileListItemComponent } from './components/file-list-item/file-list-item.component';
import { ListExplorerComponent } from './components/list-explorer/list-explorer.component';
import { DirectoryListItemComponent } from './components/directory-list-item/directory-list-item.component';

@NgModule({
  imports: [
    SharedModule,
    FilePageRoutingModule,
    UserPageModule,
    NgxFileHelpersModule,
  ],
  declarations: [
    SharedFilesPage,
    MyFilesPage,
    BinPage,
    FavoritePage,
    FileExplorerComponent,
    FileItemComponent,
    FileUploadComponent,
    ObjectEditComponent,
    DirectoryItemComponent,
    ReadModePipe,
    ObjectDetailsComponent,
    EditAccessComponent,
    AddAccessKeyComponent,
    FileListItemComponent,
    ListExplorerComponent,
    DirectoryListItemComponent,
  ],
  exports: [
    FileExplorerComponent,
    ListExplorerComponent,
    ObjectDetailsComponent,
  ],
})
export class FilePageModule {}
