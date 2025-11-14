import { SubmitButtonProps } from "../../../interface";

export default function SubmitButton({ loading, onClick }: SubmitButtonProps) {
    return (
        <button
            name="Update Request"
            className="w-full py-3 px-6 rounded-lg bg-sky-600 hover:bg-indigo-600 text-white font-medium transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            onClick={onClick}
            disabled={loading}
        >
            {loading ? "Updating..." : "Update Request"}
        </button>
    );
}

