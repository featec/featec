// import { Component, OnInit } from '@angular/core';
// import { Meta, Title } from '@angular/platform-browser';
// import { DemoRequestComponent } from '../demo-request/demo-request.component';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { MetadataService } from '../services/metadata.service';

// @Component({
//   selector: 'app-sfa',
//   templateUrl: './sfa.component.html',
//   styleUrls: ['./sfa.component.scss']
// })
// export class SFAComponent implements OnInit {

//   pageTitle = "PRISUM-SFA: Comprehensive Sales Force Automation Software";

//   constructor(private meta: Meta, private title: Title,
//     private modalService: NgbModal,
//     private metadataService: MetadataService
//   ) {
//   }

//   ngOnInit(): void {
//     this.title.setTitle(this.pageTitle);
//     this.meta.updateTag(
//       { name: 'description', content: 'Discover PRISUM-SFA- a thorough sales force automation software with attendance management, route optimization, order processing, performance tracking, Tally API integrations, and more to streamline your operations and drive growth.' }
//     );
//     this.metadataService.loadMetadata('sfa');
//   }

//   openDemoRequest() {
//     const modalRef = this.modalService.open(DemoRequestComponent, { size: 'lg' }); // 'lg' for large modal

//     // Pass applicationId and applicationName to the component
//     modalRef.componentInstance.applicationId = 1;
//     modalRef.componentInstance.applicationName = "SFA";
//   }

// }


import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DemoRequestComponent } from '../demo-request/demo-request.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MetadataService } from '../services/metadata.service';

@Component({
  selector: 'app-sfa',
  templateUrl: './sfa.component.html',
  styleUrls: ['./sfa.component.scss']
})
export class SFAComponent implements OnInit {

  pageTitle = "PRISUM-SFA: Comprehensive Sales Force Automation Software";

  constructor(private meta: Meta, private title: Title,
    private modalService: NgbModal,
    private metadataService: MetadataService
  ) {
  }

  ngOnInit(): void {
    this.title.setTitle(this.pageTitle);
    this.meta.updateTag(
      { name: 'description', content: 'Discover PRISUM-SFA- a thorough sales force automation software with attendance management, route optimization, order processing, performance tracking, Tally API integrations, and more to streamline your operations and drive growth.' }
    );
    this.metadataService.loadMetadata('sfa');
  }

  openDemoRequest() {
    const modalRef = this.modalService.open(DemoRequestComponent, { size: 'lg' }); // 'lg' for large modal

    // Pass applicationId and applicationName to the component
    modalRef.componentInstance.applicationId = 1;
    modalRef.componentInstance.applicationName = "SFA";
  }

}
