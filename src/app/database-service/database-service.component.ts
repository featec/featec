import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-database-service',
  templateUrl: './database-service.component.html',
  styleUrls: ['./database-service.component.css']
})
export class DatabaseServiceComponent implements OnInit {

  pageTitle = "Complete Database Service by Featec";

  constructor(private meta: Meta, private title: Title, private metadataService: MetadataService) {
  }

  ngOnInit(): void {

    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Explore expert database service- we provide performance optimization, scalability, and 24/7 availability to ensure your database runs smoothly and efficiently. Discover reliable solutions for all your database needs with Featec.' }
    );
    this.metadataService.loadMetadata('database');
  }

}
