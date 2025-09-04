import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Upload } from 'lucide-react';
import { Quest } from '../../types';
import { modalContentVariants, modalOverlayVariants } from '../../utils/animations';
import QuestTimer from '../common/QuestTimer';

interface QuestCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (questId: string) => void;
  quest: Quest;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({ isOpen, onClose, onComplete, quest }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const handleSubmit = () => {
    if (!selectedFile) {
        alert("Please upload proof of completion.");
        return;
    }
    // In a real app, you would upload the file here.
    // For this simulation, we'll just proceed.
    onComplete(quest.id);
  };
  
  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={modalOverlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            variants={modalContentVariants}
            className="bg-light-2 dark:bg-dark-2 rounded-lg shadow-2xl w-full max-w-lg p-6 border border-light-3 dark:border-dark-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-dark-1 dark:text-light-1">Complete Quest</h2>
              <button onClick={handleClose} className="text-dark-3 dark:text-light-3 hover:text-dark-1 dark:hover:text-light-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-light-1 dark:bg-dark-3 p-4 rounded-lg">
                <h3 className="font-bold text-dark-1 dark:text-light-1">{quest.title}</h3>
                <p className="text-sm text-dark-3 dark:text-light-3">{quest.description}</p>
                 <div className="flex items-center justify-between mt-2">
                    <p className="text-sm font-bold text-brand-purple">+{quest.xpReward} XP</p>
                    <QuestTimer expiryTimestamp={quest.expiryTimestamp} className="text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-3 dark:text-light-3 mb-2">Upload Proof</label>
                <div 
                    className="w-full h-48 bg-light-1 dark:bg-dark-3 rounded-lg border-2 border-dashed border-light-3 dark:border-dark-3 flex items-center justify-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {previewUrl ? (
                        <img src={previewUrl} alt="Proof preview" className="w-full h-full object-contain rounded-lg p-2"/>
                    ) : (
                        <div className="text-center text-dark-3 dark:text-light-3">
                            <Upload className="mx-auto w-8 h-8"/>
                            <p>Upload a photo or video</p>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*,video/*"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!selectedFile}
              className="mt-6 w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Submit & Gain XP</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuestCompletionModal;