import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ideasService } from '../services/ideas.service';
import toast from 'react-hot-toast';

export default function CreateIdeaPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    presentationUrl: '',
    tags: '',
    category: '',
  });

  const createMutation = useMutation({
    mutationFn: ideasService.create,
    onSuccess: (data) => {
      toast.success('Идея создана');
      navigate(`/ideas/${data.id}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка создания идеи');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = {
      title: formData.title,
      description: formData.description,
      presentationUrl: formData.presentationUrl || undefined,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      category: formData.category || undefined,
      status: 'published',
    };

    createMutation.mutate(data);
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8 col-lg-6">
        <div className="card shadow">
          <div className="card-body p-4">
            <h2 className="text-center mb-4">Создать идею</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Заголовок *
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Краткое название идеи"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Описание *
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={5}
                  required
                  placeholder="Подробно опишите вашу идею..."
                />
              </div>

              <div className="mb-3">
                <label htmlFor="presentationUrl" className="form-label">
                  Ссылка на презентацию
                </label>
                <input
                  type="url"
                  className="form-control"
                  id="presentationUrl"
                  value={formData.presentationUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, presentationUrl: e.target.value })
                  }
                  placeholder="https://docs.google.com/presentation/..."
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="category" className="form-label">
                    Категория
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                  >
                    <option value="">Выберите категорию</option>
                    <option value="сайт">Сайт</option>
                    <option value="программа">Программа</option>
                    <option value="сервис">Сервис</option>
                    <option value="мобильное приложение">
                      Мобильное приложение
                    </option>
                    <option value="другое">Другое</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="tags" className="form-label">
                    Теги
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                    placeholder="web, social, startup"
                  />
                  <small className="text-muted">
                    Разделяйте теги запятыми
                  </small>
                </div>
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Создание...' : 'Создать идею'}
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
