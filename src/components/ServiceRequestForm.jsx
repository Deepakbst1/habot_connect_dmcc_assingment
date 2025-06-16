import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Form validation schemas
const childDetailsSchema = yup.object().shape({
  childName: yup.string().required('Child name is required'),
  age: yup.number()
    .typeError('Age must be a number')
    .required('Age is required')
    .positive('Age must be positive')
    .integer('Age must be a whole number')
    .max(18, 'Age must be 18 or less'),
  diagnosis: yup.string().required('Diagnosis is required'),
  schoolType: yup.string().required('School type is required'),
});

const serviceNeedsSchema = yup.object().shape({
  supportTypes: yup.array().min(1, 'Select at least one support type'),
  frequency: yup.string().required('Frequency is required'),
  requirements: yup.string(),
});

const contactInfoSchema = yup.object().shape({
  parentName: yup.string().required('Parent name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, "Phone number must contain only numbers")
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must not exceed 15 digits'),
});

const ServiceRequestForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    trigger
  } = useForm({
    resolver: yupResolver(
      step === 1 ? childDetailsSchema : 
      step === 2 ? serviceNeedsSchema : 
      contactInfoSchema
    ),
    defaultValues: formData
  });

  const onSubmit = async (data) => {
    const isValid = await trigger();
    if (!isValid) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    if (step < 3) {
      setFormData({ ...formData, ...data });
      setStep(step + 1);
      toast.success(`Step ${step} completed successfully!`);
    } else {
      const finalData = { ...formData, ...data };
      console.log('Form submitted:', finalData);
      setIsSubmitted(true);
      toast.success('Form submitted successfully!');
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      toast.info(`Returned to step ${step - 1}`);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Thank You!</h2>
        <p className="text-gray-700">
          Your service request has been submitted successfully. 
          We'll contact you shortly for discussion.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Service Request Form</h1>
      
      {/* Progress indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center 
                ${step === stepNumber ? 'bg-blue-600 text-white' : 
                 step > stepNumber ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {stepNumber}
            </div>
            <span className="text-xs mt-1 text-gray-600">
              {stepNumber === 1 ? 'Child Details' : 
               stepNumber === 2 ? 'Service Needs' : 'Contact Info'}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Child Details */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Child Information</h2>
            
            <div>
              <label className="block text-gray-700 mb-1">Child's Name*</label>
              <input
                {...register('childName')}
                className={`w-full p-2 border rounded ${errors.childName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Child's full name"
              />
              {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Age*</label>
              <input
                type="number"
                {...register('age')}
                className={`w-full p-2 border rounded ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Age in years"
                min="1"
                max="18"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Diagnosis/Condition*</label>
              <select
                {...register('diagnosis')}
                className={`w-full p-2 border rounded ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select diagnosis</option>
                <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                <option value="ADHD">ADHD</option>
                <option value="Dyslexia">Dyslexia</option>
                <option value="Dyscalculia">Dyscalculia</option>
                <option value="Other">Other</option>
              </select>
              {errors.diagnosis && <p className="text-red-500 text-sm mt-1">{errors.diagnosis.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Current School Type*</label>
              <div className="space-y-2">
                {['Public', 'Private', 'Homeschool', 'Other'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="radio"
                      {...register('schoolType')}
                      value={type}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {errors.schoolType && <p className="text-red-500 text-sm mt-1">{errors.schoolType.message}</p>}
            </div>
          </div>
        )}

        {/* Service Needs */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Service Needs</h2>
            
            <div>
              <label className="block text-gray-700 mb-1">Type of Support Needed*</label>
              <div className="space-y-2">
                {['Academic Tutoring', 'Behavioral Therapy', 'Speech Therapy', 'Occupational Therapy', 'Social Skills Training'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('supportTypes')}
                      value={type}
                      className="mr-2"
                    />
                    {type}
                  </label>
                ))}
              </div>
              {errors.supportTypes && <p className="text-red-500 text-sm mt-1">{errors.supportTypes.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Preferred Frequency*</label>
              <select
                {...register('frequency')}
                className={`w-full p-2 border rounded ${errors.frequency ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select frequency</option>
                <option value="Once a week">Once a week</option>
                <option value="Twice a week">Twice a week</option>
                <option value="Three times a week">Three times a week</option>
                <option value="Daily">Daily</option>
                <option value="Other">Other</option>
              </select>
              {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Specific Requirements</label>
              <textarea
                {...register('requirements')}
                className="w-full p-2 border border-gray-300 rounded"
                rows="4"
                placeholder="Any specific needs, preferences, or additional information"
              />
            </div>
          </div>
        )}

        {/* Contact Information */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
            
            <div>
              <label className="block text-gray-700 mb-1">Parent/Guardian Name*</label>
              <input
                {...register('parentName')}
                className={`w-full p-2 border rounded ${errors.parentName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your full name"
              />
              {errors.parentName && <p className="text-red-500 text-sm mt-1">{errors.parentName.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Email*</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Phone Number*</label>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full p-2 border rounded ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Your phone number (digits only)"
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Previous
            </button>
          )}
          
          <button
            type="submit"
            className={`px-4 py-2 rounded ml-auto ${step === 3 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {step === 3 ? 'Submit Request' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;