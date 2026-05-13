import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemoRequestComponent } from '../demo-request/demo-request.component';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DmsComponent implements OnInit {

  pageTitle = "PRISUM-DMS: Featec's Efficient Distribution Management System Software";

  constructor(private meta: Meta, private title: Title,
    private modalService: NgbModal,
    private metadataService: MetadataService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Our PRISUM-DMS provides real-time data, automated claim generation, and seamless ERP and accounting integrations. Distribution software companies like Featec simplify your distribution operations and improve performance with their advanced Distributor Management System.' }
    );
    this.metadataService.loadMetadata('dms');
  }

  openDemoRequest() {
    const modalRef = this.modalService.open(DemoRequestComponent, { size: 'lg' }); // 'lg' for large modal

    // Pass applicationId and applicationName to the component
    modalRef.componentInstance.applicationId = 2;
    modalRef.componentInstance.applicationName = "DMS";
  }

  openLiveExpo() {
    window.open('http://prisum.featec.in/', '_blank');
  }

}
