import { Component , OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { MetadataService } from '../services/metadata.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']

})
export class PortfolioComponent implements OnInit {

  pageTitle = "Explore Featec's Products: PRISUM-SFA, DMS, and E-Retail";

  constructor(private meta: Meta, private title: Title, private metadataService: MetadataService) {
  }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Explore our key products: PRISUM-SFA for field sales management, PRISUM-DMS for streamlined distribution, and PRISUM-E-Retail for e-commerce success. Discover how Featec can enhance your business operations.' }
    );
    this.metadataService.loadMetadata('product');
  }
}
