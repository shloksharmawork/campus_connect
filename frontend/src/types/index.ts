export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
  role: string;
  onlineStatus?: boolean;
}

export interface Reaction {
  userId: string;
  emoji: string;
}

export interface Post {
  _id: string;
  userId: User;
  type: 'text' | 'voice' | 'image';
  content?: string;
  audioUrl?: string;
  imageUrl?: string;
  createdAt: string;
  reactions: Reaction[];
}

export interface Connection {
  _id: string;
  requesterId: User;
  receiverId: User;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}
