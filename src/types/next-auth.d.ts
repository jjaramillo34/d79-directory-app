import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      level: 1 | 2 | 3 | 4;
      schoolName?: string;
      isActive: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    level: 1 | 2 | 3 | 4;
    schoolName?: string;
    isActive: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    level: 1 | 2 | 3 | 4;
    schoolName?: string;
    isActive: boolean;
  }
}