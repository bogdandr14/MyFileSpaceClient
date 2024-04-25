import { Component, OnInit } from '@angular/core';
import { DirectoryService } from '../services/directory.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, iif, take, tap, of } from 'rxjs';
import { DirectoryDetailsModel } from '../models/directory-details.model';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-file',
  templateUrl: './file.page.html',
  styleUrls: ['./file.page.scss'],
})
export class FilePage implements OnInit {
  public directoryDetails: DirectoryDetailsModel;
  private directoryId: Guid = Guid.createEmpty();
  private accessKey: string;
  constructor(
    private directoryService: DirectoryService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) =>
          iif<Guid, Guid>(
            () => !!params.get('id'),
            of(this.getGuid(params.get('id'))),
            this.directoryService
              .getAllDirectories()
              .pipe(
                switchMap((directories) =>
                  of(
                    directories.find(
                      (directory) => directory.name == '$USER_ROOT'
                    ).id
                  )
                )
              )
          )
        ),
        switchMap((directoryGuid) =>
          this.directoryService.getDirectoryInfo(directoryGuid)
        )
      )
      .pipe(take(1))
      .subscribe((directory) => {
        this.directoryDetails = directory;
      });
  }

  getGuid(id) {
    return id ? Guid.parse(id) : Guid.createEmpty();
  }
}
