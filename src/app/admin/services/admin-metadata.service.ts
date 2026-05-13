// src/app/admin/services/admin-metadata.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { PageMetadata } from '../models/page-metadata.model';

@Injectable({
  providedIn: 'root'
})
export class AdminMetadataService {

  constructor(private firestore: AngularFirestore) {}

  getAllPagesMeta(): Observable<PageMetadata[]> {
    return this.firestore
      .collection<PageMetadata>('page_metadata')
      .valueChanges();
  }

  getPageMeta(slug: string): Observable<PageMetadata> {
    return this.firestore
      .collection('page_metadata')
      .doc<PageMetadata>(slug)
      .valueChanges();
  }

  updatePageMeta(slug: string, data: Partial<PageMetadata>): Promise<void> {
    return this.firestore
      .collection('page_metadata')
      .doc(slug)
      .set({
        ...data,
        slug,
        updatedAt: new Date()
      }, { merge: true });
  }
}