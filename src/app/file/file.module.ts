import { DirectoryEditComponent } from './components/directory-edit/directory-edit.component';
import { NgModule } from '@angular/core';
import { FilePageRoutingModule } from './file-routing.module';

import { FilePage } from './page/file.page';
import { FileExplorerComponent } from './components/file-explorer/file-explorer.component';
import { FileItemComponent } from './components/file-item/file-item.component';
import { SharedModule } from '../shared/shared.module';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DirectoryItemComponent } from './components/directory-item/directory-item.component';
import { NgxFileHelpersModule } from 'ngx-file-helpers';
import { ReadModePipe } from './read-mode.pipe';

@NgModule({
  imports: [SharedModule, FilePageRoutingModule, NgxFileHelpersModule],
  declarations: [
    FilePage,
    FileExplorerComponent,
    FileItemComponent,
    FileUploadComponent,
    DirectoryEditComponent,
    DirectoryItemComponent,
    ReadModePipe
  ],
})
export class FilePageModule {}
