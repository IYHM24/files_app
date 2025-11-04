import { useState, useEffect, useCallback } from 'react';
import { User, ApiResponse } from '../types';
import { UserService } from '../services';

const userService = new UserService();

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await userService.getUsers();
      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.createUser(userData);
      if (response.success && response.data) {
        setUsers(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error || 'Failed to create user');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.updateUser(id, userData);
      if (response.success && response.data) {
        setUsers(prev => prev.map(user => 
          user.id === id ? response.data! : user
        ));
        return response.data;
      } else {
        setError(response.error || 'Failed to update user');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await userService.deleteUser(id);
      if (response.success) {
        setUsers(prev => prev.filter(user => user.id !== id));
        return true;
      } else {
        setError(response.error || 'Failed to delete user');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
}