import { Eye, EyeOff } from "lucide-react";

interface ShowPasswordProps {
  showPassword: boolean;
  onClick: () => void;
}

const ShowPassword = ({ showPassword, onClick }: ShowPasswordProps) => {
    
  return (
    <>
      {showPassword ? (
        <div
          onClick={onClick}
          className="cursor-pointer group flex justify-center items-center pl-2"
        >
          <Eye className="opacity-60 text-white group-hover:opacity-100 transition" />
        </div>
      ) : (
        <div
          onClick={onClick}
          className="cursor-pointer group flex justify-center items-center pl-2"
        >
          <EyeOff className="opacity-60 text-white group-hover:opacity-100 transition" />
        </div>
      )}
    </>
  );
};

export default ShowPassword;
