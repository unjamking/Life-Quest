
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';
import { UploadIcon } from '../icons';

interface ProofUploadModalProps {
  questId: string;
}

const ProofUploadModal: React.FC<ProofUploadModalProps> = ({ questId }) => {
    const { quests, hideModal, submitQuestProof } = useAppContext();
    const [notes, setNotes] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const quest = quests.find(q => q.id === questId);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };
    
    const handleSubmit = () => {
        if (!quest) return;
        submitQuestProof(quest.id, notes, image || undefined);
    };

    if (!quest) return null;

    return (
        <div className="space-y-4">
            <p className="text-gray-600">You are completing the quest: <span className="font-bold text-[#1a1a1a]">{quest.title}</span></p>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completion Notes</label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How did it go? What did you accomplish?"
                    className="w-full h-24 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0544E3] focus:border-[#0544E3] placeholder:text-gray-500"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Proof (optional)</label>
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-gray-50 text-gray-600 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-100">
                    {image ? (
                        <span className="text-sm text-green-600">{image.name}</span>
                    ) : (
                        <>
                            <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                            <span className="text-sm">Click to upload an image or video</span>
                        </>
                    )}
                </label>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*,video/*"/>
            </div>
            <Button fullWidth onClick={handleSubmit} disabled={!notes.trim()}>
                Submit for Verification
            </Button>
        </div>
    );
};

export default ProofUploadModal;
