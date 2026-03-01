export enum TeamStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CLOSED = 'closed',
}

export enum MemberStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected',
  LEFT = 'left',
}

export interface ITeam {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  ideaId: string;
  leaderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITeamMember {
  id: string;
  teamId: string;
  userId: string;
  role?: string;
  bio?: string;
  status: MemberStatus;
  joinedAt: string;
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
}

export interface IProgress {
  id: string;
  content: string;
  teamId: string;
  authorId: string;
  createdAt: string;
  author?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ICreateTeamDto {
  name: string;
  description?: string;
  ideaId: string;
}

export interface IJoinTeamDto {
  role?: string;
  bio?: string;
}

export interface ICreateProgressDto {
  content: string;
}
