import React from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
 
function Login() {
   
    
    const [email , setEmail ] = useState("");
    const [password , setPassword ] = useState("");
    // when user first click 
    const [accept , setAccetp] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    const [successMess , setSuccessMess] = useState(false);

 
// submit login form 
const submitForm = (e) =>{
   
    let flag = true
    e.preventDefault();
    setAccetp(true);
    if ( email === "" || password.length < 5) {
        flag = false
    }else flag = true
     if (flag) {
         let res=  axios.post(`http://127.0.0.1:8000/api/login` , {
        "email":email,
        "password":password
    } )
        .then((res)=>{
           setSuccessMess(true)
            console.log(res.data);
        })
        .catch(
            (error)=>{
                setErrorMessage(true);
                 setTimeout(() => {
                    window.location.reload();
                 }, 2000);
            })
}}

  return (
    <>
      <div className="min-h-screen bg-base-200 flex items-center">
        <div className="card mx-auto w-full max-w-2xl  shadow-xl ">
            <div className="grid col-start-1 col-end-3  bg-base-100 rounded-xl ">
            <div className='py-10 px-5  rounded-lg border-4 border-indigo-200 border-t-indigo-500   border-b-indigo-500 '>
                <h2 className='text-2xl font-semibold mb-2 text-center'>
                    سجل الدخول 
                </h2>
                {
                successMess &&  <div role="alert" className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>تم تسجيل الدخول بنجاح</span>
                </div>
                }
                <form onSubmit={(e) => submitForm(e)} dir="rtl">
                    <div className="mb-4">
                        <label >البريد الإلكتروني</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="input input-bordered w-full my-4 " placeholder='example@gmail.com'/>
                          {email == "" && accept && <p className='text-red-600 mb-4'> الرجاء إدخال البريد الإلكتروني </p>}

                        <label >كلمة السر </label>
                        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="input input-bordered w-full my-4 " placeholder='..................'/>
                        {(password === "" && accept) && <p className='text-red-600 mb-4'>الرجاء إدخال كلمة السر</p>}
                       {(password.length > 0 && password.length < 5 && accept) && <p className='text-red-600 mb-4'>يجب ألا تقل كلمة السر عن 5 أحرف</p>}
                     </div>
                    <div className='text-right text-primary'>   
                        <Link to="/forgot-password"><span className="text-sm  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">هل نسيت كلمة السر ؟</span></Link>
                    </div>
                    {errorMessage &&
                    <div role="alert" className="alert alert-error">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <span>هذا المستخدم غير مسموح له بالدخول</span>
                </div>
                    }
                     <button type="submit"  className="btn mt-2 w-full  text-lg hover:btn-primary ">دخول</button>

                    <div className='text-center mt-4'> 
                      <Link to="/register"><span className="inline-block  text-primary underline hover:cursor-pointer transition duration-200">إنشاء حساب جديد</span></Link> هل ليس لديك حساب ؟</div>
                </form>

            </div>
        </div>
        </div>
    </div>
    </>
  )
}

export default Login