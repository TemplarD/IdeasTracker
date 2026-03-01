import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { teamsService } from '../services/teams.service';
import { ITeam } from '../types/teams';
import { useAuth } from './useAuth';

interface TeamsContextType {
  myTeams: ITeam[];
  isLoading: boolean;
  refreshTeams: () => Promise<void>;
}

const TeamsContext = createContext<TeamsContextType | undefined>(undefined);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [myTeams, setMyTeams] = useState<ITeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeams = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    
    try {
      const teams = await teamsService.findMyTeams();
      setMyTeams(teams);
    } catch (error) {
      console.error('Failed to load teams:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, [isAuthenticated]);

  return (
    <TeamsContext.Provider
      value={{
        myTeams,
        isLoading,
        refreshTeams: loadTeams,
      }}
    >
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error('useTeams must be used within a TeamsProvider');
  }
  return context;
}
