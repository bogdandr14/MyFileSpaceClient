import { Injectable } from '@angular/core';
import { DirectoryDetailsModel } from 'src/app/file/models/directory-details.model';
import { DirectoryModel } from 'src/app/file/models/directory.model';
import { AccessLevel } from 'src/app/shared/models/access-level.enum';

@Injectable({ providedIn: 'root' })
export class UiHelperService {
  public static readonly accessibilityData = [
    { icon: 'lock-closed', color: 'tertiary', level: 'private' },
    { icon: 'link', color: 'secondary', level: 'restricted' },
    { icon: 'accessibility', color: 'success', level: 'public' },
  ];
  static sizes: Array<string> = ['B', 'KB', 'MB', 'GB', 'TB'];

  constructor() {}

  public get timeOffset() {
    const now = new Date();
    const offsetInMinutes = now.getTimezoneOffset();
    const offsetHours = Math.abs(offsetInMinutes) / 60;
    const offsetSign = offsetInMinutes >= 0 ? '-' : '+';
    const offsetFormatted = `UTC${offsetSign}${offsetHours * 2}`;
    return offsetFormatted;
  }
  
  public computeSize(size: number) {
    if (!size) {
      size = 0;
    }
    let i = 0;
    while (size > 1024) {
      size /= 1024;
      ++i;
    }
    return `${size.toFixed(2)} ${UiHelperService.sizes[i]}`;
  }
  public accessibilityColor(accessLevel: AccessLevel) {
    return UiHelperService.accessibilityData[accessLevel - 1].color;
  }

  public accessibilityIcon(accessLevel: AccessLevel) {
    return UiHelperService.accessibilityData[accessLevel - 1].icon;
  }

  public accessibilityName(accessLevel: AccessLevel) {
    return UiHelperService.accessibilityData[accessLevel - 1].level;
  }

  public objectIcon(object) {
    if (
      (object as DirectoryModel) !== undefined &&
      object.parentDirectoryId !== undefined
    ) {
      if (object.name === '$USER_ROOT') {
        return 'home';
      }
      return 'folder';
    }
    if (
      object.contentType.includes('octet-stream') ||
      object.contentType.includes('compressed')
    ) {
      return 'file-tray-full';
    }
    if (object.contentType.includes('image')) {
      return 'image';
    }
    if (object.contentType.includes('video')) {
      return 'film';
    }
    if (object.contentType.includes('text')) {
      return 'document-text';
    }
    return 'document';
  }

}
