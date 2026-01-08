"use client";
interface RollingDotsLoaderProps {
  size?: number; // px
  color?: string; // Tailwind color class
}

const RollingDotsLoader: React.FC<RollingDotsLoaderProps> = ({
  size = 8,
  color = "bg-sky-500",
}) => {
  return (
    <div className="flex gap-2">
      {[0, 0.2, 0.4].map((delay, index) => (
        <span
          key={index}
          className={`${color} rounded-full animate-bounce`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${delay}s`,
          }}
        />
      ))}
    </div>
  );
};


interface LoadingModalProps {
  isOpen: boolean;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center">
        <RollingDotsLoader size={10} color="bg-sky-500" />
        <p className="mt-4 text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingModal;