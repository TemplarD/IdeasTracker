import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { investorsService } from '../services/investors.service';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { InvestmentStatus } from '../types/investors';

export default function InvestorProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    budget: '',
    bio: '',
    interests: '',
    preferredCategories: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['investorProfile'],
    queryFn: investorsService.getMyProfile,
  });

  const updateMutation = useMutation({
    mutationFn: investorsService.updateProfile,
    onSuccess: () => {
      toast.success('Профиль обновлён');
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка');
    },
  });

  const { data: investments } = useQuery({
    queryKey: ['myInvestments'],
    queryFn: investorsService.getMyInvestments,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      bio: formData.bio || undefined,
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean) || undefined,
      preferredCategories: formData.preferredCategories.split(',').map(s => s.trim()).filter(Boolean) || undefined,
    });
  };

  const getStatusBadge = (status: InvestmentStatus) => {
    const badges: Record<string, string> = {
      [InvestmentStatus.PROPOSED]: 'info',
      [InvestmentStatus.DISCUSSION]: 'warning',
      [InvestmentStatus.AGREED]: 'primary',
      [InvestmentStatus.COMPLETED]: 'success',
      [InvestmentStatus.REJECTED]: 'danger',
      [InvestmentStatus.CANCELLED]: 'secondary',
    };
    return badges[status] || 'secondary';
  };

  const getStatusLabel = (status: InvestmentStatus) => {
    const labels: Record<string, string> = {
      [InvestmentStatus.PROPOSED]: 'Предложено',
      [InvestmentStatus.DISCUSSION]: 'Обсуждение',
      [InvestmentStatus.AGREED]: 'Согласовано',
      [InvestmentStatus.COMPLETED]: 'Завершено',
      [InvestmentStatus.REJECTED]: 'Отклонено',
      [InvestmentStatus.CANCELLED]: 'Отменено',
    };
    return labels[status] || status;
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-body text-center">
            <div className="mb-3">
              <div className="rounded-circle bg-success text-white d-inline-flex align-items-center justify-content-center fw-bold fs-2"
                style={{ width: '80px', height: '80px' }}>
                $
              </div>
            </div>
            <h4>Профиль инвестора</h4>
            <p className="text-muted">{user?.email}</p>

            {profile ? (
              <div className="text-start">
                <div className="mb-3">
                  <strong>Бюджет:</strong>
                  <div className="text-success fs-5">
                    ${profile.budget?.toLocaleString() || 'Не указан'}
                  </div>
                </div>
                <div className="mb-3">
                  <strong>Всего инвестиций:</strong>
                  <div>{profile.totalInvestments}</div>
                </div>
                <div className="mb-3">
                  <strong>Вложено:</strong>
                  <div className="text-success">
                    ${profile.investedAmount?.toLocaleString() || '0'}
                  </div>
                </div>
                {profile.interests && profile.interests.length > 0 && (
                  <div className="mb-3">
                    <strong>Интересы:</strong>
                    <div className="mt-1">
                      {profile.interests.map((interest, i) => (
                        <span key={i} className="badge bg-info text-dark me-1 mb-1">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="alert alert-warning">
                <small>Профиль инвестора не создан</small>
              </div>
            )}

            <button
              className="btn btn-outline-primary w-100 mt-3"
              onClick={() => setIsEditing(true)}
            >
              {profile ? 'Редактировать' : 'Создать профиль'}
            </button>
          </div>
        </div>
      </div>

      <div className="col-md-8">
        {/* Edit Form Modal */}
        {isEditing && (
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{profile ? 'Редактировать профиль' : 'Создать профиль инвестора'}</h5>
              <button className="btn-close" onClick={() => setIsEditing(false)}></button>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Бюджет ($)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="100000"
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">О себе</label>
                  <textarea
                    className="form-control"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    placeholder="Опыт инвестирования, предпочтения..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Интересы (через запятую)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                    placeholder="SaaS, Mobile Apps, AI"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Предпочитаемые категории</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.preferredCategories}
                    onChange={(e) => setFormData({ ...formData, preferredCategories: e.target.value })}
                    placeholder="программа, сервис, сайт"
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updateMutation.isPending}
                  >
                    {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Investments List */}
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Мои инвестиции</h5>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => navigate('/create-investment')}
            >
              + Новая заявка
            </button>
          </div>
          <div className="card-body">
            {investments && investments.length > 0 ? (
              <div className="list-group list-group-flush">
                {investments.map((inv) => (
                  <div key={inv.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">
                          ${inv.amount.toLocaleString()}
                        </h6>
                        <small className="text-muted">
                          {inv.ideaId ? `Идея: ${inv.ideaId}` : `Команда: ${inv.teamId}`}
                        </small>
                        {inv.sharePercent && (
                          <div className="small">
                            Доля: {inv.sharePercent}%
                            {inv.authorPercent && `, автору: ${inv.authorPercent}%`}
                          </div>
                        )}
                      </div>
                      <span className={`badge bg-${getStatusBadge(inv.status)}`}>
                        {getStatusLabel(inv.status)}
                      </span>
                    </div>
                    <small className="text-muted">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center mb-0">
                Пока нет заявок на инвестирование
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
