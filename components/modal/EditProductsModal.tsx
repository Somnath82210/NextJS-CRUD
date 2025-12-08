import React from "react";
import {EditModalProps } from "@/features/Products/types/types"
const EditProductModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  productData,
  setProductData,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const handleInputChange = (field: string, value: string) => {
    setProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Edit Product
        </h2>

        {/* Product ID (Read-only) */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">Product ID</label>
          <input
            type="text"
            value={productData.id}
            disabled
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
          />
        </div>

        {/* Name */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">Product Name</label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            placeholder="Enter product name"
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="text-sm text-gray-600 mb-1 block">Price</label>
          <input
            type="number"
            step="0.01"
            value={productData.price}
            onChange={(e) => handleInputChange('price', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            placeholder="Enter price"
          />
        </div>

        {/* Page Size */}
        <div className="mb-6">
          <label className="text-sm text-gray-600 mb-1 block">Page Size</label>
          <input
            type="number"
            value={productData.pageSize}
            onChange={(e) => handleInputChange('pageSize', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900"
            placeholder="Enter page size"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProductModal;