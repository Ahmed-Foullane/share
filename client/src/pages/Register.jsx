import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAME_REGEX = /^[a-zA-Z\s-]{2,30}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = ['First name is required'];
    } else if (!NAME_REGEX.test(formData.firstName)) {
      newErrors.firstName = ['First name must contain only letters, spaces, or hyphens (2-30 characters)'];
    }
    if (!formData.lastName) {
      newErrors.lastName = ['Last name is required'];
    } else if (!NAME_REGEX.test(formData.lastName)) {
      newErrors.lastName = ['Last name must contain only letters, spaces, or hyphens (2-30 characters)'];
    }
    if (!formData.email) {
      newErrors.email = ['Email is required'];
    } else if (!EMAIL_REGEX.test(formData.email)) {
      newErrors.email = ['Please enter a valid email address'];
    }
    if (!formData.password) {
      newErrors.password = ['Password is required'];
    } else if (formData.password.length < 6) {
      newErrors.password = ['Password must be at least 6 characters'];
    }
    if (formData.password && formData.password_confirmation !== formData.password) {
      newErrors.password_confirmation = ['Passwords do not match'];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        navigate('/');
      } else if (result.errors) {
        setErrors(result.errors);
      } else if (result.message) {
        setErrors({ general: [result.message] });
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors({ general: [err.response?.data?.message || 'Registration failed'] });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center text-white mb-6">Register for YouShare</h1>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errors.general[0]}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700">
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.firstName ? 'border-red-500' : ''}`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-xs italic mt-1">{errors.firstName[0]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.lastName ? 'border-red-500' : ''}`}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="text-red-500 text-xs italic mt-1">{errors.lastName[0]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs italic mt-1">{errors.email[0]}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="text-red-500 text-xs italic mt-1">{errors.password[0]}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password_confirmation">
            Confirm Password
          </label>
          <input
            type="password"
            id="password_confirmation"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`shadow appearance-none border border-gray-600 bg-gray-700 rounded w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 ${errors.password_confirmation ? 'border-red-500' : ''}`}
            placeholder="Confirm your password"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-xs italic mt-1">{errors.password_confirmation[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      <div className="text-center">
        <span className="text-gray-400">Already have an account? </span>
        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-bold">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Register;
