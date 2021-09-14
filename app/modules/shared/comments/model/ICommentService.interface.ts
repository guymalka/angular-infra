import { KetaComment } from "./comment.interface";

export interface ICommentService {
  selector: string;
  isCommentsExixst(comment: KetaComment): boolean;
  addComment(comment: KetaComment): void;
  deleteComment(comment: KetaComment): void;
  updateCommnet(comment: KetaComment): void;
}
