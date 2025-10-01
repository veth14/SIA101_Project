import React, { useState } from 'react';
import { 
  uploadInventoryToFirestore, 
  uploadInventoryByCategory, 
  clearAllInventory,
  getInventoryCategories 
} from '../../scripts/uploadInventoryFixed';

const InventoryUploader: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = getInventoryCategories();

  const handleUploadAllItems = async () => {
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const result = await uploadInventoryToFirestore();
      setUploadResult(result);
    } catch (error) {
      setUploadResult({ success: false, error: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadByCategory = async () => {
    if (!selectedCategory) return;
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const uploaded = await uploadInventoryByCategory(selectedCategory);
      setUploadResult({ 
        success: true, 
        uploaded, 
        message: `Uploaded ${uploaded} ${selectedCategory} items` 
      });
    } catch (error) {
      setUploadResult({ success: false, error: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };


  const handleClearInventory = async () => {
    if (!window.confirm('⚠️ Are you sure you want to clear ALL inventory items? This cannot be undone!')) {
      return;
    }
    
    setIsUploading(true);
    setUploadResult(null);
    
    try {
      const success = await clearAllInventory();
      setUploadResult({ 
        success, 
        message: success ? 'All inventory cleared' : 'Failed to clear inventory' 
      });
    } catch (error) {
      setUploadResult({ success: false, error: 'Clear failed' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-black text-gray-900">Inventory Data Uploader</h3>
          <p className="text-sm text-gray-500 font-medium">Upload inventory items and transactions to Firebase Firestore</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Upload All Items */}
        <button
          onClick={handleUploadAllItems}
          disabled={isUploading}
          className="bg-gradient-to-r from-heritage-green to-emerald-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Uploading...
            </div>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Upload All Items
            </>
          )}
        </button>

        {/* Upload by Category */}
        <div className="flex flex-col space-y-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-heritage-green focus:border-transparent text-sm"
          >
            <option value="">Select Category</option>
            {categories.map((category: string) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={handleUploadByCategory}
            disabled={isUploading || !selectedCategory}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Upload Category
          </button>
        </div>


        {/* Clear All Items */}
        <button
          onClick={handleClearInventory}
          disabled={isUploading}
          className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>

      {/* Upload Result */}
      {uploadResult && (
        <div className={`p-4 rounded-xl ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`flex items-center ${uploadResult.success ? 'text-green-800' : 'text-red-800'}`}>
            {uploadResult.success ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <div>
              {uploadResult.success ? (
                <div>
                  <div className="font-semibold">Upload Successful!</div>
                  {uploadResult.uploaded !== undefined && (
                    <div className="text-sm">
                      ✅ Uploaded: {uploadResult.uploaded} items<br/>
                      ⏭️ Skipped: {uploadResult.skipped || 0} items<br/>
                      ❌ Errors: {uploadResult.errors || 0} items
                    </div>
                  )}
                  {uploadResult.message && <div className="text-sm">{uploadResult.message}</div>}
                </div>
              ) : (
                <div>
                  <div className="font-semibold">Upload Failed</div>
                  <div className="text-sm">{uploadResult.error}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-start text-purple-800">
          <svg className="w-5 h-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-semibold">Inventory Upload Options:</div>
            <div className="text-sm mt-1">
              1. **Upload All Items**: Uploads all 140 inventory items from JSON files to `inventory_items` collection<br/>
              2. **Upload by Category**: Upload specific categories (Housekeeping, F&B, Maintenance, Front Office, Security, Laundry, Guest Amenities)<br/>
              3. **Clear All**: Remove all inventory items (use with caution)<br/>
              4. **Note**: Images excluded for Firebase optimization, uses category-based IDs (HK001, FB001, etc.)<br/>
              5. Check browser console for detailed upload progress
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryUploader;
