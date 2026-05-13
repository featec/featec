// src/app/admin/services/admin-category.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCategoryService {

  constructor(private firestore: AngularFirestore) {}

  getCategories(): Observable<Category[]> {
    return this.firestore
      .collection<Category>('categories', ref => ref.orderBy('name', 'asc'))
      .valueChanges({ idField: 'id' });
  }

  createCategory(name: string): Promise<any> {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return this.firestore.collection('categories').add({
      name,
      slug,
      createdAt: new Date()
    });
  }

  deleteCategory(id: string): Promise<void> {
    return this.firestore.collection('categories').doc(id).delete();
  }
}
