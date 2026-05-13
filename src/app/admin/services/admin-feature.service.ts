import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

export interface RoadmapFeature {
  id?: string;
  title: string;
  description: string;
  images: string[];
  layoutPosition: string; // e.g. 'center', 'cascade-right', 'duo', etc.
  order: number;
  isActive: boolean;
  lastUpdatedBy?: string;
  lastUpdatedAt?: any;
}

@Injectable({ providedIn: 'root' })
export class AdminFeatureService {
  private collectionName = 'roadmap_features';

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  getAllFeatures(): Observable<RoadmapFeature[]> {
    return this.firestore
      .collection<RoadmapFeature>(this.collectionName, ref => ref.orderBy('order', 'asc'))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as RoadmapFeature;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
  }

  /** Upload image file to Firebase Storage, returns download URL */
  uploadImage(file: File): Observable<{ progress: number; url?: string }> {
    const path = `roadmap_images/${Date.now()}_${file.name}`;
    const ref = this.storage.ref(path);
    const task = this.storage.upload(path, file);

    return new Observable(observer => {
      let hasError = false;

      const pctSub = task.percentageChanges().subscribe({
        next: progress => observer.next({ progress: progress ?? 0 }),
        error: err => {
          hasError = true;
          observer.error(err);
        }
      });

      const snapSub = task.snapshotChanges().pipe(
        finalize(async () => {
          if (hasError) return;
          try {
            const url = await ref.getDownloadURL().toPromise();
            observer.next({ progress: 100, url });
            observer.complete();
          } catch (err) {
            observer.error(err);
          }
        })
      ).subscribe({
        error: err => {
          hasError = true;
          observer.error(err);
        }
      });

      return () => {
        if (pctSub) pctSub.unsubscribe();
        if (snapSub) snapSub.unsubscribe();
      };
    });
  }

  addFeature(feature: RoadmapFeature): Promise<any> {
    return this.firestore.collection(this.collectionName).add(feature);
  }

  updateFeature(id: string, feature: Partial<RoadmapFeature>): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).update(feature);
  }

  deleteFeature(id: string): Promise<void> {
    return this.firestore.collection(this.collectionName).doc(id).delete();
  }

  /** Get the global visibility status of the roadmap module */
  getModuleStatus(): Observable<boolean> {
    return this.firestore
      .collection('roadmap_config')
      .doc('module_status')
      .valueChanges()
      .pipe(
        map((data: any) => data?.isActive ?? true) // Default to true if not set
      );
  }

  /** Update the global visibility status of the roadmap module */
  updateModuleStatus(isActive: boolean): Promise<void> {
    return this.firestore
      .collection('roadmap_config')
      .doc('module_status')
      .set({ isActive, updatedAt: new Date() }, { merge: true });
  }
}
