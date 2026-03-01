import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { teamsService } from '../services/teams.service';
import { ideasService } from '../services/ideas.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function TeamDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [progressText, setProgressText] = useState('');

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ['team', id],
    queryFn: () => teamsService.findOne(id!),
    enabled: !!id,
  });

  const { data: idea } = useQuery({
    queryKey: ['idea', team?.ideaId],
    queryFn: () => ideasService.getById(team!.ideaId),
    enabled: !!team?.ideaId,
  });

  const { data: members } = useQuery({
    queryKey: ['teamMembers', id],
    queryFn: () => teamsService.getMembers(id!),
    enabled: !!id,
  });

  const { data: progress } = useQuery({
    queryKey: ['teamProgress', id],
    queryFn: () => teamsService.getProgress(id!),
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: (data: any) => teamsService.joinTeam(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers', id] });
      toast.success('Заявка отправлена');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка');
    },
  });

  const progressMutation = useMutation({
    mutationFn: (content: string) => teamsService.addProgress(id!, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamProgress', id] });
      toast.success('Прогресс добавлен');
      setProgressText('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка');
    },
  });

  const handleJoin = () => {
    joinMutation.mutate({ role: 'Участник', bio: '' });
  };

  const handleAddProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (progressText.trim()) {
      progressMutation.mutate(progressText);
    }
  };

  if (teamLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!team) {
    return <div className="alert alert-danger">Команда не найдена</div>;
  }

  const isLeader = team.leaderId === user?.id;
  const isMember = members?.some(m => m.userId === user?.id && m.status === 'active');

  return (
    <div className="row">
      <div className="col-lg-8">
        {/* Team Info */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h1>{team.name}</h1>
              <span className={`badge bg-${team.status === 'active' ? 'success' : 'secondary'}`}>
                {team.status === 'active' ? 'Активна' : team.status}
              </span>
            </div>

            {team.description && (
              <p className="text-muted mb-3">{team.description}</p>
            )}

            <div className="mb-3">
              <strong>Идея:</strong>{' '}
              <Link to={`/ideas/${team.ideaId}`}>
                {idea?.title || 'Загрузка...'}
              </Link>
            </div>

            <div className="text-muted">
              <small>Создана {formatDistanceToNow(team.createdAt)}</small>
            </div>

            {/* Join button */}
            {!isMember && !isLeader && (
              <button
                className="btn btn-primary mt-3"
                onClick={handleJoin}
                disabled={joinMutation.isPending}
              >
                {joinMutation.isPending ? 'Отправка...' : 'Вступить в команду'}
              </button>
            )}
          </div>
        </div>

        {/* Progress Feed */}
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Прогресс</h5>
            {isMember && (
              <small className="text-muted">Только для участников</small>
            )}
          </div>
          <div className="card-body">
            {isMember && (
              <form onSubmit={handleAddProgress} className="mb-4">
                <div className="mb-2">
                  <textarea
                    className="form-control"
                    value={progressText}
                    onChange={(e) => setProgressText(e.target.value)}
                    placeholder="Расскажите о прогрессе..."
                    rows={3}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={progressMutation.isPending}
                >
                  {progressMutation.isPending ? 'Отправка...' : 'Добавить'}
                </button>
              </form>
            )}

            {!isMember && (
              <div className="alert alert-info">
                Вступите в команду, чтобы видеть и добавлять прогресс
              </div>
            )}

            {isMember && progress && progress.length > 0 && (
              <div className="progress-feed">
                {progress.map((item) => (
                  <div key={item.id} className="card mb-2">
                    <div className="card-body">
                      <p className="mb-2">{item.content}</p>
                      <small className="text-muted">
                        {formatDistanceToNow(item.createdAt)}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isMember && (!progress || progress.length === 0) && (
              <p className="text-muted text-center">Пока нет записей о прогрессе</p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar - Members */}
      <div className="col-lg-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Участники</h5>
          </div>
          <div className="card-body">
            {/* Leader */}
            <div className="mb-3">
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold me-2"
                  style={{ width: '40px', height: '40px' }}>
                  L
                </div>
                <div>
                  <strong>Лидер</strong>
                  <div className="text-muted small">ID: {team.leaderId}</div>
                </div>
              </div>
            </div>

            {/* Members */}
            {members && members.length > 0 && (
              <div>
                <h6 className="mb-2">Участники ({members.length})</h6>
                {members.map((member) => (
                  <div key={member.id} className="d-flex align-items-center mb-2">
                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center fw-bold me-2"
                      style={{ width: '32px', height: '32px' }}>
                      {member.user?.firstName?.[0] || 'U'}
                    </div>
                    <div>
                      <div>{member.user?.email || 'User'}</div>
                      {member.role && (
                        <small className="text-muted">{member.role}</small>
                      )}
                      {member.status === 'pending' && (
                        <span className="badge bg-warning ms-1">Ожидает</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
