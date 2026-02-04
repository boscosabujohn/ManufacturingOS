'use client';

import React, { useState } from 'react';
import {
  X,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Video,
  File,
  Link as LinkIcon,
  Tag,
  Folder,
  Star,
  Clock,
  TrendingUp,
  Copy,
  Share2,
  Plus
} from 'lucide-react';

// Types
export interface ContentItem {
  id: string;
  contentId: string;
  title: string;
  type: 'text' | 'image' | 'video' | 'document' | 'case-study' | 'specification';
  category: string;
  size: string;
  format: string;
  description: string;
  usageCount: number;
  lastUsed: string;
  createdDate: string;
  tags: string[];
  url?: string;
  thumbnail?: string;
  status: 'active' | 'archived';
  createdBy: string;
  version: string;
}

// Upload Content Modal
interface UploadContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (content: any) => void;
}

export function UploadContentModal({ isOpen, onClose, onUpload }: UploadContentModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'document' as ContentItem['type'],
    category: 'general',
    description: '',
    tags: [] as string[],
    file: null as File | null,
    url: '',
    version: '1.0'
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.file && !formData.url.trim()) {
      newErrors.file = 'Please upload a file or provide a URL';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (file: File) => {
    setFormData({ ...formData, file });
    if (!formData.title) {
      setFormData({ ...formData, file, title: file.name.replace(/\.[^/.]+$/, '') });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUpload(formData);
            setIsUploading(false);
            onClose();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload Content</h2>
              <p className="text-sm text-gray-500">Add content to your library</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Upload Methods */}
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    !formData.url ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setFormData({ ...formData, url: '' })}
                >
                  Upload File
                </button>
                <button
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    formData.url ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                  onClick={() => setFormData({ ...formData, file: null })}
                >
                  Add URL
                </button>
              </div>

              {!formData.url ? (
                /* File Upload Area */
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : errors.file
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                >
                  {formData.file ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <File className="w-12 h-12 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{formData.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, file: null })}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Upload className="w-12 h-12 text-gray-400" />
                      <div>
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-medium">
                            Click to upload
                          </span>
                          <span className="text-gray-600"> or drag and drop</span>
                          <input
                            type="file"
                            onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
                            className="hidden"
                            accept="*/*"
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, JPG, PNG, MP4 up to 50MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* URL Input */
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/document.pdf"
                  />
                </div>
              )}
              {errors.file && (
                <p className="text-red-500 text-xs mt-1">{errors.file}</p>
              )}
            </div>

            {/* Content Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Content Details</h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={`w-full p-2 border rounded-lg ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter content title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="document">Document</option>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                      <option value="text">Text Content</option>
                      <option value="case-study">Case Study</option>
                      <option value="specification">Specification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="general">General</option>
                      <option value="marketing">Marketing</option>
                      <option value="technical">Technical</option>
                      <option value="legal">Legal</option>
                      <option value="case-studies">Case Studies</option>
                      <option value="product-specs">Product Specs</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full p-2 border rounded-lg ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe this content..."
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="e.g., 1.0, 2.1"
                  />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Uploading...</span>
                  <span className="text-sm font-medium text-blue-900">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Content</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// View Content Modal
interface ViewContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem;
}

export function ViewContentModal({ isOpen, onClose, content }: ViewContentModalProps) {
  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (content.type) {
      case 'image': return <ImageIcon className="w-6 h-6 text-purple-500" />;
      case 'video': return <Video className="w-6 h-6 text-red-500" />;
      case 'document': return <FileText className="w-6 h-6 text-blue-500" />;
      case 'case-study': return <Star className="w-6 h-6 text-yellow-500" />;
      case 'specification': return <File className="w-6 h-6 text-green-500" />;
      default: return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full  max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">View Content</h2>
              <p className="text-sm text-gray-500">{content.contentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Preview Area */}
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
              {content.type === 'image' && content.thumbnail ? (
                <img src={content.thumbnail} alt={content.title} className="max-h-[400px] rounded" />
              ) : content.type === 'video' ? (
                <div className="text-center">
                  <Video className="w-24 h-24 text-gray-400 mb-2" />
                  <p className="text-gray-600">Video Preview</p>
                  <p className="text-sm text-gray-500 mt-2">{content.format}</p>
                </div>
              ) : (
                <div className="text-center">
                  {getTypeIcon()}
                  <p className="text-gray-600 mt-4">{content.title}</p>
                  <p className="text-sm text-gray-500 mt-2">{content.format} • {content.size}</p>
                </div>
              )}
            </div>

            {/* Content Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{content.title}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {content.type}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full">
                  {content.category}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                  v{content.version}
                </span>
              </div>
              <p className="text-gray-700">{content.description}</p>
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Statistics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Usage Statistics</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Times Used</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{content.usageCount}</p>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">Last Used</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(content.lastUsed).toLocaleDateString()}
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <File className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600">File Size</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{content.size}</p>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Metadata</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Content ID:</span>
                  <span className="ml-2 font-medium text-gray-900">{content.contentId}</span>
                </div>
                <div>
                  <span className="text-gray-600">Format:</span>
                  <span className="ml-2 font-medium text-gray-900">{content.format}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created By:</span>
                  <span className="ml-2 font-medium text-gray-900">{content.createdBy}</span>
                </div>
                <div>
                  <span className="text-gray-600">Created Date:</span>
                  <span className="ml-2 font-medium text-gray-900">
                    {new Date(content.createdDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 font-medium ${
                    content.status === 'active' ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {content.status}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Version:</span>
                  <span className="ml-2 font-medium text-gray-900">{content.version}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between p-3 border-t bg-white">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit Content Modal
interface EditContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  content: ContentItem;
}

export function EditContentModal({ isOpen, onClose, onSave, content }: EditContentModalProps) {
  const [formData, setFormData] = useState<ContentItem>(content);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSaving(true);
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <Edit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Edit Content</h2>
              <p className="text-sm text-gray-500">{content.contentId}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter content title"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="document">Document</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="text">Text Content</option>
                  <option value="case-study">Case Study</option>
                  <option value="specification">Specification</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="technical">Technical</option>
                  <option value="legal">Legal</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="product-specs">Product Specs</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full p-2 border rounded-lg ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe this content..."
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version
                </label>
                <input
                  type="text"
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., 1.0, 2.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Add tags (press Enter)"
                />
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-blue-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add to Proposal Modal
interface AddToProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  content: ContentItem;
}

export function AddToProposalModal({ isOpen, onClose, onAdd, content }: AddToProposalModalProps) {
  const [formData, setFormData] = useState({
    proposalId: '',
    sectionType: 'existing' as 'existing' | 'new',
    existingSection: '',
    newSectionTitle: '',
    position: 'end' as 'start' | 'end' | 'after',
    afterSection: '',
    includeDescription: true,
    customCaption: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample proposals (would come from props or API)
  const proposals = [
    { id: 'PROP-001', name: 'Acme Corp Enterprise Solution' },
    { id: 'PROP-002', name: 'TechStart SaaS Proposal' },
    { id: 'PROP-003', name: 'Manufacturing Co. Implementation' }
  ];

  const sections = [
    { id: 'sec-1', title: 'Executive Summary' },
    { id: 'sec-2', title: 'Solution Overview' },
    { id: 'sec-3', title: 'Pricing & Quote' }
  ];

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.proposalId) {
      newErrors.proposalId = 'Please select a proposal';
    }

    if (formData.sectionType === 'existing' && !formData.existingSection) {
      newErrors.existingSection = 'Please select a section';
    }

    if (formData.sectionType === 'new' && !formData.newSectionTitle.trim()) {
      newErrors.newSectionTitle = 'Section title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd({ ...formData, contentId: content.id });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add to Proposal</h2>
              <p className="text-sm text-gray-500">{content.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Select Proposal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Proposal *
              </label>
              <select
                value={formData.proposalId}
                onChange={(e) => setFormData({ ...formData, proposalId: e.target.value })}
                className={`w-full p-2 border rounded-lg ${
                  errors.proposalId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Choose a proposal...</option>
                {proposals.map((proposal) => (
                  <option key={proposal.id} value={proposal.id}>
                    {proposal.id} - {proposal.name}
                  </option>
                ))}
              </select>
              {errors.proposalId && (
                <p className="text-red-500 text-xs mt-1">{errors.proposalId}</p>
              )}
            </div>

            {/* Section Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to Section
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sectionType: 'existing' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.sectionType === 'existing'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Folder className={`w-5 h-5 mb-2 ${
                    formData.sectionType === 'existing' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.sectionType === 'existing' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    Existing Section
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, sectionType: 'new' })}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    formData.sectionType === 'new'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Plus className={`w-5 h-5 mb-2 ${
                    formData.sectionType === 'new' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-sm font-medium ${
                    formData.sectionType === 'new' ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    New Section
                  </span>
                </button>
              </div>
            </div>

            {/* Section Selection/Creation */}
            {formData.sectionType === 'existing' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Section *
                </label>
                <select
                  value={formData.existingSection}
                  onChange={(e) => setFormData({ ...formData, existingSection: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${
                    errors.existingSection ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={!formData.proposalId}
                >
                  <option value="">Choose a section...</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.title}
                    </option>
                  ))}
                </select>
                {errors.existingSection && (
                  <p className="text-red-500 text-xs mt-1">{errors.existingSection}</p>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Section Title *
                </label>
                <input
                  type="text"
                  value={formData.newSectionTitle}
                  onChange={(e) => setFormData({ ...formData, newSectionTitle: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${
                    errors.newSectionTitle ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter section title"
                />
                {errors.newSectionTitle && (
                  <p className="text-red-500 text-xs mt-1">{errors.newSectionTitle}</p>
                )}
              </div>
            )}

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position
              </label>
              <select
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="start">Beginning of section</option>
                <option value="end">End of section</option>
                <option value="after">After specific content</option>
              </select>
            </div>

            {/* Custom Caption */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Caption (optional)
              </label>
              <input
                type="text"
                value={formData.customCaption}
                onChange={(e) => setFormData({ ...formData, customCaption: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Add a caption for this content"
              />
            </div>

            {/* Options */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.includeDescription}
                  onChange={(e) => setFormData({ ...formData, includeDescription: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">Include content description</span>
              </label>
            </div>

            {/* Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium mb-1">Content will be added to proposal</p>
                  <p>{content.type} • {content.format} • {content.size}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg hover:from-green-600 hover:to-teal-600 transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add to Proposal</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Organize Content Modal (Categories & Folders)
interface OrganizeContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrganize: (data: any) => void;
}

export function OrganizeContentModal({ isOpen, onClose, onOrganize }: OrganizeContentModalProps) {
  const [formData, setFormData] = useState({
    action: 'move' as 'move' | 'copy' | 'categorize',
    targetFolder: '',
    newFolder: '',
    category: '',
    selectedItems: [] as string[]
  });

  const folders = [
    { id: 'f1', name: 'Marketing Materials', count: 12 },
    { id: 'f2', name: 'Technical Documentation', count: 8 },
    { id: 'f3', name: 'Case Studies', count: 15 },
    { id: 'f4', name: 'Product Specifications', count: 6 }
  ];

  const handleSubmit = () => {
    onOrganize(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-3 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Folder className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Organize Content</h2>
              <p className="text-sm text-gray-500">Manage folders and categories</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-3">
            {/* Action Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'move', label: 'Move', icon: Folder },
                  { value: 'copy', label: 'Copy', icon: Copy },
                  { value: 'categorize', label: 'Categorize', icon: Tag }
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, action: action.value as any })}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.action === action.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mb-2 ${
                        formData.action === action.value ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <span className={`text-sm font-medium ${
                        formData.action === action.value ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Folders */}
            {(formData.action === 'move' || formData.action === 'copy') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Folder
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {folders.map((folder) => (
                    <button
                      key={folder.id}
                      onClick={() => setFormData({ ...formData, targetFolder: folder.id })}
                      className={`w-full p-3 border-2 rounded-lg text-left transition-all ${
                        formData.targetFolder === folder.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Folder className={`w-5 h-5 ${
                            formData.targetFolder === folder.id ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                          <span className={`font-medium ${
                            formData.targetFolder === folder.id ? 'text-blue-700' : 'text-gray-700'
                          }`}>
                            {folder.name}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">{folder.count} items</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Or create new folder
                  </label>
                  <input
                    type="text"
                    value={formData.newFolder}
                    onChange={(e) => setFormData({ ...formData, newFolder: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="New folder name"
                  />
                </div>
              </div>
            )}

            {/* Categories */}
            {formData.action === 'categorize' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">Choose a category...</option>
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="technical">Technical</option>
                  <option value="legal">Legal</option>
                  <option value="case-studies">Case Studies</option>
                  <option value="product-specs">Product Specs</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-3 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2"
          >
            <Check className="w-4 h-4" />
            <span>Apply</span>
          </button>
        </div>
      </div>
    </div>
  );
}
