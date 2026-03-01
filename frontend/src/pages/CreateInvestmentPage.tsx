import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { investorsService } from '../services/investors.service';
import toast from 'react-hot-toast';

export default function CreateInvestmentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { ideaId: ideaIdFromParams } = useParams<{ ideaId: string }>();
  
  const ideaId = ideaIdFromParams || new URLSearchParams(location.search).get('ideaId') || '';
  const teamId = new URLSearchParams(location.search).get('teamId') || '';
  
  const [formData, setFormData] = useState({
    amount: '',
    sharePercent: '',
    authorPercent: '',
    terms: '',
    comment: '',
  });

  // Проверка профиля инвестора
  const { data: investorProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['investorProfile'],
    queryFn: investorsService.getMyProfile,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => investorsService.createInvestment({
      ...data,
      ideaId: ideaId || undefined,
      teamId: teamId || undefined,
    }),
    onSuccess: () => {
      toast.success('Заявка на инвестирование создана');
      navigate('/investor-profile');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка создания заявки');
    },
  });

  // Redirect если нет профиля
  useEffect(() => {
    if (!profileLoading && !investorProfile) {
      toast.error('Сначала создайте профиль инвестора');
      navigate('/investor-profile');
    }
  }, [investorProfile, profileLoading, navigate]);

  if (profileLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    );
  }

  if (!investorProfile) {
    return null; // Will redirect via useEffect
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      amount: parseFloat(formData.amount),
      sharePercent: formData.sharePercent ? parseFloat(formData.sharePercent) : undefined,
      authorPercent: formData.authorPercent ? parseFloat(formData.authorPercent) : undefined,
      terms: formData.terms || undefined,
      comment: formData.comment || undefined,
    });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Заявка на инвестирование</h2>

            {(ideaId || teamId) && (
              <div className="alert alert-info mb-3">
                <small>
                  {ideaId ? 'Идея: ' : 'Команда: '} {ideaId || teamId}
                </small>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Сумма инвестиции *
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="amount"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  min="0"
                  step="0.01"
                  placeholder="50000"
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="sharePercent" className="form-label">
                    Доля в проекте (%)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="sharePercent"
                    value={formData.sharePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, sharePercent: e.target.value })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="20"
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="authorPercent" className="form-label">
                    Процент автору (%)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="authorPercent"
                    value={formData.authorPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, authorPercent: e.target.value })
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="5"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="terms" className="form-label">
                  Условия
                </label>
                <textarea
                  className="form-control"
                  id="terms"
                  value={formData.terms}
                  onChange={(e) =>
                    setFormData({ ...formData, terms: e.target.value })
                  }
                  rows={3}
                  placeholder="Например: возврат через 2 года с 10% годовых"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Комментарий
                </label>
                <textarea
                  className="form-control"
                  id="comment"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  rows={2}
                  placeholder="Ваше сообщение автору идеи"
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Отправка...' : 'Отправить заявку'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate(-1)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
