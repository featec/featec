import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemoRequestComponent } from '../demo-request/demo-request.component';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-eretail',
  templateUrl: './eretail.component.html',
  styleUrls: ['./eretail.component.scss']
})
export class EretailComponent implements OnInit {

  pageTitle = "PRISUM-E-Retail: Featec's Comprehensive E-Commerce CRM Software";

  constructor(private meta: Meta, private title: Title,
    private modalService: NgbModal,
    private metadataService: MetadataService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'PRISUM-E-Retail is our comprehensive e-retail application custom software that enhances online business operations. Benefit from advanced analytics and streamlined processes for efficient retail management.' }
    );
    this.metadataService.loadMetadata('eretail');
  }

  openDemoRequest() {
    const modalRef = this.modalService.open(DemoRequestComponent, { size: 'lg' }); // 'lg' for large modal

    // Pass applicationId and applicationName to the component
    modalRef.componentInstance.applicationId = 3;
    modalRef.componentInstance.applicationName = "E-Retailer";
  }

}
