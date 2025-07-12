export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  completedSwaps: number;
  joinedDate: string;
  isAdmin?: boolean;
  isBanned?: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillRequested: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AdminReport {
  totalUsers: number;
  totalSwaps: number;
  pendingSwaps: number;
  completedSwaps: number;
  averageRating: number;
  recentActivity: any[];
}