export interface Post {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  imagePath: string;
}

export interface ServerResponse<T> {
  message: string;
  payload: T;
}
