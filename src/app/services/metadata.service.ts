import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetadataService {

  constructor(
    private firestore: AngularFirestore,
    private meta: Meta,
    private title: Title
  ) { }

  loadMetadata(slug: string): void {
    this.firestore
      .collection('page_metadata')
      .doc(slug)
      .valueChanges()
      .subscribe((data: any) => {
        if (data) {
          this.title.setTitle(data.title);
          this.meta.updateTag({ name: 'description', content: data.description });
          this.meta.updateTag({ name: 'keywords', content: data.keywords });
        }
      });
  }
}