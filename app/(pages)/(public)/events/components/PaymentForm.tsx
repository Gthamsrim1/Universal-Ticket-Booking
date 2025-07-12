import { CardElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { CreditCard, Lock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface PaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
  onCancel: () => void;
  ticketCount: number;
  totalAmount: number;
  eventTitle: string;
}

const PaymentForm = ({ 
  clientSecret, 
  onPaymentSuccess, 
  onCancel, 
  ticketCount, 
  totalAmount, 
  eventTitle 
}: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'idle' | 'processing' | 'succeeded' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [billingDetails, setBillingDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!billingDetails.name || !billingDetails.email) {
      setErrorMessage('Please fill in all required fields');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
          payment_method_data: {
            billing_details: {
              name: billingDetails.name,
              email: billingDetails.email,
              phone: billingDetails.phone,
            },
          },
        },
        redirect: "if_required",
      });

      if (result.error) {
        console.error('Payment error:', result.error.message);
        setErrorMessage(result.error.message || 'Payment failed. Please try again.');
        setStatus('error');
      } else if (result.paymentIntent?.status === 'succeeded') {
        setStatus('succeeded');
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setBillingDetails(prev => ({ ...prev, [field]: value }));
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  if (status === 'succeeded') {
    return (
      <div className='lg:col-span-1'>
        <div className='bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-xl p-6 sticky top-8 border border-green-400/30'>
          <div className='text-center'>
            <CheckCircle className='w-16 h-16 text-green-400 mx-auto mb-4' />
            <h3 className='text-2xl font-bold mb-2 text-green-400'>Payment Successful!</h3>
            <p className='text-gray-300 mb-4'>Processing your booking...</p>
            <div className='flex justify-center'>
              <Loader2 className='w-6 h-6 animate-spin text-green-400' />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='lg:col-span-1'>
      <div className='bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 sticky top-8 border border-blue-400/30'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-6 h-6 text-blue-400' />
          <h3 className='text-2xl font-bold'>Payment Details</h3>
        </div>

        <div className='bg-slate-800/50 rounded-lg p-4 mb-6 border border-slate-700'>
          <h4 className='font-semibold mb-3 text-blue-400'>Order Summary</h4>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Event:</span>
              <span className='font-medium'>{eventTitle}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Tickets:</span>
              <span className='font-medium'>{ticketCount}</span>
            </div>
            <div className='flex justify-between border-t border-slate-600 pt-2 mt-2'>
              <span className='text-gray-400'>Total:</span>
              <span className='font-bold text-green-400'>₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            <h4 className='font-semibold text-gray-200'>Billing Information</h4>
            
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Full Name *
              </label>
              <input
                type='text'
                value={billingDetails.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder='Enter your full name'
                className='w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Email Address *
              </label>
              <input
                type='email'
                value={billingDetails.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder='Enter your email address'
                className='w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>
                Phone Number
              </label>
              <input
                type='tel'
                value={billingDetails.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder='Enter your phone number'
                className='w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Card Details *
            </label>
            <div className='bg-white rounded-lg p-4 border border-slate-600'>
              <PaymentElement />
            </div>
          </div>

          <div className='flex items-center gap-2 text-sm text-gray-400 bg-slate-800/30 p-3 rounded-lg'>
            <Lock className='w-4 h-4' />
            <span>Your payment information is secure and encrypted</span>
          </div>

          {status === 'error' && (
            <div className='flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg border border-red-500/20'>
              <XCircle className='w-4 h-4' />
              <span className='text-sm'>{errorMessage}</span>
            </div>
          )}

          <div className='space-y-3'>
            <button
              type='submit'
              disabled={!stripe || status === 'processing'}
              className='w-full bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
            >
              {status === 'processing' ? (
                <>
                  <Loader2 className='w-4 h-4 animate-spin' />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className='w-4 h-4' />
                  Pay ₹{totalAmount}
                </>
              )}
            </button>

            <button
              type='button'
              onClick={onCancel}
              disabled={status === 'processing'}
              className='w-full bg-transparent border-2 border-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-600 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
          </div>
        </form>

        <div className='mt-6 pt-4 border-t border-slate-700'>
          <p className='text-xs text-gray-400 text-center'>
            We accept all major credit and debit cards
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;