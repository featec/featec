// src/app/admin/models/blog-post.model.ts
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