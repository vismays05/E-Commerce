import React from 'react';

const HeroCarousel = ({ banners, onSelectCategory }) => {
  return (
    <div className="container-fluid px-3 my-3">
      <div id="dmartHeroCarousel" className="carousel slide shadow-sm rounded-4 overflow-hidden" data-bs-ride="carousel">
        <div className="carousel-indicators">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#dmartHeroCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? 'active' : ''}
              aria-current={idx === 0 ? 'true' : 'false'}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>

        <div className="carousel-inner">
          {banners.map((banner, idx) => (
            <div
              key={banner.id}
              className={`carousel-item ${idx === 0 ? 'active' : ''}`}
              style={{ background: banner.bgGradient, minHeight: '260px' }}
            >
              <div className="row g-0 align-items-center p-4 p-md-5 text-white">
                <div className="col-12 col-md-7 pe-md-4">
                  <span className="badge bg-warning text-dark fw-black px-3 py-2 text-uppercase mb-2 shadow-sm">
                    <i className="bi bi-lightning-charge-fill me-1"></i> {banner.badge}
                  </span>
                  <h1 className="fw-black text-white display-6 mb-2 lh-sm">{banner.title}</h1>
                  <p className="lead text-light opacity-90 fs-6 mb-4">{banner.subtitle}</p>
                  <button
                    className="btn btn-light btn-lg fw-bold text-dmart shadow-sm rounded-pill px-4"
                    onClick={() => onSelectCategory(banner.category)}
                  >
                    {banner.buttonText} <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
                <div className="col-12 col-md-5 d-none d-md-block text-center position-relative">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="img-fluid rounded-3 shadow-lg"
                    style={{ maxHeight: '200px', objectFit: 'cover', width: '100%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#dmartHeroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#dmartHeroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};

export default HeroCarousel;
