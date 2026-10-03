'use client';

import React, { useState } from 'react';
import { useParkours } from '../lib/context';
import { Reward } from '../lib/types';
import confetti from 'canvas-confetti';
import {
  Gift,
  Plus,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Check,
  X,
  Tag,
} from 'lucide-react';

export const RewardsStore: React.FC = () => {
  const {
    currentUser,
    rewards,
    redemptions,
    redeemReward,
    addReward,
    deleteReward,
    approveRedemption,
    rejectRedemption,
  } = useParkours();

  const isTeacher = currentUser.role === 'teacher';

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCost, setNewCost] = useState(150);
  const [newIcon, setNewIcon] = useState('🎁');
  const [newCategory, setNewCategory] = useState<Reward['category']>('Privilèges');
  const [newStock, setNewStock] = useState(5);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  const handleRedeem = (reward: Reward) => {
    const res = redeemReward(reward.id, currentUser.id);
    if (res.success) {
      triggerConfetti();
      setFeedbackMsg({ type: 'success', text: res.message });
    } else {
      setFeedbackMsg({ type: 'error', text: res.message });
    }

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addReward({
      title: newTitle,
      description: newDesc,
      cost: Number(newCost),
      icon: newIcon || '🎁',
      category: newCategory,
      stock: Number(newStock),
    });

    setNewTitle('');
    setNewDesc('');
    setIsAddModalOpen(false);
  };

  const filteredRewards = rewards.filter(
    (r) => selectedCategory === 'all' || r.category === selectedCategory
  );

  return (
    <div className="space-y-8 font-mono-custom">
      {/* HEADER CARD */}
      <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[5px_5px_0px_#000000]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-600 block mb-1">
              BOUTIQUE ACADÉMIQUE • TUTORAT
            </span>
            <h1 className="font-bebas text-4xl sm:text-5xl font-black text-black tracking-wide leading-none uppercase">
              RÉCOMPENSES & PRIVILÈGES
            </h1>
            <p className="text-xs text-slate-700 font-bold mt-2 max-w-xl">
              Convertissez vos points gagnés avec vos devoirs contre des privilèges et cadeaux réels !
            </p>
          </div>

          <div className="flex items-center gap-4">
            {!isTeacher && (
              <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_#FF4D00] flex items-center gap-3">
                <span className="text-2xl">💎</span>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-600 block">
                    VOTRE SOLDE
                  </span>
                  <span className="font-bebas text-3xl font-black text-black block leading-none">
                    {currentUser.points} PTS
                  </span>
                </div>
              </div>
            )}

            {isTeacher && (
              <button onClick={() => setIsAddModalOpen(true)} className="neo-btn-primary">
                <Plus className="w-5 h-5" /> CRÉER UNE RÉCOMPENSE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`p-4 border-2 border-black shadow-[4px_4px_0px_#000] font-bold text-xs flex items-center gap-3 uppercase ${
            feedbackMsg.type === 'success' ? 'bg-[#E8F5E9] text-emerald-950' : 'bg-[#FFEBEE] text-rose-950'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          ) : (
            <XCircle className="w-5 h-5 text-rose-700" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* TEACHER APPROVAL PANEL */}
      {isTeacher && redemptions.filter((r) => r.status === 'pending').length > 0 && (
        <div className="bg-[#FFF3E0] border-2 border-black p-5 shadow-[5px_5px_0px_#000] space-y-3">
          <h3 className="font-bebas text-2xl font-black text-black uppercase flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#E65100]" /> DEMANDES D&apos;ÉCHANGE À VALIDER ({redemptions.filter((r) => r.status === 'pending').length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {redemptions
              .filter((r) => r.status === 'pending')
              .map((red) => (
                <div
                  key={red.id}
                  className="bg-white border-2 border-black p-3.5 flex items-center justify-between text-xs font-bold"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{red.rewardIcon}</span>
                    <div>
                      <div className="font-extrabold uppercase text-black">{red.rewardTitle}</div>
                      <div className="text-slate-700">
                        ÉLÈVE : <span className="text-black font-black uppercase">{red.studentName}</span> ({red.cost} PTS)
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => approveRedemption(red.id)}
                      className="neo-btn-primary py-1 px-3 text-xs"
                    >
                      <Check className="w-4 h-4" /> VALIDER
                    </button>
                    <button
                      onClick={() => rejectRedemption(red.id)}
                      className="neo-btn-secondary py-1 px-2.5 text-xs"
                    >
                      <X className="w-4 h-4" /> REFUSER
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'Privilèges', 'Bonus', 'Cadeaux', 'Activités'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 border-2 border-black font-bebas text-lg tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-black text-white shadow-[3px_3px_0px_#FF4D00]'
                : 'bg-white text-black hover:bg-[#FAF7F2]'
            }`}
          >
            {cat === 'all' ? 'TOUTES LES RÉCOMPENSES' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CATALOG GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = currentUser.points >= reward.cost;
          const hasStock = reward.stock > 0;

          return (
            <div
              key={reward.id}
              className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_#D81B60] flex flex-col justify-between transition-transform hover:-translate-y-1 relative"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-14 h-14 border-2 border-black bg-[#FAF7F2] flex items-center justify-center text-3xl shadow-[3px_3px_0px_#000]">
                    {reward.icon}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl font-black text-black bg-[#FFF3E0] px-3 py-0.5 border-2 border-black">
                      {reward.cost} PTS
                    </span>

                    {isTeacher && (
                      <button
                        onClick={() => deleteReward(reward.id)}
                        className="text-black hover:text-[#FF4D00] p-1"
                        title="Supprimer cette récompense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-bebas text-2xl font-black text-black tracking-wide leading-tight uppercase">
                  {reward.title}
                </h3>
                <p className="text-xs font-semibold text-slate-800 mt-2 leading-relaxed bg-[#FAF7F2] p-3 border border-black">
                  {reward.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t-2 border-black flex items-center justify-between font-mono-custom">
                <div className="text-[11px] font-bold uppercase text-slate-700">
                  STOCK : <span className={hasStock ? 'text-black font-black' : 'text-rose-700 font-black'}>
                    {hasStock ? `${reward.stock} DISPO` : 'ÉPUISÉ'}
                  </span>
                </div>

                {!isTeacher ? (
                  <button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !hasStock}
                    className={canAfford && hasStock ? 'neo-btn-primary' : 'neo-btn-secondary opacity-50 cursor-not-allowed'}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{canAfford ? 'ÉCHANGER' : 'PTS INSUFFISANTS'}</span>
                  </button>
                ) : (
                  <span className="neo-badge bg-white">APERÇU ÉLÈVE</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: CREATE REWARD */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-mono-custom">
          <div className="bg-white border-2 border-black w-full max-w-lg p-6 shadow-[8px_8px_0px_#000000] space-y-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h2 className="font-bebas text-2xl font-black text-black">
                CRÉER UNE RÉCOMPENSE
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-black font-bold text-xl hover:text-[#FF4D00]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateReward} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-extrabold uppercase mb-1">EMOJI</label>
                  <input
                    type="text"
                    required
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full text-center text-2xl py-1 border-2 border-black font-bold focus:outline-none"
                  />
                </div>

                <div className="col-span-3">
                  <label className="block text-xs font-extrabold uppercase mb-1">TITRE *</label>
                  <input
                    type="text"
                    required
                    placeholder="EX: 15 MIN DE PAUSE JEUX"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">COÛT PTS *</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    required
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">CATÉGORIE</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Reward['category'])}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none uppercase"
                  >
                    <option value="Privilèges">PRIVILÈGES</option>
                    <option value="Bonus">BONUS</option>
                    <option value="Cadeaux">CADEAUX</option>
                    <option value="Activités">ACTIVITÉS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase mb-1">STOCK</label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase mb-1">DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Détails du privilège..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-black text-xs font-bold focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-black">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="neo-btn-secondary"
                >
                  ANNULER
                </button>
                <button type="submit" className="neo-btn-primary">
                  AJOUTER LA RÉCOMPENSE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
