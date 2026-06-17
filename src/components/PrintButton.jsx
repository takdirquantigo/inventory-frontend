import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import MyDocument from './Invoice';
import { Printer } from 'lucide-react';


const PrintButton = ({ content }) => {
    console.log(content)
  const [loading, setLoading] = useState(false);

  const handlePrint = async () => {
    setLoading(true);
    try {      
        const blob = await pdf(<MyDocument  content={content} />).toBlob();
        const url = URL.createObjectURL(blob);
      
        window.open(url, '_blank');
      
        setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePrint} 
      disabled={loading}
      className='text-zinc-900'
    >
      {loading ? 'Generating PDF...' :  <Printer width={20} height={20} />}
    </button>
  );
};

export default PrintButton;