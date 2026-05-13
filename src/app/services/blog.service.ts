// src/app/services/blog.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'scheduled';
  scheduledDate?: any;
  createdAt?: any;
  updatedAt?: any;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  readingTime?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private firestore: AngularFirestore) {}

  getAllPublishedBlogs(): Observable<BlogPost[]> {
    return this.firestore
      .collection<BlogPost>('blog_posts', ref =>
        ref.where('status', 'in', ['published', 'scheduled']).orderBy('createdAt', 'desc')
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map(blogs => blogs.filter(b => 
          b.status === 'published' || 
          (b.status === 'scheduled' && b.scheduledDate && new Date(b.scheduledDate) <= new Date())
        ))
      );
  }

  getBlogBySlug(slug: string): Observable<BlogPost[]> {
    return this.firestore
      .collection<BlogPost>('blog_posts', ref =>
        ref.where('slug', '==', slug).where('status', 'in', ['published', 'scheduled'])
      )
      .valueChanges({ idField: 'id' })
      .pipe(
        map(blogs => blogs.filter(b => 
          b.status === 'published' || 
          (b.status === 'scheduled' && b.scheduledDate && new Date(b.scheduledDate) <= new Date())
        ))
      );
  }

  getCategories(): Observable<any[]> {
    return this.firestore
      .collection('categories', ref => ref.orderBy('name', 'asc'))
      .valueChanges({ idField: 'id' });
  }
}