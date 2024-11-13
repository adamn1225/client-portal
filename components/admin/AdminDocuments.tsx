import React, { useEffect, useState, useCallback } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/database.types';
import { FolderHeart, Folder, Menu, Star, Trash2 } from 'lucide-react';
import { updateFavoriteStatus } from '@/lib/database';

interface DocumentsProps {
    session: Session | null;
}

const AdminDocuments: React.FC<DocumentsProps> = ({ session }) => {
    const supabase = useSupabaseClient<Database>();
    const [documents, setDocuments] = useState<Database['public']['Tables']['documents']['Row'][]>([]);
    const [importantDocuments, setImportantDocuments] = useState<Database['public']['Tables']['documents']['Row'][]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activeSection, setActiveSection] = useState('all'); // State to control active section
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null); // State to store the document to be deleted

    const fetchDocuments = useCallback(async () => {
        if (!session) return;

        setLoading(true);
        const { data, error } = await supabase
            .from('documents')
            .select('*')
            .eq('user_id', session.user.id);

        if (error) {
            setError(error.message);
        } else {
            setDocuments(data);
            setImportantDocuments(data.filter(doc => doc.is_favorite));
        }
        setLoading(false);
    }, [session, supabase]);

    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file || !session) return;

        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
            .from('documents')
            .upload(fileName, file);

        if (error) {
            setError(error.message);
            return;
        }

        const fileUrl = data?.path;

        const { error: insertError } = await supabase
            .from('documents')
            .insert({
                user_id: session.user.id,
                title,
                description,
                file_name: file.name,
                file_type: file.type,
                file_url: fileUrl,
            });

        if (insertError) {
            setError(insertError.message);
        } else {
            setTitle('');
            setDescription('');
            setFile(null);
            fetchDocuments();
        }
    };

    const handleFavoriteToggle = async (documentId: number, isFavorite: boolean) => {
        const { data, error } = await updateFavoriteStatus(documentId, isFavorite);
        if (error) {
            setError(error.message);
        } else {
            fetchDocuments();
        }
    };

    const handleDelete = async () => {
        if (!documentToDelete) return;

        const { error } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentToDelete);

        if (error) {
            setError(error.message);
        } else {
            fetchDocuments();
            setIsModalOpen(false);
            setDocumentToDelete(null);
        }
    };

    const openDeleteModal = (documentId: number) => {
        setDocumentToDelete(documentId);
        setIsModalOpen(true);
    };

    const renderDocuments = (docs: Database['public']['Tables']['documents']['Row'][]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((document) => (
                <div key={document.id} className="p-4 bg-white shadow rounded flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold">{document.title}</h3>
                        <p className="text-zinc-600">{document.description}</p>
                    </div>
                    <span className='flex justify-between items-end mt-auto'>
                        <span className='flex gap-2 items-center'>
                            <button className="btn-blue mt-2">View</button>
                            <button
                                className="btn-blue mt-2 ml-2"
                                onClick={() => handleFavoriteToggle(document.id, !document.is_favorite)}
                            >
                                <Star className={`h-5 w-5 ${document.is_favorite ? 'text-yellow-500 fill-current' : 'text-zinc-500'}`} />
                            </button>
                        </span>
                        <button
                            className="bg-red-500 text-white mt-2 ml-2 px-4 py-2 rounded"
                            onClick={() => openDeleteModal(document.id)}
                        >
                            Delete
                        </button>
                    </span>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'tranzinc-x-0' : '-tranzinc-x-full'} transition-transform duration-300 ease-in-out w-64 bg-zinc-200 dark:bg-zinc-900 dark:text-white p-4 border-r border-t border-zinc-700/20 shadow-lg z-50 md:relative md:tranzinc-x-0`}>
                <h2 className="text-xl font-bold mb-4">Documents</h2>
                <ul className="space-y-2">
                    <li className='flex gap-1 items-center'>
                        <Folder />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'all' ? 'bg-zinc-100 dark:text-zinc-800' : ''}`}
                            onClick={() => setActiveSection('all')}
                        >
                            All Documents
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <FolderHeart />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'important' ? 'bg-zinc-100 dark:text-zinc-800' : ''}`}
                            onClick={() => setActiveSection('important')}
                        >
                            Important
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 ml-0">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">
                        {activeSection === 'all' && 'All Documents'}
                        {activeSection === 'important' && 'Important'}
                    </h1>
                    <button className="btn-blue" onClick={handleUpload}>Upload Document</button>
                    <button className="md:hidden btn-blue" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Upload Form */}
                {activeSection === 'all' && (
                    <>
                        <h2 className='font-semibold'>Upload Documents</h2>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded w-full p-2 border border-zinc-900 mb-2"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded w-full p-2 border border-zinc-900 mb-2"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="rounded w-full p-2 border border-zinc-900"
                            />
                        </div>
                    </>
                )}

                {/* Documents List */}
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : activeSection === 'all' ? (
                    documents.length === 0 ? (
                        <p>No documents found.</p>
                    ) : (
                        renderDocuments(documents)
                    )
                ) : activeSection === 'important' ? (
                    importantDocuments.length === 0 ? (
                        <p>No important documents found.</p>
                    ) : (
                        renderDocuments(importantDocuments)
                    )
                ) : null}
            </div>

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="fixed inset-0 bg-black opacity-50"></div>
                    <div className="bg-white rounded-lg shadow-lg p-6 z-50">
                        <h2 className="text-xl font-bold mb-4">Delete Document</h2>
                        <p className="mb-4">Are you sure you want to delete this document?</p>
                        <div className="flex justify-end">
                            <button
                                className="bg-zinc-300 text-zinc-700 px-4 py-2 rounded mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDocuments;