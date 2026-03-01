import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { teamsService } from '../services/teams.service';
import { ideasService } from '../services/ideas.service';
import toast from 'react-hot-toast';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: ideaIdFromParams } = useParams<{ id: string }>();
  
  // Получаем ideaId из URL параметров или из query string
  const ideaId = ideaIdFromParams || new URLSearchParams(location.search).get('ideaId') || '';
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ideaId: ideaId,
  });

  // Загружаем информацию об идее для отображения
  const { data: idea } = useQuery({
    queryKey: ['idea', ideaId],
    queryFn: () => ideasService.getById(ideaId),
    enabled: !!ideaId,
  });

  // Обновляем formData при изменении ideaId из URL
  useEffect(() => {
    if (ideaId) {
      setFormData(prev => ({ ...prev, ideaId }));
    }
  }, [ideaId]);

  const createMutation = useMutation({
    mutationFn: teamsService.create,
    onSuccess: (data) => {
      toast.success('Команда создана');
      navigate(`/teams/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка создания команды');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Создать команду</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Название команды *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  placeholder="Например: Команда разработки"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Описание
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  placeholder="Опишите цели и задачи команды..."
                />
              </div>

              <div className="mb-3">
                <label htmlFor="ideaId" className="form-label">
                  Идея *
                </label>
                {idea ? (
                  <div className="card bg-light">
                    <div className="card-body py-2">
                      <h6 className="mb-0">{idea.title}</h6>
                      <input
                        type="hidden"
                        id="ideaId"
                        value={idea.id}
                        readOnly
                      />
                    </div>
                  </div>
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    id="ideaId"
                    value={formData.ideaId}
                    onChange={(e) =>
                      setFormData({ ...formData, ideaId: e.target.value })
                    }
                    required
                    placeholder="UUID идеи"
                  />
                )}
                <small className="text-muted">
                  {idea ? 'Идея выбрана' : 'ID идеи, для которой создается команда'}
                </small>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Создание...' : 'Создать команду'}
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
