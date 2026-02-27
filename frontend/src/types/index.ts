export interface IUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  reputation: number;
  role: string;
  createdAt: string;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthResponse extends ITokens {
  user: IUser;
}

export enum IdeaStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  IN_PROGRESS = 'in_progress',
  IMPLEMENTED = 'implemented',
  CLOSED = 'closed',
}

export interface IIdea {
  id: string;
  title: string;
  description: string;
  presentationUrl?: string;
  attachments?: string[];
  tags: string[];
  category?: string;
  status: IdeaStatus;
  viewsCount: number;
  averageRating: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIdeaListResponse {
  data: IIdea[];
  total: number;
  page: number;
  limit: number;
}

export interface IRating {
  id: string;
  interest: number;
  benefit: number;
  profitability: number;
  averageRating: number;
  userId: string;
  ideaId: string;
  createdAt: string;
}

export interface IComment {
  id: string;
  content: string;
  authorId: string;
  parentId?: string;
  likesCount: number;
  dislikesCount: number;
  createdAt: string;
  updatedAt: string;
  children?: IComment[];
  author?: IUser;
}
