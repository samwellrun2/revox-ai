"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("revox-consent");
    if (!consent) setShow(true);
  }, []);

  function accept() {
    localStorage.setItem("revox-consent", "accepted");
    setShow(false);
  }

  function reject() {
    localStorage.setItem("revox-consent", "rejected");
    setShow(false);
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl shadow-black/10 border border-brand-border p-6">
            <p className="text-sm text-brand-text/80 mb-4">
              We use essential cookies to keep you logged in and make the app work. We don&apos;t use tracking or advertising cookies. By continuing, you agree to our{" "}
              <Link href="/privacy" className="text-brand-primary hover:underline">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="/terms" className="text-brand-primary hover:underline">Terms of Service</Link>.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={accept}
                className="px-5 py-2 rounded-xl bg-brand-primary hover:bg-brand-primary-hover text-white text-sm font-medium transition-colors"
              >
                Accept
              </button>
              <button
                onClick={reject}
                className="px-5 py-2 rounded-xl border border-brand-border hover:bg-gray-50 text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
