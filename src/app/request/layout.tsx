export default function BookingLayout({children}: {children: React.ReactNode}) {
    return(
        <div className="flex flex-row p-[10px]">
            {children}
        </div>
    );
}