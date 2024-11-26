import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  postlist: any[] = [];
  isEdit: boolean = false;
  CreatepostForm!: FormGroup;
  postToEdit: any = null;

  currentPage: any = 1;
  totalPost: number = 0;
  postperPage: number = 10;
  totalPage: number = 0;
  displayedPosts: any[] = [];

  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.CreatepostForm = this.fb.group({
      id: [''],
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getPostlist();
  }

  getPostlist() {
    this.authService.getPosts().subscribe({
      next: (response) => {
        this.postlist = response;
        this.totalPost = this.postlist.length;
        this.totalPage = Math.ceil(this.totalPost / this.postperPage);
        this.updatedisplaypost();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getPostById(id: number) {
    this.authService.getPostById(id).subscribe({
      next: (response) => {
        console.log('Single Post ', response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  createpost() {
    if (this.CreatepostForm.invalid) {
      console.log('Please Type Something');
      return;
    }

    let data = {
      title: this.CreatepostForm.controls['title'].value,
      body: this.CreatepostForm.controls['body'].value,
    };

    if (this.isEdit) {
      this.authService.updatePost(this.postToEdit.id, data).subscribe({
        next: (response) => {
          console.log('Post Update Successfully');
          this.resetform();
        },
        error: (err) => {
          console.log('Some Error Occured');
        },
      });
    } else {
      this.authService.createpost(data).subscribe({
        next: (response) => {
          console.log('Data saved Successfully');
          this.resetform();
        },
        error: (err) => {
          console.log('Some Error Occured');
        },
      });
    }
  }

  deletePost(deleteId: number) {
    this.authService.deletePost(deleteId).subscribe({
      next: (response) => {
        console.log('Delete Successfully');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  editPost(id: any) {
    let postDetails = this.postlist.find((c: any) => c.id === id);
    if (postDetails) {
      this.postToEdit = postDetails;
      this.isEdit = true;
      this.CreatepostForm.controls['title'].setValue(postDetails.title);
      this.CreatepostForm.controls['body'].setValue(postDetails.body);
    }
  }

  resetform() {
    this.CreatepostForm.reset();
    this.isEdit = false;
  }

  updatedisplaypost() {
    const startIndex = (this.currentPage - 1) * this.postperPage;
    const endIndex = startIndex + this.postperPage;
    this.displayedPosts = this.postlist.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage < this.totalPage) {
      this.currentPage++;
      this.updatedisplaypost();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatedisplaypost();
    }
  }

  setPage(page: number) {
    this.currentPage = page;
    this.updatedisplaypost();
  }
}
