import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InventoryItem } from '../data/dummyInventory';
import { categories } from '../data/dummyInventory';

// Define the form interface locally
interface AddEditItemForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  pictures: string[];
  category: string;
}

interface InventoryFormProps {
  item?: InventoryItem;
  mode: 'add' | 'edit';
  onSubmit: (data: AddEditItemForm) => void;
  isLoading?: boolean;
  backUrl?: string;
}

export function InventoryForm({ item, mode, onSubmit, isLoading = false, backUrl }: InventoryFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddEditItemForm>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    pictures: [''],
    category: ''
  });

  useEffect(() => {
    if (item && mode === 'edit') {
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        stock: item.stock,
        pictures: item.pictures.length > 0 ? item.pictures : [''],
        category: item.category
      });
    }
  }, [item, mode]);

  const handleInputChange = (field: keyof AddEditItemForm, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePictureChange = (index: number, value: string) => {
    const newPictures = [...formData.pictures];
    newPictures[index] = value;
    setFormData(prev => ({
      ...prev,
      pictures: newPictures
    }));
  };

  const addPictureField = () => {
    setFormData(prev => ({
      ...prev,
      pictures: [...prev.pictures, '']
    }));
  };

  const removePictureField = (index: number) => {
    if (formData.pictures.length > 1) {
      const newPictures = formData.pictures.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        pictures: newPictures
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPictures = formData.pictures.filter(pic => pic.trim() !== '');
    onSubmit({
      ...formData,
      pictures: cleanPictures.length > 0 ? cleanPictures : ['']
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* Header with Back Button */}
      {backUrl && (
        <div className="mb-4">
          <button
            onClick={() => navigate(backUrl)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <span className="mr-2">←</span>
            Back to Details
          </button>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === 'add' ? 'Add New Item' : 'Edit Item'}
        </h1>
        <p className="text-gray-600">
          {mode === 'add' 
            ? 'Fill in the details below to add a new inventory item'
            : 'Update the item information below'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Enter item name"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Enter item description"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="0"
              required
            />
          </div>
        </div>

        {/* Pictures */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Picture URLs
          </label>
          <div className="space-y-3">
            {formData.pictures.map((picture, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={picture}
                  onChange={(e) => handlePictureChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.pictures.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePictureField(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPictureField}
              className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors border border-blue-200"
            >
              + Add Another Picture
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate(backUrl || '/inventory')}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            {mode === 'edit' ? 'Back to Details' : 'Cancel'}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : mode === 'add' ? 'Add Item' : 'Update Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
