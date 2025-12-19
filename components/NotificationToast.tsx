"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";

export type NotificationType = {
  message: string;
  type: "success" | "error" | "info" | "crisis";
};

type Props = {
  notification: NotificationType | null;
  onClose: () => void;
};

export default function NotificationToast({ notification, onClose }: Props) {
  return (
    <AnimatePresence>
      {notification && (
        <motion.div 
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`
            fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md border
            ${notification.type === 'error' ? 'bg-red-900/80 border-red-500/50 text-red-100' : 
              notification.type === 'success' ? 'bg-green-900/80 border-green-500/50 text-green-100' :
              notification.type === 'crisis' ? 'bg-orange-900/90 border-orange-500 text-white font-bold w-[90%] md:w-auto justify-between shadow-orange-900/50 shadow-lg' :
              'bg-neutral-800/90 border-neutral-700 text-white'}
          `}
        >
          <div className="flex items-center gap-3">
            {notification.type === 'error' && <AlertTriangle className="w-5 h-5" />}
            {notification.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {notification.type === 'crisis' && <AlertTriangle className="w-6 h-6 animate-pulse" />}
            {notification.type === 'info' && <Info className="w-5 h-5" />}
            <span className="text-sm">{notification.message}</span>
          </div>
          
          {notification.type === 'crisis' && (
             <a 
               href="https://findahelpline.com" 
               target="_blank" 
               rel="noreferrer"
               className="bg-white text-orange-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-orange-100 transition-colors ml-4"
             >
               Get Help
             </a>
          )}

          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors ml-2"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}