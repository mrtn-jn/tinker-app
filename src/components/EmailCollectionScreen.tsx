'use client';

import { useEmailSubmission } from '@/hooks/useEmailSubmission';
import { useEffect } from 'react';
import Image from 'next/image';

interface EmailCollectionScreenProps {
  onSuccess?: () => void;
}

export default function EmailCollectionScreen({ onSuccess }: EmailCollectionScreenProps) {
  const { email, status, handleSubmit, handleChange } = useEmailSubmission();

  // Call onSuccess callback when submission succeeds
  useEffect(() => {
    if (status.type === 'success' && onSuccess) {
      onSuccess();
    }
  }, [status, onSuccess]);

  const isSubmitting = status.type === 'submitting';

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* Red background (top 1/3) */}
      <div className="h-1/3 bg-brand-red flex items-center justify-center">
        {/* Logo at 75% size */}
        <Image
          src="/info/tinker_splash.png"
          alt="Tinker Logo"
          width={120}
          height={222}
          priority
        />
      </div>

      {/* White form area (bottom 2/3) */}
      <div className="h-2/3 bg-white flex items-center justify-center p-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
            Hace match con tu par ideal.
          </h1>

          <input
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="tu@correo.com"
            disabled={isSubmitting}
            aria-label="Correo electrónico"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 
                       focus:outline-none focus:ring-2 focus:ring-brand-red 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          />

          {status.type === 'error' && (
            <p className="text-red-600 text-sm mb-4" role="alert">
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-brand-red text-white rounded-lg font-semibold 
                       hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed 
                       transition-colors shadow-lg text-lg"
          >
            {isSubmitting ? 'Enviando...' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}
