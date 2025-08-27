import React, { useState, useRef, useEffect } from 'react';
import { CoachIcon } from './icons';
import { useAppContext } from '../context/AppContext';
import { ModalType } from '../types';

const FloatingCoachButton: React.FC = () => {
    const { showModal } = useAppContext();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: -100, y: -100 }); // Start off-screen
    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    // Set initial position based on parent container
    useEffect(() => {
        if (buttonRef.current?.parentElement) {
            const parentRect = buttonRef.current.parentElement.getBoundingClientRect();
            const buttonSize = 48; // w-12
            const navBarHeight = 80; // h-20
            const padding = 16;
            
            setPosition({
                x: parentRect.width - buttonSize - padding,
                y: parentRect.height - navBarHeight - buttonSize - padding,
            });
        }
    }, []);

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setIsDragging(true);
        hasMoved.current = false;
        // Use non-passive listener to prevent default scroll behavior on touch devices
        e.preventDefault();
    };
    
    const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement>) => {
        if (!buttonRef.current) return;
        const touch = e.touches[0];
        const rect = buttonRef.current.getBoundingClientRect();
        offset.current = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top,
        };
        setIsDragging(true);
        hasMoved.current = false;
    };
    

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging || !buttonRef.current?.parentElement) return;
        hasMoved.current = true;
        const parentRect = buttonRef.current.parentElement.getBoundingClientRect();
        setPosition({
            x: e.clientX - parentRect.left - offset.current.x,
            y: e.clientY - parentRect.top - offset.current.y,
        });
    };

    const handleTouchMove = (e: TouchEvent) => {
        if (!isDragging || !buttonRef.current?.parentElement) return;
        hasMoved.current = true;
        const touch = e.touches[0];
        const parentRect = buttonRef.current.parentElement.getBoundingClientRect();
        setPosition({
            x: touch.clientX - parentRect.left - offset.current.x,
            y: touch.clientY - parentRect.top - offset.current.y,
        });
    };


    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (buttonRef.current && buttonRef.current.parentElement) {
            const parentEl = buttonRef.current.parentElement;
            const parentWidth = parentEl.offsetWidth;
            const parentHeight = parentEl.offsetHeight;
            const buttonWidth = buttonRef.current.offsetWidth;
            const buttonHeight = buttonRef.current.offsetHeight;
            const padding = 16;
            const navBarHeight = 80;

            let newX = position.x;
            let newY = position.y;

            // Clamp position within parent
            if (newX < padding) newX = padding;
            if (newX + buttonWidth > parentWidth - padding) newX = parentWidth - padding - buttonWidth;
            if (newY < padding) newY = padding;
            if (newY + buttonHeight > parentHeight - navBarHeight - padding) newY = parentHeight - navBarHeight - padding - buttonHeight;
            
            setPosition({ x: newX, y: newY });
        }
    };
    
    const handleClick = () => {
        if (!hasMoved.current) {
            {/* FIX: Use ModalType enum for type safety. */}
            showModal(ModalType.AI_COACH);
        }
    }

    useEffect(() => {
        const handleUp = () => handleMouseUp();
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging]);

    return (
        <button
            ref={buttonRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onClick={handleClick}
            style={{
                visibility: position.x < 0 ? 'hidden' : 'visible',
                left: `${position.x}px`,
                top: `${position.y}px`,
                transition: isDragging ? 'none' : 'all 0.3s ease-out',
                touchAction: 'none',
            }}
            className="absolute bg-[#0544E3] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30 transform hover:scale-110"
        >
            <CoachIcon className="w-7 h-7" />
        </button>
    );
};

export default FloatingCoachButton;