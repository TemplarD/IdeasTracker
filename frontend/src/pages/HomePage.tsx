import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ideasService } from '../services/ideas.service';
import { IdeaStatus } from '../types';
import { formatDistanceToNow } from '../utils/dateUtils';

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Получаем фильтры из URL
  const selectedTag = searchParams.get('tag') || '';
  const selectedCategory = searchParams.get('category') || '';

  const { data, isLoading, error } = useQuery({
    queryKey: ['ideas', page, selectedTag, selectedCategory],
    queryFn: () => ideasService.getAll({ 
      page, 
      limit,
      category: selectedCategory || undefined,
    }),
  });
  
  // Фильтрация по тегам на клиенте
  const filteredData = data && selectedTag
    ? {
        ...data,
        data: data.data.filter(idea => idea.tags.includes(selectedTag)),
      }
    : data;

  const getStatusBadge = (status: IdeaStatus) => {
    const badges = {
      [IdeaStatus.DRAFT]: 'secondary',
      [IdeaStatus.PUBLISHED]: 'primary',
      [IdeaStatus.IN_PROGRESS]: 'info',
      [IdeaStatus.IMPLEMENTED]: 'success',
      [IdeaStatus.CLOSED]: 'danger',
    };
    return badges[status];
  };

  const getStatusLabel = (status: IdeaStatus) => {
    const labels = {
      [IdeaStatus.DRAFT]: 'Черновик',
      [IdeaStatus.PUBLISHED]: 'Опубликована',
      [IdeaStatus.IN_PROGRESS]: 'В работе',
      [IdeaStatus.IMPLEMENTED]: 'Реализована',
      [IdeaStatus.CLOSED]: 'Закрыта',
    };
    return labels[status];
  };

  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedTag === tag) {
      // Снять фильтр
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (selectedCategory === category) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
    setPage(1);
  };

  const clearFilters = () => {
    searchParams.delete('tag');
    searchParams.delete('category');
    setSearchParams(searchParams);
    setPage(1);
  };

  if (error) {
    return (
      <div className="alert alert-danger">
        Ошибка загрузки идей: {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Лента идей</h1>
        <Link to="/create-idea" className="btn btn-primary btn-lg">
          + Создать идею
        </Link>
      </div>

      {/* Active filters */}
      {(selectedTag || selectedCategory) && (
        <div className="alert alert-info d-flex align-items-center justify-content-between mb-3">
          <div>
            <strong>Фильтры:</strong>
            {selectedTag && (
              <span className="badge bg-primary ms-2">
                Тег: {selectedTag}
                <button
                  className="btn-close btn-close-white ms-2"
                  onClick={() => {
                    searchParams.delete('tag');
                    setSearchParams(searchParams);
                  }}
                ></button>
              </span>
            )}
            {selectedCategory && (
              <span className="badge bg-secondary ms-2">
                Категория: {selectedCategory}
                <button
                  className="btn-close btn-close-white ms-2"
                  onClick={() => {
                    searchParams.delete('category');
                    setSearchParams(searchParams);
                  }}
                ></button>
              </span>
            )}
          </div>
          <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
            Сбросить
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="row">
          {[...Array(5)].map((_, i) => (
            <div className="col-12 mb-3" key={i}>
              <div className="card skeleton" style={{ height: '150px' }}></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {data?.data.length === 0 ? (
            <div className="text-center py-5">
              <h3>Пока нет идей</h3>
              <p className="text-muted">Будьте первым — создайте идею!</p>
              <Link to="/create-idea" className="btn btn-primary">
                Создать идею
              </Link>
            </div>
          ) : (
            <div className="row">
              {data?.data.map((idea) => (
                <div className="col-12 mb-3" key={idea.id}>
                  <Link
                    to={`/ideas/${idea.id}`}
                    className="text-decoration-none"
                  >
                    <div className="card card-hover h-100">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="card-title text-dark mb-2">
                            {idea.title}
                          </h5>
                          <span
                            className={`badge bg-${getStatusBadge(idea.status)}`}
                          >
                            {getStatusLabel(idea.status)}
                          </span>
                        </div>
                        <p className="card-title text-truncate-2 text-muted mb-3">
                          {idea.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                          <div className="d-flex flex-wrap gap-1">
                            {idea.category && (
                              <button
                                className="badge bg-info text-dark border-0 cursor-pointer"
                                onClick={(e) => handleCategoryClick(idea.category!, e)}
                                title={`Фильтр по категории: ${idea.category}`}
                              >
                                {idea.category}
                              </button>
                            )}
                            {idea.tags.slice(0, 3).map((tag) => (
                              <button
                                key={tag}
                                className={`badge border-0 cursor-pointer ${
                                  selectedTag === tag ? 'bg-primary' : 'bg-light text-dark'
                                }`}
                                onClick={(e) => handleTagClick(tag, e)}
                                title={selectedTag === tag ? 'Снять фильтр' : `Фильтр по тегу: ${tag}`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                          <div className="text-muted small">
                            <span className="me-3">
                              ⭐ {idea.averageRating.toFixed(1)}
                            </span>
                            <span className="me-3">👁 {idea.viewsCount}</span>
                            <span>🕐 {formatDistanceToNow(idea.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total > limit && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                  >
                    Назад
                  </button>
                </li>
                <li className="page-item disabled">
                  <span className="page-link">
                    Страница {page} из {Math.ceil(data.total / limit)}
                  </span>
                </li>
                <li
                  className={`page-item ${
                    page * limit >= data.total ? 'disabled' : ''
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    Вперед
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
