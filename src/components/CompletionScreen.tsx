import { InfoBox } from './InfoBox';
import Image from 'next/image';

/**
 * Completion screen shown after all sneakers are reviewed
 * Displays promotional code and link to drifters.com.ar
 */
export function CompletionScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="container mx-auto h-full py-4 mb-8 flex justify-center items-center">
        <Image
          src="/info/sneakers-heart-logo.png"
          alt="Sneaker Heart"
          width={216}
          height={60}
          priority
          className="h-[60px] w-auto"
        />
      </div>
      
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          ¡Gracias por participar!
        </h1>
        <p className="text-gray-100 text-md">
          Usá este código en tu próxima compra.
        </p>
        <InfoBox className="text-center p-3 mt-8 mb-12">
          <p className="text-xl font-semibold mb-2">
            Tu código promocional:
          </p>
          <p className="text-3xl font-bold tracking-wider">
            TINKER
          </p>
        </InfoBox>

        <p className="text-gray-100 text-lg pb-0 mb-3">
          Hacé match con el par perfecto para vos.
        </p>
        <a
          href="https://drifters.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-brand-red px-4 py-2 rounded-lg 
                     font-semibold text-lg hover:bg-brand-red hover:text-black transition-colors shadow-lg"
        >
          Ir a Drifters.com.ar
        </a>

        <p className="text-sm text-gray-500 mt-8">
          
        </p>
      </div>
    </div>
  );
}
