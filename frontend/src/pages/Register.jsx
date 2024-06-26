import React, { useState } from 'react'
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';

function Register() {

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);


  // handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: formData.fullName,
        company_name: formData.companyName,
        email: formData.email,
        password: formData.password
      }
     const response = await axios.post('http://localhost:3000/api/register', data);

     if(response.status === 200){
      toast.success("User registered successfully");
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
     }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  }


  return (
    <section className="relative">
      <Toaster />
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="pt-32 pb-12 md:pt-40 md:pb-20">

        {/* Page header */}
        <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
          <h1 className="h1">Welcome. We exist to make your business secure.</h1>
        </div>

        {/* Form */}
        <div className="max-w-sm mx-auto">
          <form>
            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <button className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
                  <svg className="w-4 h-4 fill-current text-white opacity-75 shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2-4.4 4.3-4.4 1.4 0 2.3.6 2.8 1.1l1.9-1.8C11.5 1.7 9.9 1 8 1 4.1 1 1 4.1 1 8s3.1 7 7 7c4 0 6.7-2.8 6.7-6.8 0-.5 0-.8-.1-1.2H7.9z" />
                  </svg>
                  <span className="h-6 flex items-center border-r border-white border-opacity-25 mr-4" aria-hidden="true"></span>
                  <span className="flex-auto pl-16 pr-8 -ml-16">Sign up with Google</span>
                </button>
              </div>
            </div>
          </form>
          <div className="flex items-center my-6">
            <div className="border-t border-gray-700 border-dotted grow mr-3" aria-hidden="true"></div>
            <div className="text-gray-400">Or, register with your email</div>
            <div className="border-t border-gray-700 border-dotted grow ml-3" aria-hidden="true"></div>
          </div>
          <form>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="full-name">Full Name <span className="text-red-600">*</span></label>
                <input onChange={handleChange} id="fullName" type="text" className="form-input w-full text-gray-300" placeholder="First and last name" required value={formData.fullName} />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="company-name">Company Name <span className="text-red-600">*</span></label>
                <input onChange={handleChange} value={formData.companyName} id="companyName" type="text" className="form-input w-full text-gray-300" placeholder="Your company or app name" required />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Work Email <span className="text-red-600">*</span></label>
                <input onChange={handleChange} value={formData.email} id="email" type="email" className="form-input w-full text-gray-300" placeholder="you@yourcompany.com" required />
              </div>
            </div>
            <div className="flex flex-wrap -mx-3 mb-4">
              <div className="w-full px-3">
                <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="password">Password <span className="text-red-600">*</span></label>
                <input onChange={handleChange} value={formData.password} id="password" type="password" className="form-input w-full text-gray-300" placeholder="Password (at least 10 characters)" required />
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center">
              I agree to be contacted by Th3 Phoenix about this offer as per our <a href="#" className="underline text-gray-400 hover:text-gray-200 hover:no-underline transition duration-150 ease-in-out">Privacy Policy</a>.
            </div>
            <div className="flex flex-wrap -mx-3 mt-6">
              <div className="w-full px-3">
                <button  onClick={handleSubmit} className="btn text-white bg-purple-600 hover:bg-purple-700 w-full">
                  {loading ? 'Loading...' : 'Sign up'}
                </button>
              </div>
            </div>
          </form>
          <div className="text-gray-400 text-center mt-6">
            Already using Th3 Phoenix? <a href="/login" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Sign in</a>
          </div>
        </div>

      </div>
    </div>
  </section>
  )
}

export default Register