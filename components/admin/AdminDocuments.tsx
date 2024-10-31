import React, { useEffect, useState, useCallback } from 'react';
import { useSupabaseClient, Session } from '@supabase/auth-helpers-react';
import { Database } from '@/lib/schema';
import { Users, FolderHeart, Trash2, Folder, Menu } from 'lucide-react';

interface DocumentsProps {
    session: Session | null;
}

const AdminDocuments: React.FC<DocumentsProps> = ({ session }) => {
    const supabase = useSupabaseClient<Database>();
    const [documents, setDocuments] = useState<Database['public']['Tables']['documents']['Row'][]>([]);
    const [sharedDocuments, setSharedDocuments] = useState([
        { id: 1, title: 'Shared Document 1', description: 'Description for shared document 1' },
        { id: 2, title: 'Shared Document 2', description: 'Description for shared document 2' },
    ]);
    const [favoriteDocuments, setFavoriteDocuments] = useState([
        { id: 1, title: 'Favorite Document 1', description: 'Description for favorite document 1' },
        { id: 2, title: 'Favorite Document 2', description: 'Description for favorite document 2' },
    ]);
    const [trashDocuments, setTrashDocuments] = useState([
        { id: 1, title: 'Trash Document 1', description: 'Description for trash document 1' },
        { id: 2, title: 'Trash Document 2', description: 'Description for trash document 2' },
    ]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [activeSection, setActiveSection] = useState('all'); // State to control active section
    const [sidebarOpen, setSidebarOpen] = useState(false); // State to control sidebar visibility

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

    const renderDocuments = (docs: { id: number; title: string; description: string }[]) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {docs.map((document) => (
                <div key={document.id} className="p-4 bg-white shadow rounded">
                    <h3 className="text-lg font-bold">{document.title}</h3>
                    <p className="text-gray-600">{document.description}</p>
                    <button className="btn-blue mt-2">View</button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-64 bg-gray-200 dark:bg-gray-900 dark:text-white p-4 border-r border-t border-gray-700/20 shadow-lg z-50 md:relative md:translate-x-0`}>
                <h2 className="text-xl font-bold mb-4">Documents</h2>
                <ul className="space-y-2">
                    <li className='flex gap-1 items-center'>
                        <Folder />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'all' ? 'bg-gray-100 dark:text-slate-800' : ''}`}
                            onClick={() => setActiveSection('all')}
                        >
                            All Documents
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <Users />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'shared' ? 'bg-gray-100 dark:text-slate-800' : ''}`}
                            onClick={() => setActiveSection('shared')}
                        >
                            Shared with Me
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <FolderHeart />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'favorites' ? 'bg-gray-100 dark:text-slate-800' : ''}`}
                            onClick={() => setActiveSection('favorites')}
                        >
                            Favorites
                        </button>
                    </li>
                    <li className='flex gap-1 items-center'>
                        <Trash2 />
                        <button
                            className={`w-full text-left p-2 ${activeSection === 'trash' ? 'bg-gray-100 dark:text-slate-800' : ''}`}
                            onClick={() => setActiveSection('trash')}
                        >
                            Trash
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
                        {activeSection === 'shared' && 'Shared with Me'}
                        {activeSection === 'favorites' && 'Favorites'}
                        {activeSection === 'trash' && 'Trash'}
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
                                className="rounded w-full p-2 border border-slate-900 mb-2"
                            />
                            <textarea
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="rounded w-full p-2 border border-slate-900 mb-2"
                            />
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="rounded w-full p-2 border border-slate-900"
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
                ) : activeSection === 'shared' ? (
                    renderDocuments(sharedDocuments)
                ) : activeSection === 'favorites' ? (
                    renderDocuments(favoriteDocuments)
                ) : activeSection === 'trash' ? (
                    renderDocuments(trashDocuments)
                ) : null}
            </div>
        </div>
    );
};

export default AdminDocuments;