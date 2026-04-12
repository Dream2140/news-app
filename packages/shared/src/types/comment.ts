export interface IComment {
  _id: string;
  user: string;
  nickname: string;
  news: string;
  content: string;
  publishedAt: number;
}

export interface CreateCommentDto {
  newsId: string;
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}
