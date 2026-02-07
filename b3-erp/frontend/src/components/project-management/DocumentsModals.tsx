```javascript
import { useState } from 'react';
import { X, FileSearch, Share2, Edit, CheckCircle2 } from 'lucide-react';

export function UploadDocumentModal({ isOpen, onClose, onUpload }: any) {
  const [data, setData] = useState({ name: '', category: 'Contract', tags: '' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Upload Document</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-2"><div><label className="block text-sm font-medium mb-1">Document Name</label><input type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Category</label><select value={data.category} onChange={(e) => setData({...data, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option>Contract</option><option>Drawing</option><option>Report</option><option>Certificate</option><option>Confirmation</option></select></div><div className="border-2 border-dashed rounded-lg p-8 text-center"><button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Choose File</button></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onUpload(data)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Upload</button></div></div></div>);
}

export function EditDocumentModal({ isOpen, onClose, onEdit, doc }: any) {
  const [data, setData] = useState({ name: doc?.name || '', tags: doc?.tags || '' });
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-green-600 to-green-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Edit Document</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-2"><div><label className="block text-sm font-medium mb-1">Name</label><input type="text" value={data.name} onChange={(e) => setData({...data, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div><div><label className="block text-sm font-medium mb-1">Tags</label><input type="text" value={data.tags} onChange={(e) => setData({...data, tags: e.target.value})} className="w-full px-3 py-2 border rounded-lg" /></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onEdit(data)} className="px-4 py-2 bg-green-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function ShareDocumentModal({ isOpen, onClose, onShare, doc }: any) {
  const [email, setEmail] = useState('');
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-purple-600 to-purple-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Share Document</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Share with</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="email@example.com" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onShare({ email })} className="px-4 py-2 bg-purple-600 text-white rounded-lg">Share</button></div></div></div>);
}

export function MoveDocumentModal({ isOpen, onClose, onMove, doc }: any) {
  const [folder, setFolder] = useState('');
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-orange-600 to-orange-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Move Document</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Move to Folder</label><input type="text" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onMove({ folder })} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Move</button></div></div></div>);
}

export function CreateFolderModal({ isOpen, onClose, onCreate }: any) {
  const [name, setName] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-teal-600 to-teal-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Create Folder</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><label className="block text-sm font-medium mb-2">Folder Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onCreate({ name })} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Create</button></div></div></div>);
}

export function SetPermissionsModal({ isOpen, onClose, onSet, doc }: any) {
  const [permissions, setPermissions] = useState({ view: true, edit: false, delete: false });
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Set Permissions</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6 space-y-3"><label className="flex items-center"><input type="checkbox" checked={permissions.view} onChange={(e) => setPermissions({...permissions, view: e.target.checked})} className="mr-2" /><span>View</span></label><label className="flex items-center"><input type="checkbox" checked={permissions.edit} onChange={(e) => setPermissions({...permissions, edit: e.target.checked})} className="mr-2" /><span>Edit</span></label><label className="flex items-center"><input type="checkbox" checked={permissions.delete} onChange={(e) => setPermissions({...permissions, delete: e.target.checked})} className="mr-2" /><span>Delete</span></label></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSet(permissions)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Save</button></div></div></div>);
}

export function VersionHistoryModal({ isOpen, onClose, doc }: any) {
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-yellow-600 to-yellow-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Version History</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Version history for {doc.name}</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-yellow-600 text-white rounded-lg">Close</button></div></div></div>);
}

export function BulkDownloadModal({ isOpen, onClose, onDownload, selectedDocs }: any) {
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Bulk Download</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-700">Download {selectedDocs?.length || 0} documents as ZIP?</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onDownload()} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Download</button></div></div></div>);
}

export function FilterDocumentsModal({ isOpen, onClose, onApply }: any) {
  const [filters, setFilters] = useState({ category: 'all', dateRange: 'all' });
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-cyan-600 to-cyan-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Filter Documents</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><div className="grid grid-cols-2 gap-2"><div><label className="block text-sm font-medium mb-1">Category</label><select value={filters.category} onChange={(e) => setFilters({...filters, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option><option>Contract</option><option>Drawing</option><option>Confirmation</option></select></div><div><label className="block text-sm font-medium mb-1">Date Range</label><select value={filters.dateRange} onChange={(e) => setFilters({...filters, dateRange: e.target.value})} className="w-full px-3 py-2 border rounded-lg"><option value="all">All</option><option>This Week</option><option>This Month</option></select></div></div></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onApply(filters)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg">Apply</button></div></div></div>);
}

export function SearchDocumentsModal({ isOpen, onClose, onSearch }: any) {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-2xl"><div className="bg-gradient-to-r from-pink-600 to-pink-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Search Documents</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><input type="text" value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-lg" placeholder="Search documents..." /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onSearch({ query })} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Search</button></div></div></div>);
}

export function TagDocumentsModal({ isOpen, onClose, onTag, selectedDocs }: any) {
  const [tags, setTags] = useState('');
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Tag Documents</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-sm text-gray-600 mb-2">Tagging {selectedDocs?.length || 0} documents</p><label className="block text-sm font-medium mb-2">Tags (comma-separated)</label><input type="text" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border rounded-lg" /></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onTag({ tags })} className="px-4 py-2 bg-amber-600 text-white rounded-lg">Tag</button></div></div></div>);
}

export function DeleteDocumentModal({ isOpen, onClose, onDelete, doc }: any) {
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-md"><div className="bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Delete Document</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-700">Are you sure you want to delete {doc.name}?</p><p className="text-sm text-red-600 mt-2">This action cannot be undone.</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end space-x-3 border-t"><button onClick={onClose} className="px-4 py-2 border rounded-lg">Cancel</button><button onClick={() => onDelete()} className="px-4 py-2 bg-red-600 text-white rounded-lg">Delete</button></div></div></div>);
}

export function PreviewDocumentModal({ isOpen, onClose, doc }: any) {
  if (!isOpen || !doc) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-4 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{doc.documentName || doc.name}</h2>
              <p className="text-violet-100 text-xs">{doc.documentNumber} • Version {doc.version || '1.0'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="h-6 w-6 text-white" />
          </button>
        </div>
        
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {/* Main Preview Area */}
          <div className="flex-1 bg-gray-100 overflow-y-auto p-8 flex items-center justify-center">
            <div className="bg-white shadow-lg w-full max-w-[800px] aspect-[1/1.41] flex flex-col items-center justify-center rounded-lg border border-gray-200 p-12 text-center">
               <FileSearch className="w-20 h-20 text-gray-200 mb-6" />
               <h3 className="text-xl font-black text-gray-900 mb-2">Attachment Preview</h3>
               <p className="text-gray-500 max-w-sm">Detailed content preview for {doc.documentName || doc.name} is currently loading or requires a specialized viewer.</p>
               <div className="mt-8 flex gap-3">
                 <button className="px-6 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 shadow-md">Download Original</button>
                 <button className="px-6 py-2 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Open in New Tab</button>
               </div>
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
             <div>
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Document Details</h4>
               <div className="space-y-4">
                 <div className="flex justify-between items-start">
                   <span className="text-xs text-gray-500">Category</span>
                   <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded">{doc.category}</span>
                 </div>
                 <div className="flex justify-between items-start">
                   <span className="text-xs text-gray-500">Project</span>
                   <span className="text-xs font-bold text-gray-900 text-right">{doc.projectName}</span>
                 </div>
                 <div className="flex justify-between items-start">
                   <span className="text-xs text-gray-500">Uploaded At</span>
                   <span className="text-xs font-bold text-gray-900">{doc.uploadDate}</span>
                 </div>
                 <div className="flex justify-between items-start">
                   <span className="text-xs text-gray-500">Uploaded By</span>
                   <span className="text-xs font-bold text-gray-900">{doc.uploadedBy}</span>
                 </div>
               </div>
             </div>

             <div className="pt-6 border-t border-gray-100">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Compliance</h4>
               <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-100">
                 <CheckCircle2 className="w-4 h-4 text-green-600" />
                 <span className="text-[10px] font-bold text-green-800 uppercase">Verified Secure</span>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-t shrink-0">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Share2 className="w-4 h-4" />
              <span className="text-xs font-bold">Share</span>
            </button>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors">
              <Edit className="w-4 h-4" />
              <span className="text-xs font-bold">Edit Metadata</span>
            </button>
          </div>
          <button onClick={onClose} className="px-8 py-2 bg-gray-900 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-black transition-all">Close Viewer</button>
        </div>
      </div>
    </div>
  );
}

export function ViewDetailsModal({ isOpen, onClose, doc }: any) {
  if (!isOpen || !doc) return null;
  return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3"><div className="bg-white rounded-lg shadow-xl w-full max-w-3xl"><div className="bg-gradient-to-r from-slate-600 to-slate-700 px-3 py-2 flex justify-between items-center"><h2 className="text-xl font-bold text-white">Document Details</h2><button onClick={onClose} className="text-white"><X className="h-5 w-5" /></button></div><div className="p-6"><p className="text-gray-600">Details for {doc.name}</p></div><div className="bg-gray-50 px-3 py-2 flex justify-end border-t"><button onClick={onClose} className="px-4 py-2 bg-slate-600 text-white rounded-lg">Close</button></div></div></div>);
}
