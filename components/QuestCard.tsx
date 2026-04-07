"use client";

import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Wallet } from "lucide-react";

export interface Quest {
  id: string;
  category: "social" | "onchain" | "community";
  title: string;
  description: string;
  points: number;
  icon: string;
  link?: string;
  requiresWallet?: boolean;
}

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onComplete: (questId: string) => void;
  walletConnected: boolean;
  isNew?: boolean;
  index?: number;
}

const CATEGORY_COLORS = {
  social: { bg: "bg-[#FF6B9D]/10", text: "text-[#FF6B9D]", border: "border-[#FF6B9D]/20" },
  onchain: { bg: "bg-gvc-gold/10", text: "text-gvc-gold", border: "border-gvc-gold/20" },
  community: { bg: "bg-gvc-green/10", text: "text-gvc-green", border: "border-gvc-green/20" },
};

const CATEGORY_LABELS = {
  social: "Social",
  onchain: "On-Chain",
  community: "Community",
};

export default function QuestCard({
  quest,
  completed,
  onComplete,
  walletConnected,
  isNew,
  index = 0,
}: QuestCardProps) {
  const colors = CATEGORY_COLORS[quest.category];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isNew ? [1, 1.05, 1] : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: index * 0.04,
        duration: 0.3,
        scale: { duration: 0.4 },
      }}
      onClick={() => onComplete(quest.id)}
      className={`relative rounded-2xl border p-5 cursor-pointer transition-all duration-300 group select-none
        ${
          completed
            ? "bg-gvc-dark border-gvc-gold/30 card-glow"
            : "bg-gvc-dark border-white/[0.08] hover:border-gvc-gold/20 hover:bg-[#181818]"
        }
      `}
    >
      {/* Completed overlay shimmer */}
      {completed && (
        <div className="absolute inset-0 rounded-2xl bg-gvc-gold/[0.03] pointer-events-none" />
      )}

      {/* Points badge */}
      <div
        className={`absolute top-4 right-4 text-xs font-display font-bold px-2.5 py-1 rounded-full transition-all
          ${
            completed
              ? "bg-gvc-gold text-gvc-black"
              : "bg-white/5 text-white/40 group-hover:bg-gvc-gold/10 group-hover:text-gvc-gold"
          }`}
      >
        +{quest.points}
      </div>

      {/* Category badge */}
      <div
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-body mb-4 ${colors.bg} ${colors.text} border ${colors.border}`}
      >
        {CATEGORY_LABELS[quest.category]}
      </div>

      {/* Icon */}
      <div className="text-4xl mb-3 leading-none">{quest.icon}</div>

      {/* Title */}
      <h3
        className={`font-display font-bold text-base mb-1.5 transition-colors leading-snug
          ${completed ? "text-gvc-gold" : "text-white group-hover:text-gvc-gold"}
        `}
      >
        {quest.title}
      </h3>

      {/* Description */}
      <p className="text-white/50 font-body text-sm leading-relaxed mb-5">
        {quest.description}
      </p>

      {/* Action row */}
      <div className="flex items-center justify-between">
        {completed ? (
          <div className="flex items-center gap-2 text-gvc-green">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-body font-semibold">Completed</span>
          </div>
        ) : quest.requiresWallet && !walletConnected ? (
          <div className="flex items-center gap-1.5 text-white/30">
            <Wallet className="w-3.5 h-3.5" />
            <span className="text-xs font-body">Wallet required</span>
          </div>
        ) : (
          <div
            className={`flex items-center gap-1.5 text-xs font-body transition-colors
              ${quest.link ? "text-white/30 group-hover:text-gvc-gold" : "text-white/30 group-hover:text-white/60"}`}
          >
            {quest.link && <ExternalLink className="w-3 h-3" />}
            <span>{quest.link ? "Opens in new tab" : "Click to complete"}</span>
          </div>
        )}

        {!completed && (
          <div className="w-8 h-8 rounded-full border border-white/[0.08] flex items-center justify-center text-white/25 group-hover:border-gvc-gold/40 group-hover:text-gvc-gold transition-all text-sm">
            →
          </div>
        )}
      </div>
    </motion.div>
  );
}
