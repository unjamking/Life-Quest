import React, { useState } from 'react';
import Modal from '../common/Modal';
import { createGuild } from '../../services/mockApi';
import type { Guild } from '../../types';
import { Plus, Loader } from 'lucide-react';

interface CreateGuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGuildCreated: (newGuild: Guild) => void;
}

const CreateGuildModal: React.FC<CreateGuildModalProps> = ({ isOpen, onClose, onGuildCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !description.trim()) {
            alert("Please fill out all fields.");
            return;
        }
        setIsLoading(true);
        try {
            const { newGuild } = await createGuild(name, description);
            onGuildCreated(newGuild);
            onClose();
            setName('');
            setDescription('');
        } catch (error) {
            alert("Failed to create guild. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Guild">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="guild-name" className="block text-sm font-medium text-dark-3 dark:text-light-3">Guild Name</label>
                <input 
                    type="text" 
                    id="guild-name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full bg-light-2 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1" 
                    placeholder="The Legends"
                    required 
                />
            </div>
             <div>
                <label htmlFor="guild-desc" className="block text-sm font-medium text-dark-3 dark:text-light-3">Description</label>
                <textarea 
                    id="guild-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full bg-light-2 dark:bg-dark-3 border-light-3 dark:border-dark-3 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-purple focus:border-brand-purple text-dark-1 dark:text-light-1"
                    placeholder="A short, catchy description for your guild."
                    required
                ></textarea>
            </div>
             <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
                {isLoading ? <Loader className="animate-spin w-5 h-5"/> : <Plus className="w-5 h-5" />}
                <span>{isLoading ? "Creating..." : "Create Guild"}</span>
            </button>
        </form>
    </Modal>
  );
};

export default CreateGuildModal;