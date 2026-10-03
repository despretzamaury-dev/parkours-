'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Homework, Grade, Reward, RewardRedemption } from './types';
import {
  INITIAL_USERS,
  INITIAL_HOMEWORK,
  INITIAL_GRADES,
  INITIAL_REWARDS,
  INITIAL_REDEMPTIONS,
} from './initialData';

interface ParkoursContextType {
  currentUser: UserProfile;
  users: UserProfile[];
  homeworks: Homework[];
  grades: Grade[];
  rewards: Reward[];
  redemptions: RewardRedemption[];
  setCurrentUserId: (id: string) => void;
  submitHomework: (homeworkId: string, studentId: string, submissionText: string) => void;
  gradeHomework: (homeworkId: string, studentId: string, grade: number, feedback: string) => void;
  addHomework: (newHw: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => void;
  deleteHomework: (id: string) => void;
  addGrade: (newGrade: Omit<Grade, 'id'>) => void;
  deleteGrade: (id: string) => void;
  addReward: (newReward: Omit<Reward, 'id'>) => void;
  deleteReward: (id: string) => void;
  redeemReward: (rewardId: string, studentId: string) => { success: boolean; message: string };
  approveRedemption: (redemptionId: string) => void;
  rejectRedemption: (redemptionId: string) => void;
  addBonusPoints: (studentId: string, points: number, xp: number) => void;
  resetToDemoData: () => void;
}

const ParkoursContext = createContext<ParkoursContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'parkours_users_v4',
  HOMEWORK: 'parkours_homework_v4',
  GRADES: 'parkours_grades_v4',
  REWARDS: 'parkours_rewards_v4',
  REDEMPTIONS: 'parkours_redemptions_v4',
  CURRENT_USER_ID: 'parkours_current_user_id_v4',
};

export function ParkoursProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [homeworks, setHomeworks] = useState<Homework[]>(INITIAL_HOMEWORK);
  const [grades, setGrades] = useState<Grade[]>(INITIAL_GRADES);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>(INITIAL_REDEMPTIONS);
  const [currentUserId, setCurrentUserIdState] = useState<string>('student-come');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedHomework = localStorage.getItem(STORAGE_KEYS.HOMEWORK);
      const storedGrades = localStorage.getItem(STORAGE_KEYS.GRADES);
      const storedRewards = localStorage.getItem(STORAGE_KEYS.REWARDS);
      const storedRedemptions = localStorage.getItem(STORAGE_KEYS.REDEMPTIONS);
      const storedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

      if (storedUsers) setUsers(JSON.parse(storedUsers));
      if (storedHomework) setHomeworks(JSON.parse(storedHomework));
      if (storedGrades) setGrades(JSON.parse(storedGrades));
      if (storedRewards) setRewards(JSON.parse(storedRewards));
      if (storedRedemptions) setRedemptions(JSON.parse(storedRedemptions));
      if (storedUserId) setCurrentUserIdState(storedUserId);
    } catch (e) {
      console.error('Failed to load local storage:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      localStorage.setItem(STORAGE_KEYS.HOMEWORK, JSON.stringify(homeworks));
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
      localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
      localStorage.setItem(STORAGE_KEYS.REDEMPTIONS, JSON.stringify(redemptions));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
    } catch (e) {
      console.error('Failed to save to local storage:', e);
    }
  }, [users, homeworks, grades, rewards, redemptions, currentUserId, isLoaded]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const setCurrentUserId = (id: string) => {
    setCurrentUserIdState(id);
  };

  const submitHomework = (homeworkId: string, studentId: string, submissionText: string) => {
    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id !== homeworkId) return hw;
        const currentSub = hw.submissions[studentId] || {};
        return {
          ...hw,
          submissions: {
            ...hw.submissions,
            [studentId]: {
              ...currentSub,
              status: 'submitted',
              submissionText,
              submittedAt: new Date().toISOString(),
            },
          },
        };
      })
    );
  };

  const gradeHomework = (
    homeworkId: string,
    studentId: string,
    gradeVal: number,
    feedbackText: string
  ) => {
    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id !== homeworkId) return hw;

        const isFirstGrading = hw.submissions[studentId]?.status !== 'graded';
        const xpAmount = hw.xpReward || 50;

        // Add grade & feedback to submission
        const updatedSubmissions = {
          ...hw.submissions,
          [studentId]: {
            ...hw.submissions[studentId],
            status: 'graded' as const,
            grade: gradeVal,
            feedback: feedbackText,
            gradedAt: new Date().toISOString(),
          },
        };

        // If first time graded, reward XP and points to student
        if (isFirstGrading) {
          addBonusPoints(studentId, xpAmount, xpAmount);
        }

        return {
          ...hw,
          submissions: updatedSubmissions,
        };
      })
    );

    // Also add entry into Grades table for gradebook tracking
    const hw = homeworks.find((h) => h.id === homeworkId);
    if (hw) {
      addGrade({
        studentId,
        subject: hw.subject,
        title: `Devoir : ${hw.title}`,
        grade: gradeVal,
        maxGrade: 20,
        coeff: 2,
        date: new Date().toISOString().split('T')[0],
        teacherComment: feedbackText || 'Devoir rendu et corrigé.',
      });
    }
  };

  const addHomework = (newHw: Omit<Homework, 'id' | 'createdAt' | 'submissions'>) => {
    const created: Homework = {
      ...newHw,
      id: `hw-${Date.now()}`,
      createdAt: new Date().toISOString(),
      submissions: {},
    };
    setHomeworks((prev) => [created, ...prev]);
  };

  const deleteHomework = (id: string) => {
    setHomeworks((prev) => prev.filter((h) => h.id !== id));
  };

  const addGrade = (newGrade: Omit<Grade, 'id'>) => {
    const created: Grade = {
      ...newGrade,
      id: `gr-${Date.now()}`,
    };
    setGrades((prev) => [created, ...prev]);
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  const addReward = (newReward: Omit<Reward, 'id'>) => {
    const created: Reward = {
      ...newReward,
      id: `rew-${Date.now()}`,
    };
    setRewards((prev) => [created, ...prev]);
  };

  const deleteReward = (id: string) => {
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const redeemReward = (rewardId: string, studentId: string) => {
    const reward = rewards.find((r) => r.id === rewardId);
    const student = users.find((u) => u.id === studentId);

    if (!reward || !student) {
      return { success: false, message: 'Récompense ou élève introuvable.' };
    }

    if (reward.stock <= 0) {
      return { success: false, message: 'Rupture de stock pour cette récompense.' };
    }

    if (student.points < reward.cost) {
      return {
        success: false,
        message: `Points insuffisants ! Il vous manque ${reward.cost - student.points} points.`,
      };
    }

    // Deduct points & update stock
    setUsers((prev) =>
      prev.map((u) => (u.id === studentId ? { ...u, points: u.points - reward.cost } : u))
    );

    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, stock: Math.max(0, r.stock - 1) } : r))
    );

    // Log redemption request
    const redemption: RewardRedemption = {
      id: `red-${Date.now()}`,
      rewardId,
      rewardTitle: reward.title,
      rewardIcon: reward.icon,
      studentId,
      studentName: student.name,
      cost: reward.cost,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setRedemptions((prev) => [redemption, ...prev]);

    return {
      success: true,
      message: `Félicitations ! Vous avez réclamé "${reward.title}". Votre tuteur validera l'échange !`,
    };
  };

  const approveRedemption = (redemptionId: string) => {
    setRedemptions((prev) =>
      prev.map((r) => (r.id === redemptionId ? { ...r, status: 'approved' as const } : r))
    );
  };

  const rejectRedemption = (redemptionId: string) => {
    const red = redemptions.find((r) => r.id === redemptionId);
    if (red && red.status === 'pending') {
      // Refund student points
      setUsers((prev) =>
        prev.map((u) => (u.id === red.studentId ? { ...u, points: u.points + red.cost } : u))
      );
    }

    setRedemptions((prev) =>
      prev.map((r) => (r.id === redemptionId ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const addBonusPoints = (studentId: string, pointsAmount: number, xpAmount: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== studentId) return u;
        const newTotalXp = u.totalXp + xpAmount;
        const newLevel = Math.floor(newTotalXp / 250) + 1;
        return {
          ...u,
          points: u.points + pointsAmount,
          totalXp: newTotalXp,
          level: newLevel,
        };
      })
    );
  };

  const resetToDemoData = () => {
    setUsers(INITIAL_USERS);
    setHomeworks(INITIAL_HOMEWORK);
    setGrades(INITIAL_GRADES);
    setRewards(INITIAL_REWARDS);
    setRedemptions(INITIAL_REDEMPTIONS);
    setCurrentUserIdState('student-1');
    localStorage.clear();
  };

  return (
    <ParkoursContext.Provider
      value={{
        currentUser,
        users,
        homeworks,
        grades,
        rewards,
        redemptions,
        setCurrentUserId,
        submitHomework,
        gradeHomework,
        addHomework,
        deleteHomework,
        addGrade,
        deleteGrade,
        addReward,
        deleteReward,
        redeemReward,
        approveRedemption,
        rejectRedemption,
        addBonusPoints,
        resetToDemoData,
      }}
    >
      {children}
    </ParkoursContext.Provider>
  );
}

export function useParkours() {
  const context = useContext(ParkoursContext);
  if (!context) {
    throw new Error('useParkours must be used within a ParkoursProvider');
  }
  return context;
}
