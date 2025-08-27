import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { QUEST_CATEGORIES, SkillCategory } from '../../types';
import Button from '../Button';

const PreferencesModal: React.FC = () => {
    const { hideModal, generateQuests } = useAppContext();
    const [selectedCategories, setSelectedCategories] = useState<SkillCategory[]>([]);
    const [mood, setMood] = useState('');

    const toggleCategory = (category: SkillCategory) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSubmit = () => {
        generateQuests(selectedCategories, mood);
    };

    return (
        <div>
            <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Select Categories (optional)</h3>
                <div className="flex flex-wrap gap-2">
                    {QUEST_CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => toggleCategory(category)}
                            className={`px-3 py-1 text-sm rounded-full border-2 transition-colors ${
                                selectedCategories.includes(category)
                                    ? 'bg-[#0544E3] text-white border-[#0544E3]'
                                    : 'bg-white text-gray-700 border-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">How are you feeling today?</h3>
                <input
                    type="text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder=""
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0544E3] focus:border-[#0544E3] placeholder:text-gray-500"
                />
            </div>
            <Button fullWidth onClick={handleSubmit}>
                Generate Quests
            </Button>
        </div>
    );
};

export default PreferencesModal;