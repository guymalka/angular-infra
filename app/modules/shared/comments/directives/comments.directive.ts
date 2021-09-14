import { DOCUMENT } from "@angular/common";
import { ChangeDetectorRef, Directive, HostListener, Inject, Input, OnInit, ViewContainerRef } from "@angular/core";
import { DialogContainerDirective, DialogContainerService, DialogRef, DialogService, DialogSettings } from "@progress/kendo-angular-dialog";
import { KetaComment } from "../model/comment.interface";
import { ICommentService } from "../model/ICommentService.interface";
import { ViewDocCommentComponent } from "../view-comment/view-comment.component";

@Directive({
  selector: '[comments]'
})
export class CommentsDirective extends DialogContainerDirective implements OnInit {

  @Input() comments;
  @Input() handleService: ICommentService;

  DIService: any;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef,
    private dialogService: DialogService,
    private containerRef: ViewContainerRef,
    private service: DialogContainerService) {
    super(containerRef, service);
  }
  ngOnInit(): void {

  }

  @HostListener('contextmenu', ['$event']) async onMouseUp($event: MouseEvent) {
    $event.preventDefault();
    const selection: Selection = this.document.getSelection();
    const comment: KetaComment = {
      comment: '',
      from: Math.min(selection.focusOffset, selection.anchorOffset),
      to: Math.max(selection.focusOffset, selection.anchorOffset),
      textRef: selection.toString(),
      selector: this.comments,
      commentId: this.uuidv4()
    };
    const title = "הוספת הערה";



    if (!comment.textRef || comment.from === comment.to) {
      this.open({
        appendTo: this.containerRef,
        title,
        content: 'יש לסמן קטע להערה',
      });
      return;
    }

    console.log(comment);

    const dialogRef = this.open({
      appendTo: this.containerRef,
      content: ViewDocCommentComponent,
    });

    const noteInstance = dialogRef.content.instance;
    noteInstance.textRef = comment.textRef;
    noteInstance.headText = "הוסף הערה";
    noteInstance.btnText = "הוסף";
    noteInstance.confirm.subscribe(result => {
      console.log(result);
      console.log(comment);

      if (this.handleService.isCommentsExixst({ ...comment, comment: result })) {
        this.open({
          appendTo: this.containerRef,
          title,
          content: `הערה לקטע '${comment.textRef}' עם התוכן '${result}' כבר קיים`,
        });
        return;
      }

      this.handleService.addComment({ ...comment, comment: result });
    })

    // const selection:Selection = this.document.getSelection();
    // if comment exsist
    // if(this.mainDraft.isCommentsExixst(this.comments, selection)){
    //   // alert that comment exsist
    //   return;
    // }
    // open menu

    // if comment selected, open modal to enter comment

    // if done clicked add to
  }


  open(options: DialogSettings): DialogRef {
    const rtn = this.dialogService.open(options);
    setTimeout(() => this.cdr.detectChanges(), 0);
    rtn.result.subscribe({
      complete: () => this.cdr.detectChanges()
    });
    return rtn;
  }
  // private highlight(color: string) {
  //   this.el.nativeElement.style.backgroundColor = color;
  // }

  private uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


}



