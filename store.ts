import { create } from 'zustand';
import { Book, BookStatus, LoanRecord, Reader, ReaderType } from './types';

// 模拟数据
const MOCK_BOOKS: Book[] = [
  {
    id: 'b1',
    title: '三体',
    author: '刘慈欣',
    isbn: '9787536692930',
    category: '科幻小说',
    publisher: '重庆出版社',
    publishDate: '2008-01',
    status: BookStatus.AVAILABLE,
    location: 'A-SF-001',
    coverUrl: 'https://picsum.photos/200/300?random=1',
    description: '地球文明在宇宙中的兴衰历程。',
    price: 23.00
  },
  {
    id: 'b2',
    title: '深入浅出React和Redux',
    author: '程墨',
    isbn: '9787111565586',
    category: '计算机技术',
    publisher: '机械工业出版社',
    publishDate: '2017-05',
    status: BookStatus.BORROWED,
    location: 'T-CS-102',
    coverUrl: 'https://picsum.photos/200/300?random=2',
    description: 'Web前端开发必读经典。',
    price: 69.00
  },
  {
    id: 'b3',
    title: '百年孤独',
    author: '加西亚·马尔克斯',
    isbn: '9787544253994',
    category: '外国文学',
    publisher: '南海出版公司',
    publishDate: '2011-06',
    status: BookStatus.AVAILABLE,
    location: 'L-FL-088',
    coverUrl: 'https://picsum.photos/200/300?random=3',
    description: '魔幻现实主义文学代表作。',
    price: 39.50
  },
  {
    id: 'b4',
    title: '人类简史',
    author: '尤瓦尔·赫拉利',
    isbn: '9787508647357',
    category: '历史',
    publisher: '中信出版社',
    publishDate: '2014-11',
    status: BookStatus.AVAILABLE,
    location: 'H-HI-005',
    coverUrl: 'https://picsum.photos/200/300?random=4',
    description: '从动物到上帝的人类发展史。',
    price: 68.00
  },
  {
    id: 'b5',
    title: '设计模式：可复用面向对象软件的基础',
    author: 'Erich Gamma',
    isbn: '9787111075752',
    category: '计算机技术',
    publisher: '机械工业出版社',
    publishDate: '2000-09',
    status: BookStatus.MAINTENANCE,
    location: 'T-CS-305',
    coverUrl: 'https://picsum.photos/200/300?random=5',
    description: '软件工程领域的圣经。',
    price: 35.00
  }
];

const MOCK_READERS: Reader[] = [
  {
    id: 'r1',
    name: '张三',
    type: ReaderType.STUDENT,
    email: 'zhangsan@example.com',
    phone: '13800138000',
    registeredDate: '2023-09-01',
    avatarUrl: 'https://picsum.photos/100/100?random=10',
    status: 'ACTIVE'
  },
  {
    id: 'r2',
    name: '李四',
    type: ReaderType.TEACHER,
    email: 'lisi@example.com',
    phone: '13900139000',
    registeredDate: '2022-03-15',
    avatarUrl: 'https://picsum.photos/100/100?random=11',
    status: 'ACTIVE'
  }
];

const MOCK_LOANS: LoanRecord[] = [
  {
    id: 'l1',
    bookId: 'b2',
    readerId: 'r1',
    borrowDate: '2023-10-01',
    dueDate: '2023-11-01',
    status: 'ACTIVE'
  }
];

interface AppState {
  books: Book[];
  readers: Reader[];
  loans: LoanRecord[];
  
  // Actions
  addBook: (book: Book) => void;
  updateBookStatus: (bookId: string, status: BookStatus) => void;
  borrowBook: (bookId: string, readerId: string) => void;
  returnBook: (loanId: string) => void;
  getReaderName: (readerId: string) => string;
  getBookTitle: (bookId: string) => string;
}

export const useStore = create<AppState>((set, get) => ({
  books: MOCK_BOOKS,
  readers: MOCK_READERS,
  loans: MOCK_LOANS,

  addBook: (book) => set((state) => ({ books: [...state.books, book] })),
  
  updateBookStatus: (bookId, status) => set((state) => ({
    books: state.books.map((b) => b.id === bookId ? { ...b, status } : b)
  })),

  borrowBook: (bookId, readerId) => {
    const newLoan: LoanRecord = {
      id: Date.now().toString(),
      bookId,
      readerId,
      borrowDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days later
      status: 'ACTIVE'
    };
    
    set((state) => ({
      loans: [...state.loans, newLoan],
      books: state.books.map((b) => b.id === bookId ? { ...b, status: BookStatus.BORROWED } : b)
    }));
  },

  returnBook: (loanId) => {
    set((state) => {
      const loan = state.loans.find(l => l.id === loanId);
      if (!loan) return state;

      const updatedLoans = state.loans.map(l => 
        l.id === loanId ? { ...l, status: 'RETURNED' as const, returnDate: new Date().toISOString().split('T')[0] } : l
      );

      const updatedBooks = state.books.map(b => 
        b.id === loan.bookId ? { ...b, status: BookStatus.AVAILABLE } : b
      );

      return { loans: updatedLoans, books: updatedBooks };
    });
  },

  getReaderName: (readerId) => {
    const reader = get().readers.find(r => r.id === readerId);
    return reader ? reader.name : '未知读者';
  },

  getBookTitle: (bookId) => {
    const book = get().books.find(b => b.id === bookId);
    return book ? book.title : '未知书籍';
  }
}));
