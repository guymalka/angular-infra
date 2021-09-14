import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule, DialogsModule } from '@progress/kendo-angular-dialog';
import { CommentsDirective } from './directives/comments.directive';
import { ViewDocCommentComponent } from './view-comment/view-comment.component';




@NgModule({
  declarations: [CommentsDirective, ViewDocCommentComponent],
  imports: [
    CommonModule, DialogsModule, DialogModule, ReactiveFormsModule, FormsModule, ButtonsModule
  ],
  exports: [CommentsDirective]
})
export class CommentsModule { }
