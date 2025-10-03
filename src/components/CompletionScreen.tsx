import { InfoBox } from './InfoBox';

/**
 * Completion screen shown after all sneakers are reviewed
 * Displays promotional code and link to drifters.com.ar
 */
export function CompletionScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold text-white">
          ¡Gracias por participar!
        </h1>
        
        <InfoBox className="text-center p-3">
          <p className="text-xl font-semibold mb-2">
            Tu código promocional:
          </p>
          <p className="text-3xl font-bold tracking-wider">
            SNEAKERS_HEART
          </p>
        </InfoBox>

        <p className="text-gray-100 text-lg">
          Usá este código en tu próxima compra y hacé match con el par perfecto para vos.
        </p>

        <a
          href="https://drifters.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-brand-red px-8 py-4 rounded-lg 
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
