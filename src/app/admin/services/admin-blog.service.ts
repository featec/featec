// src/app/admin/services/admin-blog.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { BlogPost } from '../models/blog-post.model';

@Injectable({
  providedIn: 'root'
})
export class AdminBlogService {

  constructor(private firestore: AngularFirestore) {}

  getAllBlogs(): Observable<BlogPost[]> {
    return this.firestore
      .collection<BlogPost>('blog_posts', ref => ref.orderBy('createdAt', 'desc'))
      .valueChanges({ idField: 'id' });
  }

  getBlog(id: string): Observable<BlogPost> {
    return this.firestore
      .collection('blog_posts')
      .doc<BlogPost>(id)
      .valueChanges();
  }

  createBlog(data: BlogPost): Promise<any> {
    return this.firestore.collection('blog_posts').add({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  updateBlog(id: string, data: Partial<BlogPost>): Promise<void> {
    return this.firestore.collection('blog_posts').doc(id).update({
      ...data,
      updatedAt: new Date()
    });
  }

  deleteBlog(id: string): Promise<void> {
    return this.firestore.collection('blog_posts').doc(id).delete();
  }

  async checkSlugUnique(slug: string, currentBlogId?: string): Promise<boolean> {
    const snapshot = await this.firestore
      .collection('blog_posts', ref => ref.where('slug', '==', slug))
      .get()
      .toPromise();

    if (snapshot.empty) return true;
    
    // If editing, check if the only match is the current document
    if (currentBlogId && snapshot.docs.length === 1 && snapshot.docs[0].id === currentBlogId) {
      return true;
    }
    
    return false;
  }

  async isCategoryInUse(categoryName: string): Promise<boolean> {
    const snapshot = await this.firestore
      .collection('blog_posts', ref => ref.where('category', '==', categoryName))
      .get()
      .toPromise();
    
    return !snapshot.empty;
  }

  getCategories(): Observable<any[]> {
    return this.firestore
      .collection('categories', ref => ref.orderBy('name', 'asc'))
      .valueChanges({ idField: 'id' });
  }
}