"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { formatRupiah } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Pencil,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";

type GoalData = {
  _id: string;
  userId: string;
  month: number;
  year: number;
  incomeTarget: number;
  expenseLimit: number;
  savingsTarget: number;
  actualIncome: number;
  actualExpense: number;
  actualSavings: number;
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const MONTH_OPTIONS = MONTH_NAMES.map((m, i) => ({ value: i.toString(), label: m }));

/**
 * Komponen halaman Goals Bulanan dengan pemilih bulan/tahun.
 */
export function MonthlyGoals() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const goalData = useQuery(api.goals.getByMonth, {
    month: selectedMonth,
    year: selectedYear,
  }) as GoalData | null | undefined;
  const setGoal = useMutation(api.goals.set);

  const [isEditing, setIsEditing] = useState(false);
  const [incomeTarget, setIncomeTarget] = useState("0");
  const [expenseLimit, setExpenseLimit] = useState("0");
  const [savingsTarget, setSavingsTarget] = useState("0");
  const [isSaving, setIsSaving] = useState(false);

  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => ({
    value: (currentYear - 3 + i).toString(),
    label: (currentYear - 3 + i).toString(),
  }));

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = selectedMonth + direction;
    let newYear = selectedYear;
    if (newMonth < 0) { newMonth = 11; newYear -= 1; }
    if (newMonth > 11) { newMonth = 0; newYear += 1; }
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setIsEditing(false);
  };

  const startEditing = () => {
    if (goalData) {
      setIncomeTarget(goalData.incomeTarget.toString());
      setExpenseLimit(goalData.expenseLimit.toString());
      setSavingsTarget(goalData.savingsTarget.toString());
    } else {
      setIncomeTarget("0");
      setExpenseLimit("0");
      setSavingsTarget("0");
    }
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setGoal({
        month: selectedMonth,
        year: selectedYear,
        incomeTarget: parseFloat(incomeTarget) || 0,
        expenseLimit: parseFloat(expenseLimit) || 0,
        savingsTarget: parseFloat(savingsTarget) || 0,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal menyimpan goal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const calcProgress = (actual: number, target: number) => {
    if (target <= 0) return 0;
    return Math.min(Math.round((actual / target) * 100), 100);
  };

  const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();

  if (goalData === undefined) {
    return (
      <div className="nb-card animate-pulse bg-gray-200 p-8">
        <div className="h-6 w-48 rounded bg-gray-300" />
        <div className="mt-6 h-40 rounded bg-gray-300" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Month/Year Selector */}
      <Card color="yellow">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <h2 className="text-lg font-extrabold">Pilih Bulan & Tahun</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigateMonth(-1)} className="nb-btn bg-white p-2">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <Select
              value={selectedMonth.toString()}
              onChange={(e) => { setSelectedMonth(parseInt(e.target.value)); setIsEditing(false); }}
              options={MONTH_OPTIONS}
            />
            <Select
              value={selectedYear.toString()}
              onChange={(e) => { setSelectedYear(parseInt(e.target.value)); setIsEditing(false); }}
              options={yearOptions}
            />
            <button onClick={() => navigateMonth(1)} className="nb-btn bg-white p-2">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        {isCurrentMonth && (
          <p className="mt-2 text-sm font-bold opacity-60">Bulan saat ini</p>
        )}
      </Card>

      {/* Form Mode */}
      {isEditing && (
        <Card color="cyan">
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-6 w-6" />
                <h2 className="text-lg font-extrabold">
                  Set Goal — {MONTH_NAMES[selectedMonth]} {selectedYear}
                </h2>
              </div>
              <button type="button" onClick={() => setIsEditing(false)} className="nb-btn bg-white p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-bold">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Income ideal versimu?
                </label>
                <Input type="number" placeholder="0" value={incomeTarget}
                  onChange={(e) => setIncomeTarget(e.target.value)} min="0" />
                <p className="mt-1 text-xs font-bold opacity-60">{formatRupiah(parseFloat(incomeTarget) || 0)}</p>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-bold">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Batas pengeluaranmu
                </label>
                <Input type="number" placeholder="0" value={expenseLimit}
                  onChange={(e) => setExpenseLimit(e.target.value)} min="0" />
                <p className="mt-1 text-xs font-bold opacity-60">{formatRupiah(parseFloat(expenseLimit) || 0)}</p>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-sm font-bold">
                  <PiggyBank className="h-4 w-4 text-blue-500" />
                  Target nabung kamu
                </label>
                <Input type="number" placeholder="0" value={savingsTarget}
                  onChange={(e) => setSavingsTarget(e.target.value)} min="0" />
                <p className="mt-1 text-xs font-bold opacity-60">{formatRupiah(parseFloat(savingsTarget) || 0)}</p>
              </div>
            </div>

            <Button type="submit" variant="primary" disabled={isSaving}>
              <Check className="h-4 w-4" />
              {isSaving ? "Menyimpan..." : "Simpan Goal"}
            </Button>
          </form>
        </Card>
      )}

      {/* Progress Display */}
      {!isEditing && goalData && (
        <Card color="white">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6" />
              <h2 className="text-lg font-extrabold">
                Goal {MONTH_NAMES[selectedMonth]} {selectedYear}
              </h2>
            </div>
            <button onClick={startEditing} className="nb-btn bg-nb-cyan p-2" title="Edit goal">
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-col gap-5">
            <ProgressBar
              icon={<TrendingUp className="h-4 w-4 text-green-600" />}
              label="Income Target" actual={goalData.actualIncome} target={goalData.incomeTarget}
              progress={calcProgress(goalData.actualIncome, goalData.incomeTarget)}
              barColor={calcProgress(goalData.actualIncome, goalData.incomeTarget) >= 100 ? "bg-nb-green" : "bg-nb-cyan"}
              note={`${calcProgress(goalData.actualIncome, goalData.incomeTarget)}% tercapai${calcProgress(goalData.actualIncome, goalData.incomeTarget) >= 100 ? " 🎉" : ""}`}
            />
            <ProgressBar
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              label="Batas Pengeluaran" actual={goalData.actualExpense} target={goalData.expenseLimit}
              progress={calcProgress(goalData.actualExpense, goalData.expenseLimit)}
              barColor={goalData.actualExpense > goalData.expenseLimit && goalData.expenseLimit > 0 ? "bg-nb-pink" : calcProgress(goalData.actualExpense, goalData.expenseLimit) > 75 ? "bg-nb-orange" : "bg-nb-green"}
              isExpense expenseLimit={goalData.expenseLimit}
            />
            <ProgressBar
              icon={<PiggyBank className="h-4 w-4 text-blue-500" />}
              label="Target Nabung" actual={goalData.actualSavings} target={goalData.savingsTarget}
              progress={calcProgress(Math.max(goalData.actualSavings, 0), goalData.savingsTarget)}
              barColor={goalData.actualSavings >= goalData.savingsTarget && goalData.savingsTarget > 0 ? "bg-nb-green" : "bg-nb-yellow"}
              isSavings savingsTarget={goalData.savingsTarget}
            />
          </div>
        </Card>
      )}

      {/* No goal set */}
      {!isEditing && !goalData && (
        <Card color="white" className="text-center">
          <Target className="mx-auto h-12 w-12 opacity-30" />
          <h3 className="mt-3 text-lg font-extrabold">Belum ada goal</h3>
          <p className="mb-4 text-sm opacity-60">Belum ada goal untuk {MONTH_NAMES[selectedMonth]} {selectedYear}</p>
          <Button variant="primary" onClick={startEditing}>
            <Target className="h-4 w-4" /> Set Goal Sekarang
          </Button>
        </Card>
      )}
    </div>
  );
}

/** Sub-component for a single goal progress bar with animated stripes */
function ProgressBar({ icon, label, actual, target, progress, barColor, note, isExpense, expenseLimit, isSavings, savingsTarget }: {
  icon: React.ReactNode; label: string; actual: number; target: number;
  progress: number; barColor: string; note?: string;
  isExpense?: boolean; expenseLimit?: number; isSavings?: boolean; savingsTarget?: number;
}) {
  const isOver = isExpense && actual > (expenseLimit || 0) && (expenseLimit || 0) > 0;
  const isOnTrack = isSavings && actual >= (savingsTarget || 0) && (savingsTarget || 0) > 0;
  const isComplete = progress >= 100;

  let bottomNote = note || `${progress}% tercapai`;
  if (isExpense) {
    bottomNote = isOver
      ? `Over budget! Melebihi ${formatRupiah(actual - (expenseLimit || 0))}`
      : `${progress}% terpakai — sisa ${formatRupiah(Math.max((expenseLimit || 0) - actual, 0))}`;
  } else if (isSavings) {
    bottomNote = progress >= 100 ? "Target tercapai! 🎉" : actual < 0
      ? `Belum nabung — defisit ${formatRupiah(Math.abs(actual))}` : `${progress}% tercapai`;
  }

  return (
    <div className="group rounded-xl border-2 border-black/10 bg-white/50 p-3 transition-all hover:border-black/20 hover:bg-white/80">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">{icon}<span className="text-sm font-bold">{label}</span></div>
        <span className={`text-sm font-extrabold ${isOver ? "text-red-600" : isOnTrack ? "text-green-600" : ""}`}>
          {formatRupiah(actual)} / {formatRupiah(target)}
        </span>
      </div>
      <div className="h-5 w-full overflow-hidden rounded-full border-3 border-black bg-gray-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${isComplete && !isOver ? "nb-progress-striped" : ""}`}
          style={{ width: `${Math.max(progress, 0)}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <p className={`text-xs font-bold ${isOver ? "text-red-600" : "opacity-60"}`}>{bottomNote}</p>
        <span className={`text-xs font-extrabold ${isOver ? "text-red-600" : isComplete ? "text-green-600" : "opacity-40"}`}>
          {progress}%
        </span>
      </div>
    </div>
  );
}
