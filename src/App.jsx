import { BrowserRouter as Router, Routes, Route, useNavigate, Link } from 'react-router-dom'
import ProductList from './components/ProductList'
import ProductDetails from './components/ProductDetails'
import ProductForm from './components/ProductForm'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

function Navigation() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🛍️ FakeStore
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product/new">
                <i className="bi bi-plus-circle me-1"></i>Add Product
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart <span className="badge bg-primary">0</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section 
      className="hero-section text-center text-white d-flex align-items-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '60vh'
      }}
    >
      <div className="container">
        <h1 className="display-3 fw-bold mb-4">Welcome to FakeStore</h1>
        <p className="lead fs-4 mb-4">Your one-stop shop for everything you need</p>
        <p className="mb-4">Quality products • Fast shipping • Great prices</p>
        <div className="d-flex justify-content-center gap-3">
          <button 
            className="btn btn-light btn-lg"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </button>
          <button 
            className="btn btn-outline-light btn-lg"
            onClick={() => navigate('/products')}
          >
            View Categories
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturedCategories() {
  const categories = [
    { name: "Electronics", icon: "📱", description: "Latest gadgets and tech" },
    { name: "Fashion", icon: "👕", description: "Trendy clothing and style" },
    { name: "Jewelry", icon: "💎", description: "Elegant accessories" }
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="display-6 fw-bold">Shop by Category</h2>
          <p className="lead text-muted">Find exactly what you're looking for</p>
        </div>
        <div className="row g-4">
          {categories.map((category, index) => (
            <div key={index} className="col-md-4">
              <div className="card h-100 shadow-sm border-0 text-center">
                <div className="card-body p-4">
                  <div className="fs-1 mb-3">{category.icon}</div>
                  <h5 className="card-title fw-bold">{category.name}</h5>
                  <p className="card-text text-muted">{category.description}</p>
                  <button className="btn btn-primary">
                    Browse {category.name}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      
      {/* Newsletter signup */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow">
                <div className="card-body text-center p-5">
                  <h4 className="card-title">Stay Updated!</h4>
                  <p className="card-text text-muted mb-4">
                    Get the latest deals and new arrivals delivered to your inbox
                  </p>
                  <div className="input-group mb-3">
                    <input 
                      type="email" 
                      className="form-control" 
                      placeholder="Enter your email"
                    />
                    <button className="btn btn-primary" type="button">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductsPage() {
  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="bg-light py-3">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none">Home</Link>
            </li>
            <li className="breadcrumb-item active">Products</li>
          </ol>
        </div>
      </nav>

      <ProductList />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/new" element={<ProductForm />} />
          <Route path="/product/:id/edit" element={<ProductForm />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
