"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "@/trpc/react";

const VerifyPage = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(["", "", "", "", "", "", "", "" ]);
  const router = useRouter();

  let emailLS: string = localStorage?.getItem('verificationProp') || '';
  console.log("email from ls", emailLS);
  
  let emailLSParts = emailLS?.split('@');
  console.log('emailLSParts', emailLSParts);
  // let propEmail: string = localStorage.getItem('verificationProp') || "default@domain.com"; 
  
  // const emailParts: string[] | null = propEmail.split('@'); 

  let obsEmail: string = "";
  obsEmail = emailLSParts?.[0]?.slice(0, 3) + "***@" + emailLSParts?.[1] || ""; 
  
  const verifyEmail = api.user.verifyEmail.useMutation({
    onSuccess: async () => {
      setError(null);
      // Redirect to the login page
      localStorage.removeItem('verificationProp'); // Clear storage
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
    let verificationStr = "";
    setFormData((prevData) => {
      let newFormData = [...prevData.slice(0, index), value, ...prevData.slice(index + 1)];
      let verificationStr = newFormData.join('');
    console.log("verificationStr", verificationStr);
    setVerificationCode(verificationStr);
      return newFormData});
    console.log("verificationStr", verificationStr);
   
  };
  
  return (

    <div className="w-full max-w-xs text-black">
      <div className="flex flex-col gap-2">
       
      <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-4">Verify Your Email</h1>

      <p className="text-gray-600 text-center mb-8">
      Enter the 8 digit code you have received on {obsEmail}
      </p>
    {error && <p>{error}</p>}
      <div className="flex justify-center">
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log("verification submitted");
          verifyEmail.mutate({ email :emailLS, verificationCode });
        }}
          >
            <label>Code</label>
            <div className="grid grid-cols-8 gap-4" >
          {formData.map((item, index) => (
          <input
            key={index} // Add a unique key for each input
            type="text"
            maxLength={1}
	    value={item}
            className="autotab w-full rounded-sm px-1 py-2 border-2 border-black-500 text-black"
            
            onChange={(e) => {
		console.log("in onChange digigt1");
            if (`${e.target.value.length}` === e.target.getAttribute("maxlength")) {
              var inputs = document.getElementsByClassName("autotab");
        
              for (let i = 0; i < inputs.length; i++) {
                if (e.target == inputs[i]) {
                  i++;
                  if (i < inputs.length) {
                    let next: any = inputs[i];
                    next.focus();
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
