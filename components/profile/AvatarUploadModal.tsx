import React, { useState, useRef } from 'react';
import Modal from '../common/Modal';
import { Upload, Loader } from 'lucide-react';
import { uploadAvatar } from '../../services/mockApi';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAvatarUploaded: (newUrl: string) => void;
}

const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ isOpen, onClose, onAvatarUploaded }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleUpload = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const result = await uploadAvatar(selectedFile);
            if(result.success) {
                onAvatarUploaded(result.newAvatarUrl);
                handleClose();
            } else {
                alert("Upload failed");
            }
        } catch (error) {
            alert("An error occurred during upload.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        onClose();
    }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload New Avatar">
        <div className="space-y-4">
            <div 
                className="w-full h-48 bg-light-2 dark:bg-dark-3 rounded-lg border-2 border-dashed border-light-3 dark:border-dark-3 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
            >
                {previewUrl ? (
                    <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-contain rounded-lg"/>
                ) : (
                    <div className="text-center text-dark-3 dark:text-light-3">
                        <Upload className="mx-auto w-8 h-8"/>
                        <p>Click to browse or drag file here</p>
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/gif"
            />
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <Upload className="w-5 h-5"/>}
                <span>{isLoading ? "Uploading..." : "Upload & Save"}</span>
            </button>
        </div>
    </Modal>
  );
};

export default AvatarUploadModal;