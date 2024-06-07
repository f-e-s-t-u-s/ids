import React, { useState } from 'react'
import axios from 'axios';
import toast, {Toaster} from 'react-hot-toast';
function Forgot() {
  const [formData, setFormData] = useState({
    email: '',
  });

  const [loading, setLoading] = useState(false);
  // andel input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/forgot-password', formData);
      if (response.status === 200) {
        toast.success("Password reset code sent successfully");
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
      console.log(response);
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        toast.error("Email not found");
      }
    } finally {
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
            <h1 className="h1 mb-4">Forgot your password?</h1>
            <p className="text-xl text-gray-400">We'll email you instructions on how to reset it.</p>
          </div>

          {/* Form */}
          <div className="max-w-sm mx-auto">
            <form>
              <div className="flex flex-wrap -mx-3 mb-4">
                <div className="w-full px-3">
                  <label className="block text-gray-300 text-sm font-medium mb-1" htmlFor="email">Email</label>
                  <input value={formData.email} onChange={handleChange} id="email" type="email" className="form-input w-full text-gray-300" placeholder="you@yourcompany.com" required />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mt-6">
                <div className="w-full px-3">
                  <button onClick={handleSubmit} className="btn text-white bg-purple-600 hover:bg-purple-700 w-full">
                    {loading ? 'Loading...' : 'Send reset code'}
                  </button>
                </div>
              </div>
            </form>
            <div className="text-gray-400 text-center mt-6">
              <a href="/login" className="text-purple-600 hover:text-gray-200 transition duration-150 ease-in-out">Cancel</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Forgot