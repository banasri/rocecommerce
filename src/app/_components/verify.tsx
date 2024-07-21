"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "@/trpc/react";

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(["", "", "", "", "", "", "", "" ]);
  const router = useRouter();
  const [emailLS, setEmailLS] = useState<string>('');
  const [obsEmail, setObsEmail] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if window is available
      const storedEmail = localStorage.getItem('verificationProp') ?? '';
      setEmailLS(storedEmail);
      const emailLSParts = storedEmail?.split('@');
       console.log('emailLSParts', emailLSParts);

      let tempEmail = "";
      tempEmail = emailLSParts?.[0]?.slice(0, 3) + "***@" + emailLSParts?.[1] || ""; 
      setObsEmail(tempEmail);
    }
  }, []);

  
  
  const verifyEmail = api.user.verifyEmail.useMutation({
    onSuccess: async () => {
      setError(null);
      if (typeof window !== 'undefined'){
        localStorage.removeItem('verificationProp');
      }
      router.push('/login');
    },
    onError: async (error) => {
      setError(error.message);
    },
  });


  const handleInputChange = (index: number, value: string) => {
    console.log("In handleInputChange verify");
    console.log("value", value);
    console.log("formData before setF", formData);
  
    setFormData((prevData) => {
      const newFormData = [...prevData.slice(0, index), value, ...prevData.slice(index + 1)];
      const verificationStr = newFormData.join('');
      console.log("verificationStr", verificationStr);
      setVerificationCode(verificationStr);
      return newFormData});
      
   
  };
  
  return (

    <div className="w-full max-w-xs text-black">
      <div className="flex flex-col gap-2">
       
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>

      <p className="text-gray-600 text-center mb-8 text-sm  ">
      Enter the 8 digit code you have received on <span className="font-bold">{obsEmail}</span>
      </p>
    {error && <p className="text-red-500" >{error}</p>}
      <div className="flex justify-center">
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("verification submitted");
          verifyEmail.mutate({ email :emailLS, verificationCode });
        }}
          >
            <label>Code</label>
            <div className="grid grid-cols-8 gap-2" >
          {formData.map((item, index) => (
          <input
            key={index} // Add a unique key for each input
            type="text"
            maxLength={1}
	    value={item}
            className="autotab w-full rounded-sm px-1 py-1 border-2 border-black-500 text-black"
            
            onChange={(e) => {
		console.log("in onChange digigt1");
            if (`${e.target.value.length}` === e.target.getAttribute("maxlength")) {
              const inputs  = document.querySelectorAll<HTMLInputElement>(".autotab");
        
              for (let i = 0; i < inputs.length; i++) {
                if (e.target == inputs[i]) {
                  i++;
                  if (i < inputs.length) {
                    const next = inputs[i];
                    if(next) {
                      next.focus();
                    }
                  }
                }
              }
            }
	    handleInputChange(index, e.target.value)}}
          />
        ))}
        </div>

        
<div className="flex justify-center mt-8">
        <button type="submit" className="w-full rounded-sm bg-black text-white mt-4 text-sm h-8">VERIFY</button>
      </div>
      
      
            
          </form>
        
      </div>

      
    </div>
       </div>
    
  </div>
  );
};

export default VerifyPage;
