export interface KetaComment {
  /** (h1 יצמיד את ההערה לקטע 100 באיזור היכן שיש תגית  "bakasha100h1"נניח ) סלקטור לפיו ניתן לחבר הערות לאיזורים בדף   */
  selector: string;

  /** מאיזה מקום תו בטקסט */
  from: number;

  /** עד איזה מקום של תו בטקסט */
  to: number;

  /** הטקסט אליו משוייכת ההערה */
  textRef: string;

  /** גוף ההערה */
  comment: string;

  /** מזהה ההערה */
  commentId: string;
}



