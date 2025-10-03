import Image from 'next/image';

/**
 * Fixed header component with Sneaker Heart logo
 * Remains visible at top during scrolling
 */
export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24">
      <div className="container mx-auto h-full py-4 flex justify-center items-center">
        <Image
          src="/info/sneakers-heart-logo.png"
          alt="Sneaker Heart"
          width={216}
          height={60}
          priority
          className="h-[60px] w-auto"
        />
      </div>
    </header>
  );
}
