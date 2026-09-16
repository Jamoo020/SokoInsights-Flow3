import { Banknote, Clock3 } from "lucide-react";
import { useEffect, useState } from "react";
import { MIN_WITHDRAWAL, ksh } from "@/lib/data";

type WithdrawalActivity = {
  name: string;
  amount: number;
  method: "M-Pesa";
  time: string;
};

const withdrawalActivities: WithdrawalActivity[] = [
  { name: "Brian Mwangi", amount: 4500, method: "M-Pesa", time: "2 minutes ago" },
  { name: "Aisha Wanjiku", amount: 7500, method: "M-Pesa", time: "Just now" },
  { name: "Kevin Otieno", amount: 3000, method: "M-Pesa", time: "4 minutes ago" },
  { name: "Mercy Njeri", amount: 5750, method: "M-Pesa", time: "6 minutes ago" },
  { name: "Daniel Kiptoo", amount: 10000, method: "M-Pesa", time: "8 minutes ago" },
  { name: "Faith Atieno", amount: 2500, method: "M-Pesa", time: "10 minutes ago" },
  { name: "Samuel Kamau", amount: 6500, method: "M-Pesa", time: "12 minutes ago" },
  { name: "Grace Wambui", amount: 4000, method: "M-Pesa", time: "14 minutes ago" },
  { name: "Joseph Odhiambo", amount: 8000, method: "M-Pesa", time: "16 minutes ago" },
  { name: "Ann Waithera", amount: 3500, method: "M-Pesa", time: "18 minutes ago" },
  { name: "Peter Kariuki", amount: 9000, method: "M-Pesa", time: "20 minutes ago" },
  { name: "Lilian Akinyi", amount: 2750, method: "M-Pesa", time: "22 minutes ago" },
  { name: "Mark Maina", amount: 5000, method: "M-Pesa", time: "24 minutes ago" },
  { name: "Esther Nyambura", amount: 7000, method: "M-Pesa", time: "26 minutes ago" },
  { name: "George Mutua", amount: 4500, method: "M-Pesa", time: "28 minutes ago" },
  { name: "Cynthia Chebet", amount: 6000, method: "M-Pesa", time: "30 minutes ago" },
  { name: "Anthony Kiplagat", amount: 2500, method: "M-Pesa", time: "32 minutes ago" },
  { name: "Nancy Muthoni", amount: 8500, method: "M-Pesa", time: "34 minutes ago" },
  { name: "Martin Ouma", amount: 3250, method: "M-Pesa", time: "36 minutes ago" },
  { name: "Beatrice Wairimu", amount: 6500, method: "M-Pesa", time: "38 minutes ago" },
  { name: "Collins Were", amount: 10000, method: "M-Pesa", time: "40 minutes ago" },
  { name: "Irene Jepchirchir", amount: 3750, method: "M-Pesa", time: "42 minutes ago" },
  { name: "Robert Njuguna", amount: 5500, method: "M-Pesa", time: "44 minutes ago" },
  { name: "Caroline Akoth", amount: 2500, method: "M-Pesa", time: "46 minutes ago" },
  { name: "Emmanuel Kosgei", amount: 7250, method: "M-Pesa", time: "48 minutes ago" },
  { name: "Purity Wambui", amount: 4250, method: "M-Pesa", time: "50 minutes ago" },
  { name: "Isaac Barasa", amount: 9000, method: "M-Pesa", time: "52 minutes ago" },
  { name: "Ruth Nyokabi", amount: 4750, method: "M-Pesa", time: "54 minutes ago" },
  { name: "David Omondi", amount: 8000, method: "M-Pesa", time: "56 minutes ago" },
  { name: "Susan Naliaka", amount: 3000, method: "M-Pesa", time: "58 minutes ago" },
  { name: "Eric Muriithi", amount: 6250, method: "M-Pesa", time: "1 hour ago" },
  { name: "Hellen Auma", amount: 3500, method: "M-Pesa", time: "1 hour ago" },
  { name: "Francis Karanja", amount: 9750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Joan Chepkemoi", amount: 5000, method: "M-Pesa", time: "1 hour ago" },
  { name: "Benson Wekesa", amount: 2750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Miriam Wanjiru", amount: 6750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Patrick Kiprono", amount: 4000, method: "M-Pesa", time: "1 hour ago" },
  { name: "Diana Moraa", amount: 8750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Wilson Njoroge", amount: 2500, method: "M-Pesa", time: "1 hour ago" },
  { name: "Salome Adhiambo", amount: 5750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Stephen Mwangi", amount: 7250, method: "M-Pesa", time: "1 hour ago" },
  { name: "Janet Wambui", amount: 4500, method: "M-Pesa", time: "1 hour ago" },
  { name: "Michael Ochieng", amount: 8250, method: "M-Pesa", time: "1 hour ago" },
  { name: "Agnes Njeri", amount: 3250, method: "M-Pesa", time: "1 hour ago" },
  { name: "Allan Kipchumba", amount: 9500, method: "M-Pesa", time: "1 hour ago" },
  { name: "Susan Wairimu", amount: 6000, method: "M-Pesa", time: "1 hour ago" },
  { name: "Charles Mutiso", amount: 3750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Lucy Achieng", amount: 7750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Dennis Kinyanjui", amount: 5250, method: "M-Pesa", time: "1 hour ago" },
  { name: "Mary Chebet", amount: 2500, method: "M-Pesa", time: "1 hour ago" },
  { name: "Geoffrey Kamau", amount: 8750, method: "M-Pesa", time: "1 hour ago" },
  { name: "Rose Wanjala", amount: 4750, method: "M-Pesa", time: "1 hour ago" },
];

const randomDelay = () => 5000 + Math.floor(Math.random() * 10001);

function shuffledIndexes(length: number) {
  const indexes = Array.from({ length }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes;
}

export function WithdrawalActivity() {
  const [activity, setActivity] = useState<WithdrawalActivity | null>(null);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    let order = shuffledIndexes(withdrawalActivities.length);
    let position = 0;

    const scheduleNext = (delay: number) => {
      timeoutId = window.setTimeout(() => {
        const nextActivity = withdrawalActivities[order[position]];
        position += 1;
        if (position === order.length) {
          order = shuffledIndexes(withdrawalActivities.length);
          position = 0;
        }

        setIsExiting(false);
        setActivity(nextActivity);
        timeoutId = window.setTimeout(() => {
          setIsExiting(true);
          timeoutId = window.setTimeout(() => {
            setActivity(null);
            scheduleNext(randomDelay());
          }, 450);
        }, 5000);
      }, delay);
    };

    scheduleNext(randomDelay());
    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!activity || activity.amount < MIN_WITHDRAWAL) return null;

  return (
    <aside
      aria-label="Recent demo withdrawal activity"
      className={`withdrawal-activity ${isExiting ? "withdrawal-activity-exit" : "withdrawal-activity-enter"}`}
    >
      <div className="withdrawal-activity-icon" aria-hidden="true">
        <Banknote className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
          Recent activity · Demo
        </p>
        <p className="text-sm font-extrabold text-ink">{activity.name}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Withdrew <strong className="font-bold text-ink">{ksh(activity.amount)}</strong> via{" "}
          {activity.method}
        </p>
        <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
          <Clock3 className="size-3" aria-hidden="true" /> {activity.time}
        </p>
        <p className="sr-only">Demo recent activity notification, not a verified transaction.</p>
      </div>
    </aside>
  );
}
