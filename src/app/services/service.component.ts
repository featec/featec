import { Component , OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services/metadata.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit {

  pageTitle = "Featec's Services- Custom Solutions for Mobile, Web, and Data Management and Analytics";

  constructor(private meta: Meta, private title: Title, private metadataService: MetadataService){
  }
  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Featec builds scalable, efficient solutions that enhance your business performance. Discover how our tailored services can drive success for your business. Contact us today to learn more.' }
    );
    this.metadataService.loadMetadata('services');
  }
}
