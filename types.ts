// 图书状态枚举
export enum BookStatus {
  AVAILABLE = 'AVAILABLE', // 在架
  BORROWED = 'BORROWED',   // 已借出
  RESERVED = 'RESERVED',   // 已预约
  LOST = 'LOST',           // 遗失
  MAINTENANCE = 'MAINTENANCE' // 维护中
}

// 读者类型枚举
export enum ReaderType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  VIP = 'VIP'
}

// 图书接口
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishDate: string;
  status: BookStatus;
  location: string; // 索书号/位置
  coverUrl: string;
  description?: string;
  price: number;
}

// 读者接口
export interface Reader {
  id: string;
  name: string;
  type: ReaderType;
  email: string;
  phone: string;
  registeredDate: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

// 借阅记录接口
export interface LoanRecord {
  id: string;
  bookId: string;
  readerId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string; // 如果为空则表示未还
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
}

// 统计数据接口
export interface LibraryStats {
  totalBooks: number;
  activeLoans: number;
  totalReaders: number;
  overdueBooks: number;
}
