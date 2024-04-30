import { AccessLevel } from 'src/app/shared/models/access-level.enum';
import { Component, Input, OnInit } from '@angular/core';
import { FileDetailsModel } from '../../models/file-details.model';
import { DirectoryDetailsModel } from '../../models/directory-details.model';
import { UserService } from 'src/app/user/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-object-details',
  templateUrl: './object-details.component.html',
  styleUrls: ['./object-details.component.scss'],
})
export class ObjectDetailsComponent {
  @Input() objectDetails: any;
  @Input() isFile: boolean = false;
  public static readonly accessibilityData = [
    { icon: 'lock-closed', color: 'tertiary', level: 'private' },
    { icon: 'link', color: 'secondary', level: 'restricted' },
    { icon: 'accessibility', color: 'success', level: 'public' },
  ];

  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];


  get size() {
    let size = this.objectDetails.sizeInBytes;
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${ObjectDetailsComponent.sizes[i]}`;
  }
  get accessibilityColor() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].color;
  }
  get accessibilityIcon() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].icon;
  }
  get accessibilityName() {
    return ObjectDetailsComponent.accessibilityData[
      this.objectDetails.accessLevel - 1
    ].level;
  }
  get icon() {
    if (this.objectDetails instanceof DirectoryDetailsModel) {
      return 'folder';
    }
    if (
      this.objectDetails.contentType.includes('octet-stream') ||
      this.objectDetails.contentType.includes('compressed')
    ) {
      return 'file-tray-full';
    }
    if (this.objectDetails.contentType.includes('image')) {
      return 'image';
    }
    if (this.objectDetails.contentType.includes('video')) {
      return 'film';
    }
    if (this.objectDetails.contentType.includes('text')) {
      return 'document-text';
    }
    return 'document';
  }
  get isOwner() {
    return this.userService.isCurrentUser(this.objectDetails.ownerId);
  }
  constructor(private userService: UserService,private datePipe: DatePipe) {}

  get timeOffset(): string {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(offsetInMinutes) / 60;
    const offsetSign = offsetInMinutes >= 0 ? '-' : '+';
    const offsetFormatted = `UTC${offsetSign}${offsetHours*2}`;
    return offsetFormatted;
  }


  copyOwner() {
    console.log(this.objectDetails.ownerId);
  }
}
