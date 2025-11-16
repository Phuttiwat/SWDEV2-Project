"use client";

import { useEffect, useState } from "react";

export default function SuccessPopup({ message }: { message: string }) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    if (!message) return;

    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 5000); // 5 วิ
    return () => clearTimeout(timer);
  }, [message]);

  if (!visible) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg text-lg pointer-events-auto animate-fade-in">
        {message}
      </div>
    </div>
  );
}
