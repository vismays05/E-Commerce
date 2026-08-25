import React from 'react';

const CategoryBar = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="category-nav-wrapper py-2 border-bottom">
      <div className="container-fluid px-3">
        <div className="d-flex align-items-center gap-2 overflow-x-auto pb-1 scrollbar-hidden">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <i className={`bi ${cat.icon}`}></i>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
