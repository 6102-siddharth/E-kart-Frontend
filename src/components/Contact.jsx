import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import useWeb3Forms from '@web3forms/react';


const ContactUs = () => {

    const { register, handleSubmit, reset } = useForm();
  // Replace with your Web3Forms access key
  const accessKey = 'ba275a31-3928-4c2c-a9a7-b916e9f493bc';

  const { submit } = useWeb3Forms({
    access_key: accessKey,
    settings: {
      from_name: 'Website Contact Form',
      subject: 'New Contact Form Submission',
    },
    onSuccess: () => {
      reset();
    },
    onError: () => {
      console.error('Error sending message!');
    },
  });
    
    return (
    <div className="min-h-screen bg-gray-100">
       
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Get in Touch</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Opening Hours</h3>
                <p className="text-gray-600">Mon - Sat: 10am - 10pm</p>
                <p className="text-gray-600">Sunday: Holiday</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Head Office (Maharashtra)</h3>
                <h4 className="font-medium text-gray-700 mb-2">Store Location</h4>
                <div className="text-gray-600 space-y-1">
                  <p>PVPIT , college</p>
                  <p>sangli, maharashtra</p>
                  <p>Sales: 1234567890</p>
                  <p>Sales Head:1234567890</p>
                  <p>Showroom: 1234567890</p>
                  <p>Email: siddharth@gmail.com</p>
                  <p>Email: prathmesh@gmail.com</p>
                  <p>Email: vishvajeet@gmail.com</p>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-200 rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3818.9481767728166!2d74.64349007461529!3d16.828926818654054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc123b15687e6cb%3A0x46dd977f30000000!2sBALAJI%20PROVISION!5e0!3m2!1sen!2sin!4v1750690899156!5m2!1sen!2sin"
            className="w-full h-96 border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">We're here to help!</h3>
              <p className="text-gray-600 text-sm">
                Fill out the form with any query on your mind and we'll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-4">
              {/* First Name and Last Name */}
             <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: true })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your email"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
            </label>
            <input
              id="phone"
              type="phone"
              {...register('phone', { required: true })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Phone NO."
              required
            />
          </div>


          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              {...register('message', { required: true })}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Your message"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
          >
            Send Message
          </button>
        </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;