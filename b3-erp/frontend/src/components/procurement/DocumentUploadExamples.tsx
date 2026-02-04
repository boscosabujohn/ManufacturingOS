'use client'

import React, { useState } from 'react'
import { DragDropUpload, UploadButton, FileItem } from './DragDropUpload'
import { Modal, Button, Card } from './ui'
import {
  FileText, Image, Archive, Upload, Eye, Download,
  Trash2, CheckCircle, AlertTriangle, Clock, Plus
} from 'lucide-react'

// ============= Contract Document Upload =============
export const ContractDocumentUpload: React.FC<{
  contractId?: string
  onDocumentsChange?: (documents: FileItem[]) => void
}> = ({ contractId, onDocumentsChange }) => {
  const [documents, setDocuments] = useState<FileItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (files: FileItem[]) => {
    setIsUploading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Uploading contract documents:', files)
      onDocumentsChange?.(documents)
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card title="Contract Documents" className="space-y-2">
      <DragDropUpload
        accept={['.pdf', '.doc', '.docx', '.txt']}
        maxFiles={5}
        maxSize={50 * 1024 * 1024} // 50MB
        onFilesChange={setDocuments}
        onUpload={handleUpload}
        autoUpload={true}
        showPreview={false}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload Contract Documents
            </p>
            <p className="text-sm text-gray-600 mt-1">
              PDF, DOC, DOCX files only • Max 50MB per file • Up to 5 files
            </p>
          </div>
        </div>
      </DragDropUpload>

      <div className="text-sm text-gray-600">
        <p className="font-medium mb-2">Supported documents:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Signed contracts and agreements</li>
          <li>Terms and conditions</li>
          <li>Amendments and addendums</li>
          <li>Compliance certificates</li>
          <li>Insurance documents</li>
        </ul>
      </div>
    </Card>
  )
}

// ============= Invoice Document Upload =============
export const InvoiceDocumentUpload: React.FC<{
  invoiceId?: string
  onDocumentsChange?: (documents: FileItem[]) => void
}> = ({ invoiceId, onDocumentsChange }) => {
  const [documents, setDocuments] = useState<FileItem[]>([])
  const [uploadMode, setUploadMode] = useState<'drag' | 'camera' | 'scanner'>('drag')

  const handleUpload = async (files: FileItem[]) => {
    try {
      // Simulate OCR processing for invoice data extraction
      console.log('Processing invoice documents with OCR:', files)
      onDocumentsChange?.(documents)
    } catch (error) {
      console.error('Invoice processing failed:', error)
      throw error
    }
  }

  return (
    <Card title="Invoice Documents" className="space-y-2">
      <div className="flex items-center space-x-4 mb-2">
        <label className="text-sm font-medium text-gray-700">Upload Method:</label>
        <div className="flex space-x-2">
          <button
            onClick={() => setUploadMode('drag')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              uploadMode === 'drag'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Upload className="h-4 w-4 inline mr-1" />
            File Upload
          </button>
          <button
            onClick={() => setUploadMode('camera')}
            className={`px-3 py-1.5 text-sm rounded-lg ${
              uploadMode === 'camera'
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Image className="h-4 w-4 inline mr-1" />
            Camera
          </button>
        </div>
      </div>

      <DragDropUpload
        accept={['image/*', '.pdf']}
        maxFiles={10}
        maxSize={20 * 1024 * 1024} // 20MB
        onFilesChange={setDocuments}
        onUpload={handleUpload}
        autoUpload={true}
        showPreview={true}
        compressionOptions={{
          maxWidth: 1920,
          maxHeight: 1080,
          quality: 0.8
        }}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-green-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload Invoice Documents
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Images and PDF files • Auto OCR processing • Max 20MB per file
            </p>
          </div>
        </div>
      </DragDropUpload>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Smart Processing Enabled</p>
            <p>Invoice data will be automatically extracted and validated against purchase orders.</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============= Vendor Documentation Upload =============
export const VendorDocumentUpload: React.FC<{
  vendorId?: string
  onDocumentsChange?: (documents: FileItem[]) => void
}> = ({ vendorId, onDocumentsChange }) => {
  const [documents, setDocuments] = useState<FileItem[]>([])
  const [documentType, setDocumentType] = useState<string>('')

  const documentTypes = [
    { value: 'registration', label: 'Business Registration' },
    { value: 'tax', label: 'Tax Certificates' },
    { value: 'insurance', label: 'Insurance Documents' },
    { value: 'certification', label: 'Quality Certifications' },
    { value: 'financial', label: 'Financial Statements' },
    { value: 'compliance', label: 'Compliance Documents' }
  ]

  const handleUpload = async (files: FileItem[]) => {
    try {
      console.log('Uploading vendor documents:', { vendorId, documentType, files })
      onDocumentsChange?.(documents)
    } catch (error) {
      console.error('Vendor document upload failed:', error)
      throw error
    }
  }

  return (
    <Card title="Vendor Documentation" className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
        <div>
          <label htmlFor="document-type" className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            id="document-type"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select document type</option>
            {documentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DragDropUpload
        accept={['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']}
        maxFiles={20}
        maxSize={25 * 1024 * 1024} // 25MB
        onFilesChange={setDocuments}
        onUpload={handleUpload}
        showPreview={true}
        allowReorder={true}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <Archive className="h-12 w-12 text-purple-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload Vendor Documents
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Business registration, certificates, compliance docs • Multiple formats supported
            </p>
          </div>
        </div>
      </DragDropUpload>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• Business Registration</li>
            <li>• Tax Certificate</li>
            <li>• Insurance Policy</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Optional Documents</h4>
          <ul className="text-gray-600 space-y-1">
            <li>• Quality Certifications</li>
            <li>• Financial Statements</li>
            <li>• References</li>
          </ul>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Document Status</h4>
          <div className="space-y-1">
            <div className="flex items-center text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>5 Approved</span>
            </div>
            <div className="flex items-center text-yellow-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>2 Pending</span>
            </div>
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span>1 Rejected</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

// ============= Bulk Purchase Order Upload =============
export const BulkPOUpload: React.FC<{
  onBulkUpload?: (data: any[]) => void
}> = ({ onBulkUpload }) => {
  const [uploadedData, setUploadedData] = useState<any[]>([])
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle')
  const [validationResults, setValidationResults] = useState<any[]>([])

  const handleFileUpload = async (files: FileItem[]) => {
    setProcessingStatus('processing')

    try {
      // Simulate CSV/Excel processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock validation results
      const mockData = [
        { row: 1, vendor: 'ABC Corp', amount: 5000, status: 'valid' },
        { row: 2, vendor: 'XYZ Ltd', amount: 3500, status: 'warning', message: 'Vendor not in approved list' },
        { row: 3, vendor: 'DEF Inc', amount: 7500, status: 'error', message: 'Invalid vendor code' },
      ]

      setUploadedData(mockData)
      setValidationResults(mockData)
      setProcessingStatus('completed')
      onBulkUpload?.(mockData.filter(item => item.status === 'valid'))
    } catch (error) {
      setProcessingStatus('error')
      console.error('Bulk upload processing failed:', error)
    }
  }

  return (
    <Card title="Bulk Purchase Order Upload" className="space-y-3">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium">Template Required</p>
            <p>Please use our standard template for bulk uploads. Download the template below.</p>
            <button className="mt-2 text-yellow-700 underline hover:text-yellow-900">
              Download Template (Excel)
            </button>
          </div>
        </div>
      </div>

      <DragDropUpload
        accept={['.csv', '.xlsx', '.xls']}
        maxFiles={1}
        maxSize={10 * 1024 * 1024} // 10MB
        multiple={false}
        onUpload={handleFileUpload}
        autoUpload={true}
      >
        <div className="space-y-2">
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-indigo-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              Upload Purchase Order Data
            </p>
            <p className="text-sm text-gray-600 mt-1">
              CSV or Excel files only • Use provided template • Max 1000 rows
            </p>
          </div>
        </div>
      </DragDropUpload>

      {processingStatus === 'processing' && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="text-lg font-medium text-gray-900">Processing upload...</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Validating data and checking against vendor database
          </p>
        </div>
      )}

      {processingStatus === 'completed' && validationResults.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">Validation Results</h3>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {validationResults.filter(r => r.status === 'valid').length}
              </div>
              <div className="text-sm text-green-800">Valid Records</div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-yellow-600">
                {validationResults.filter(r => r.status === 'warning').length}
              </div>
              <div className="text-sm text-yellow-800">Warnings</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                {validationResults.filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-red-800">Errors</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Row
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validationResults.map((result, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {result.row}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      {result.vendor}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                      ${result.amount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        result.status === 'valid'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">
                      {result.message || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setProcessingStatus('idle')}>
              Upload Different File
            </Button>
            <Button
              variant="primary"
              disabled={validationResults.filter(r => r.status === 'valid').length === 0}
            >
              Import Valid Records ({validationResults.filter(r => r.status === 'valid').length})
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// ============= Quick Upload Button Examples =============
export const QuickUploadExamples: React.FC = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  return (
    <Card title="Quick Upload Actions" className="space-y-2">
      <div className="flex flex-wrap gap-3">
        <UploadButton
          onFileSelect={setSelectedFiles}
          accept={['.pdf']}
          multiple={false}
          className="bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
        >
          <FileText className="h-4 w-4 mr-2" />
          Add Quote
        </UploadButton>

        <UploadButton
          onFileSelect={setSelectedFiles}
          accept={['image/*']}
          multiple={true}
        >
          <Image className="h-4 w-4 mr-2" />
          Add Photos
        </UploadButton>

        <UploadButton
          onFileSelect={setSelectedFiles}
          accept={['.csv', '.xlsx']}
          multiple={false}
        >
          <FileText className="h-4 w-4 mr-2" />
          Import Data
        </UploadButton>

        <UploadButton
          onFileSelect={setSelectedFiles}
          accept={['.zip', '.rar']}
          multiple={false}
        >
          <Archive className="h-4 w-4 mr-2" />
          Bulk Documents
        </UploadButton>
      </div>

      {selectedFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="font-medium text-gray-900 mb-2">Selected Files:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {selectedFiles.map((file, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}