"use client";

import { useState } from "react";

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hover:text-white transition-colors text-left"
      >
        Hubungi Kami
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-5 w-[320px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold text-white mb-4">Hubungi Kami</h3>
            <div className="space-y-2.5">
              <a
                href="https://wa.me/6285157434365"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#3a3a3a] bg-[#252525] p-3 hover:border-[#4caf50] transition-colors"
              >
                <span className="text-xl">💬</span>
                <div>
                  <div className="text-xs font-medium text-white">WhatsApp</div>
                  <div className="text-[10px] text-[#777]">+62 851-5743-4365</div>
                </div>
              </a>
              <a
                href="https://instagram.com/nyinyistore"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-lg border border-[#3a3a3a] bg-[#252525] p-3 hover:border-[#c8a45c] transition-colors"
              >
                <span className="text-xl">📸</span>
                <div>
                  <div className="text-xs font-medium text-white">Instagram</div>
                  <div className="text-[10px] text-[#777]">@nyinyistore</div>
                </div>
              </a>
              <a
                href="mailto:lakbankuning01@gmail.com"
                className="flex items-center gap-3 rounded-lg border border-[#3a3a3a] bg-[#252525] p-3 hover:border-[#c8a45c] transition-colors"
              >
                <span className="text-xl">📧</span>
                <div>
                  <div className="text-xs font-medium text-white">Email</div>
                  <div className="text-[10px] text-[#777]">lakbankuning01@gmail.com</div>
                </div>
              </a>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 w-full rounded-lg border border-[#3a3a3a] py-2 text-xs text-[#999] hover:text-white hover:border-[#555] transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
