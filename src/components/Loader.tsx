import { FaSpinner } from "react-icons/fa";

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-full">
            <FaSpinner className="text-blue-500 size-8 animate-spin" />
        </div>
    );
};

export default Loader;
