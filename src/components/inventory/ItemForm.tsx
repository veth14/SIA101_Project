import { useState, useEffect } from 'react';
import { Modal } from '../admin/Modal';
import { FileUploader } from '../admin/FileUploader';
import { categories, type InventoryItem } from '../../data/sampleInventory';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  item: InventoryItem | null;
  onSave: (itemData: Partial<InventoryItem>) => void;
}

export const ItemForm = ({ isOpen, onClose, item, onSave }: ItemFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    currentStock: 0,
    reorderLevel: 0,
    unitPrice: 0,
    supplier: '',
    unit: '',
    location: '',
    image: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        category: item.category,
        description: item.description,
        currentStock: item.currentStock,
        reorderLevel: item.reorderLevel,
        unitPrice: item.unitPrice,
        supplier: item.supplier,
        unit: item.unit,
        location: item.location,
        image: item.image || '',
      });
    } else {
      setFormData({
        name: '',
        category: '',
        description: '',
        currentStock: 0,
        reorderLevel: 0,
        unitPrice: 0,
        supplier: '',
        unit: '',
        location: '',
        image: '',
      });
    }
    setErrors({});
  }, [item, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'currentStock' || name === 'reorderLevel' || name === 'unitPrice' 
        ? Number(value) 
        : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (file: File) => {
    // In a real app, you would upload to Firebase Storage
    // For now, we'll create a mock URL
    const mockUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, image: mockUrl }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Item name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.currentStock < 0) {
      newErrors.currentStock = 'Current stock cannot be negative';
    }

    if (formData.reorderLevel < 0) {
      newErrors.reorderLevel = 'Reorder level cannot be negative';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const itemData = {
      ...formData,
      lastRestocked: item ? item.lastRestocked : new Date().toISOString().split('T')[0],
    };

    onSave(itemData);
  };

  const units = ['pieces', 'sets', 'rolls', 'bottles', 'bars', 'pairs', 'sachets', 'bags', 'kg', 'liters'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={item ? 'Edit Item' : 'Add New Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter item name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter item description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Stock Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="currentStock"
              value={formData.currentStock}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.currentStock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.currentStock && <p className="mt-1 text-sm text-red-600">{errors.currentStock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reorder Level <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="reorderLevel"
              value={formData.reorderLevel}
              onChange={handleInputChange}
              min="0"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.reorderLevel ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.reorderLevel && <p className="mt-1 text-sm text-red-600">{errors.reorderLevel}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit <span className="text-red-500">*</span>
            </label>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.unit ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select unit</option>
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
            {errors.unit && <p className="mt-1 text-sm text-red-600">{errors.unit}</p>}
          </div>
        </div>

        {/* Pricing and Supplier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unit Price (₱) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.unitPrice ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.unitPrice && <p className="mt-1 text-sm text-red-600">{errors.unitPrice}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supplier <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
                errors.supplier ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter supplier name"
            />
            {errors.supplier && <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Storage Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-heritage-green focus:border-heritage-green ${
              errors.location ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="e.g., Housekeeping Storage, F&B Storage"
          />
          {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Image
          </label>
          <FileUploader
            onFileSelect={handleImageUpload}
            accept="image/*"
            maxSize={5}
            preview={true}
          />
        </div>

        {/* Summary */}
        {formData.currentStock > 0 && formData.unitPrice > 0 && (
          <div className="bg-heritage-light p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Value:</span>
                <span className="ml-2 font-medium">₱{(formData.currentStock * formData.unitPrice).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Stock Status:</span>
                <span className={`ml-2 font-medium ${
                  formData.currentStock <= formData.reorderLevel 
                    ? formData.currentStock === 0 ? 'text-red-600' : 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {formData.currentStock === 0 ? 'Out of Stock' : 
                   formData.currentStock <= formData.reorderLevel ? 'Low Stock' : 'In Stock'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-heritage-green border border-transparent rounded-md hover:bg-heritage-green/90 focus:outline-none focus:ring-2 focus:ring-heritage-green"
          >
            {item ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
