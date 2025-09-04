import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Skill } from '../../../types';
import { X, Zap, Loader } from 'lucide-react';
import { modalContentVariants, modalOverlayVariants } from '../../../utils/animations';

interface QuestGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (selectedSkills: Skill['name'][]) => void;
  skills: Skill[];
  isGenerating: boolean;
}

const QuestGenerationModal: React.FC<QuestGenerationModalProps> = ({ isOpen, onClose, onGenerate, skills, isGenerating }) => {
  const [selectedSkills, setSelectedSkills] = useState<Set<Skill['name']>>(new Set());

  const handleSkillToggle = (skillName: Skill['name']) => {
    setSelectedSkills(prev => {
      const newSet = new Set(prev);
      if (newSet.has(skillName)) {
        newSet.delete(skillName);
      } else {
        newSet.add(skillName);
      }
      return newSet;
    });
  };
  
  const handleGenerateClick = () => {
    if (selectedSkills.size > 0) {
      onGenerate(Array.from(selectedSkills));
    } else {
      alert("Please select at least one skill to generate quests for.");
    }
  };

  const handleClose = () => {
    setSelectedSkills(new Set());
    onClose();
  };


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
              <h2 className="text-xl font-bold text-dark-1 dark:text-light-1">Generate New Quests</h2>
              <button onClick={handleClose} className="text-dark-3 dark:text-light-3 hover:text-dark-1 dark:hover:text-light-1">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-dark-3 dark:text-light-3 mb-6">Choose your focus. The AI will generate quests based on your selected skills.</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {skills.map(skill => {
                    const isSelected = selectedSkills.has(skill.name);
                    return (
                        <motion.button
                            key={skill.id}
                            onClick={() => handleSkillToggle(skill.name)}
                            className={`p-4 rounded-lg border-2 text-center transition-all ${isSelected ? 'border-brand-purple bg-brand-purple/10' : 'border-light-3 dark:border-dark-3 bg-light-1 dark:bg-dark-3 hover:border-dark-3/50'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <skill.icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-brand-purple' : 'text-dark-3 dark:text-light-3'}`} />
                            <span className={`font-semibold ${isSelected ? 'text-brand-purple' : 'text-dark-2 dark:text-light-2'}`}>{skill.name}</span>
                        </motion.button>
                    )
                })}
            </div>

            <button
                onClick={handleGenerateClick}
                disabled={isGenerating || selectedSkills.size === 0}
                className="w-full flex items-center justify-center space-x-2 bg-brand-purple hover:bg-brand-purple-light text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isGenerating ? <Loader className="w-5 h-5 animate-spin"/> : <Zap className="w-5 h-5" />}
                <span>Generate Quests</span>
            </button>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
  );
};

export default QuestGenerationModal;