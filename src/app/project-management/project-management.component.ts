import { Component, OnInit } from '@angular/core';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.css']
})
export class ProjectManagementComponent implements OnInit {

  constructor(private metadataService: MetadataService) {}

  ngOnInit(): void {
    this.metadataService.loadMetadata('project-mgmt');
  }
}
