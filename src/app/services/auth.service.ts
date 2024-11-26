import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  getPosts(): Observable<any> {
    return this.httpClient.get('https://jsonplaceholder.typicode.com/posts');
  }

  getPostById(id: any): Observable<any> {
    return this.httpClient.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
  }

  createpost(data: any): Observable<any> {
    return this.httpClient.post(
      `https://jsonplaceholder.typicode.com/posts `,
      data
    );
  }
  
  deletePost(id: number): Observable<any> {
    return this.httpClient.delete(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
  }
  
  updatePost(id: number, data: any): Observable<any> { 
    return this.httpClient.put(
      `https://jsonplaceholder.typicode.com/posts/${id}`,
      data
    );
  }

  
}
