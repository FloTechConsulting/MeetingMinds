import { useState } from 'react';
import { copyToClipboard } from '../utils/clipboardUtils';

export const useCopyToClipboard = () => {
  const [copySuccess, setCopySuccess] = useState(false);

  const copy = async (text: string): Promise<boolean> => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
    
    return success;
  };

  return { copy, copySuccess };
};