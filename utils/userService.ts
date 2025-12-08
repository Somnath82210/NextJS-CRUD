import { User } from '../features/Login/types/types';

export class UserService {
  private static STORAGE_KEY = 'users_database';

  // Initialize users from JSON file
  static initializeUsers(): void {
    if (typeof window === 'undefined') return;
    
    const existingUsers = localStorage.getItem(this.STORAGE_KEY);
    if (!existingUsers) {
      // Default demo user
      const defaultUsers: User[] = [
        {
          id: '1',
          email: 'sample@gmail.com',
          password: '1234abcd@', // Updated demo password
          name: 'Demo User',
          role: 'Admin'
        }
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(defaultUsers));
    }
  }

  // Get all users
  static getAllUsers(): User[] {
    if (typeof window === 'undefined') return [];
    
    this.initializeUsers();
    const users = localStorage.getItem(this.STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Get user by email
  static getUserByEmail(email: string): User | null {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    return this.getUserByEmail(email) !== null;
  }

  // Generate unique ID
  static generateUserId(): string {
    const users = this.getAllUsers();
    const maxId = users.reduce((max, user) => {
      const id = parseInt(user.id);
      return id > max ? id : max;
    }, 0);
    return (maxId + 1).toString();
  }

  // Register new user
  static registerUser(userData: {
    name: string;
    email: string;
    password: string;
  }): { success: boolean; message: string; user?: Omit<User, 'password'> } {
    try {
      if (this.emailExists(userData.email)) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }

      const users = this.getAllUsers();
      
      const newUser: User = {
        id: this.generateUserId(),
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: 'User'
      };

      users.push(newUser);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

      const { password, ...userWithoutPassword } = newUser;
      
      return {
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to register user'
      };
    }
  }

  // Authenticate user
  static authenticateUser(email: string, password: string): {
    success: boolean;
    message: string;
    user?: Omit<User, 'password'>;
  } {
    this.initializeUsers();
    const users = this.getAllUsers();

    // Demo login support
    if (email === 'sample@gmail.com' && password === '1234abcd@') {
      const demoUser = users.find(u => u.email === email);
      if (demoUser) {
        const { password, ...userWithoutPassword } = demoUser;
        return {
          success: true,
          message: 'Authentication successful',
          user: userWithoutPassword
        };
      }
    }

    // Normal authentication
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return {
        success: true,
        message: 'Authentication successful',
        user: userWithoutPassword
      };
    }

    return {
      success: false,
      message: 'Invalid email or password'
    };
  }

  // Update user
  static updateUser(userId: string, updates: Partial<User>): {
    success: boolean;
    message: string;
    user?: Omit<User, 'password'>;
  } {
    try {
      const users = this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === userId);

      if (userIndex === -1) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      users[userIndex] = { ...users[userIndex], ...updates };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));

      const { password, ...userWithoutPassword } = users[userIndex];

      return {
        success: true,
        message: 'User updated successfully',
        user: userWithoutPassword
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update user'
      };
    }
  }

  // Delete user
  static deleteUser(userId: string): { success: boolean; message: string } {
    try {
      const users = this.getAllUsers();
      const filteredUsers = users.filter(u => u.id !== userId);

      if (users.length === filteredUsers.length) {
        return {
          success: false,
          message: 'User not found'
        };
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));

      return {
        success: true,
        message: 'User deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete user'
      };
    }
  }

  // Export users to JSON format
  static exportUsers(): string {
    const users = this.getAllUsers();
    return JSON.stringify({ users }, null, 2);
  }

  // Import users from JSON
  static importUsers(jsonData: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonData);
      if (data.users && Array.isArray(data.users)) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data.users));
        return {
          success: true,
          message: 'Users imported successfully'
        };
      }
      return {
        success: false,
        message: 'Invalid JSON format'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to import users'
      };
    }
  }
}
  