type Props = {
    onSubmit: () => void;
    submitLabel: string;
    children: React.ReactNode;
};

export default function Form({ onSubmit, submitLabel, children }: Props) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            {children}
            <button type="submit" className="bg-blue-600 cursor-pointer font-bold text-white py-2 rounded hover:bg-blue-700 transition">
                {submitLabel}
            </button>
        </form>
    );
}
