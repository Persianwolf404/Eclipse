export default function Home() {
  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/images/eclipse.avif')" }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 backdrop-blur-md bg-black/50 z-10" />

      {/* Your content */}
      <div className="relative z-20 flex items-center justify-center h-full text-white flex flex-col">
        <h1 className="text-4xl font-bold text-red-500 text-8xl md:text-9xl">ECLIPSE</h1>
        <p className="text-center text-lg md:text-xl">
          When Creativity and Precision Align, <br /> Eclipse Happens
        </p>
        <span className="mt-10 text-md md:text-lg">coming soon...</span>
      </div>
    </div>
  );
}
