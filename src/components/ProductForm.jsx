import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  InputGroup,
  Breadcrumb
} from 'react-bootstrap';

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [createdProduct, setCreatedProduct] = useState(null);

  const categories = [
    'electronics',
    'jewelery',
    "men's clothing",
    "women's clothing"
  ];

  // Load existing product data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          setFetchLoading(true);
          const response = await fetch(`https://fakestoreapi.com/products/${id}`);
          
          if (!response.ok) {
            throw new Error('Product not found');
          }
          
          const product = await response.json();
          setFormData({
            title: product.title,
            price: product.price.toString(),
            description: product.description,
            category: product.category,
            image: product.image
          });
          setError(null);
        } catch (err) {
          setError(`Failed to load product: ${err.message}`);
        } finally {
          setFetchLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.title.trim()) errors.push('Product title is required');
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push('Valid price is required');
    if (!formData.description.trim()) errors.push('Product description is required');
    if (!formData.category) errors.push('Category is required');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const productData = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        image: formData.image.trim() || 'https://fakestoreapi.com/img/placeholder.jpg',
        category: formData.category
      };

      const url = isEditing 
        ? `https://fakestoreapi.com/products/${id}`
        : 'https://fakestoreapi.com/products';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditing ? 'update' : 'create'} product`);
      }

      const result = await response.json();
      const finalProduct = isEditing 
        ? { ...productData, id: parseInt(id) }
        : { ...productData, id: result.id };
      
      setCreatedProduct(finalProduct);
      setSuccess(true);

      if (!isEditing) {
        // Reset form only for new products
        setFormData({
          title: '',
          price: '',
          description: '',
          category: '',
          image: ''
        });
      }

    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} product: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    setSuccess(false);
    setError(null);
    setCreatedProduct(null);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-light py-3">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>
              Products
            </Breadcrumb.Item>
            {isEditing ? (
              <>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/product/${id}` }}>
                  Product #{id}
                </Breadcrumb.Item>
                <Breadcrumb.Item active>Edit Product</Breadcrumb.Item>
              </>
            ) : (
              <Breadcrumb.Item active>Add New Product</Breadcrumb.Item>
            )}
          </Breadcrumb>
        </Container>
      </div>

      <Container className="my-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold">
                {isEditing ? `Edit Product #${id}` : 'Add New Product'}
              </h1>
              <p className="lead text-muted">
                {isEditing 
                  ? 'Update the product information below' 
                  : 'Create a new product for your store'
                }
              </p>
            </div>

            {/* Loading State for Fetch */}
            {fetchLoading && (
              <Alert variant="info">
                <div className="d-flex align-items-center">
                  <Spinner size="sm" className="me-2" />
                  Loading product data...
                </div>
              </Alert>
            )}

            {/* Success Message */}
            {success && createdProduct && (
              <Alert variant="success">
                <Alert.Heading>
                  ✅ Product {isEditing ? 'Updated' : 'Created'} Successfully!
                </Alert.Heading>
                <hr />
                <Row>
                  <Col md={8}>
                    <p className="mb-2"><strong>Product ID:</strong> {createdProduct.id}</p>
                    <p className="mb-2"><strong>Title:</strong> {createdProduct.title}</p>
                    <p className="mb-2"><strong>Price:</strong> ${createdProduct.price}</p>
                    <p className="mb-2"><strong>Category:</strong> {createdProduct.category}</p>
                  </Col>
                </Row>
                <hr />
                <div className="d-flex gap-2">
                  {isEditing ? (
                    <>
                      <Button variant="primary" onClick={() => navigate(`/product/${id}`)}>.
                        View Product
                      </Button>
                      <Button variant="outline-primary" onClick={() => navigate('/products')}>
                        Back to Products
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="primary" onClick={resetForm}>
                        Add Another Product
                      </Button>
                      <Button variant="outline-primary" onClick={() => navigate('/products')}>
                        View All Products
                      </Button>
                    </>
                  )}
                </div>
              </Alert>
            )}

            {/* Error Message */}
            {error && (
              <Alert variant="danger">
                <Alert.Heading>❌ Error Creating Product</Alert.Heading>
                <p className="mb-0">{error}</p>
              </Alert>
            )}

            {/* Product Form */}
            <Card className="shadow">
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    {/* Product Title */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Product Title <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter product title"
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Price and Category */}
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Price <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Category <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    {/* Product Image URL */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Product Image URL <span className="text-muted">(optional)</span>
                        </Form.Label>
                        <Form.Control
                          type="url"
                          name="image"
                          value={formData.image}
                          onChange={handleInputChange}
                          placeholder="https://example.com/product-image.jpg"
                        />
                        <Form.Text className="text-muted">
                          Leave blank to use a default placeholder image
                        </Form.Text>
                      </Form.Group>
                    </Col>

                    {/* Product Description */}
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">
                          Product Description <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter detailed product description"
                          required
                        />
                      </Form.Group>
                    </Col>

                    {/* Form Actions */}
                    <Col xs={12}>
                      <hr className="my-4" />
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-secondary"
                          onClick={() => navigate('/products')}
                        >
                          Cancel
                        </Button>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            onClick={resetForm}
                          >
                            Reset Form
                          </Button>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={loading || fetchLoading}
                          >
                            {loading ? (
                              <>
                                <Spinner
                                  as="span"
                                  animation="border"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                  className="me-2"
                                />
                                {isEditing ? 'Updating' : 'Creating'} Product...
                              </>
                            ) : (
                              <>
                                <i className={`bi ${isEditing ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                                {isEditing ? 'Update Product' : 'Create Product'}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ProductForm;