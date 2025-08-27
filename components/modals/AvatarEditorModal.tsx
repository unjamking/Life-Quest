import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { useAppContext } from '../../context/AppContext';
import Button from '../Button';

interface AvatarEditorModalProps {
  imageSrc: string;
}

// This function is required by react-image-crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}


const AvatarEditorModal: React.FC<AvatarEditorModalProps> = ({ imageSrc }) => {
    const { hideModal, updateUser, showToast } = useAppContext();
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const aspect = 1;

    useEffect(() => {
      // Revoke the object URL on cleanup to avoid memory leaks
      return () => {
          URL.revokeObjectURL(imageSrc);
      };
    }, [imageSrc]);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }

    async function handleSaveCrop() {
        const image = imgRef.current;
        if (!image || !completedCrop || !completedCrop.width || !completedCrop.height) {
            showToast('Invalid crop selection.', 'error');
            return;
        }

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const offscreen = new OffscreenCanvas(
            completedCrop.width * scaleX,
            completedCrop.height * scaleY
        );

        const ctx = offscreen.getContext('2d');
        if (!ctx) {
            showToast('Could not process image.', 'error');
            return;
        }
        
        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            completedCrop.width * scaleX,
            completedCrop.height * scaleY,
            0,
            0,
            offscreen.width,
            offscreen.height
        );
        
        const blob = await offscreen.convertToBlob({
            type: 'image/png',
        });
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            if(typeof base64data === 'string') {
                updateUser({ avatarUrl: base64data });
                showToast('Avatar updated!', 'success');
                hideModal();
            }
        };
    }

    return (
        <div className="flex flex-col items-center">
            <div className="w-full h-64 flex justify-center items-center bg-gray-100 rounded-md mb-4 overflow-hidden">
                 <ReactCrop
                    crop={crop}
                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    circularCrop
                    minWidth={100}
                >
                    <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imageSrc}
                        onLoad={onImageLoad}
                        className="max-h-64"
                    />
                </ReactCrop>
            </div>
            <p className="text-sm text-gray-500 mb-4">Drag and resize the circle to crop your new avatar.</p>
            <div className="w-full flex space-x-2">
                <Button fullWidth variant="secondary" onClick={hideModal}>Cancel</Button>
                <Button fullWidth onClick={handleSaveCrop}>Save Avatar</Button>
            </div>
        </div>
    );
};

export default AvatarEditorModal;
