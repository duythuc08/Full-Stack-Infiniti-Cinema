"use client";

import type { ShowtimeDate, ShowtimeData } from "@/types";

interface ShowtimesProps {
  data: ShowtimeData | null;
  days: ShowtimeDate[];
  selectedDate: number;
  onSelectDate: (index: number) => void;
  onSelect: (info: {
    cinema: string;
    location: string;
    time: string;
    showTimeId: number;
    date: string;
    roomName: string;
  }) => void;
}

export function Showtimes({ data, days, selectedDate, onSelectDate, onSelect }: ShowtimesProps) {
  const handleSelectTime = (
    cinema: { name: string; location: string },
    timeObj: { id: number; time: string; roomName: string }
  ) => {
    onSelect({
      cinema: cinema.name,
      location: cinema.location,
      time: timeObj.time,
      showTimeId: timeObj.id,
      date: data?.date ?? "",
      roomName: timeObj.roomName,
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12 max-w-[1920px] mx-auto bg-background">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
          Lịch Chiếu
        </h2>
      </div>

      {/* Date tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => onSelectDate(idx)}
            className={`flex-none px-5 py-2.5 rounded-xl border transition-all duration-200 whitespace-nowrap cursor-pointer text-sm font-medium ${
              selectedDate === idx
                ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground bg-secondary/40"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Showtimes grid */}
      {!data || !data.cinemas || data.cinemas.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-2xl border-border bg-secondary/20">
          <p className="text-muted-foreground text-base">
            {days.length === 0
              ? "Hiện chưa có lịch chiếu cho phim này."
              : `Chưa có suất chiếu cho ngày ${days[selectedDate]?.label ?? ""}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.cinemas.map((cinema, cIndex) => (
            <div
              key={cIndex}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="mb-5 pb-4 border-b border-border/60">
                <h3 className="text-base font-semibold text-card-foreground">{cinema.name}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{cinema.location}</p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {cinema.times.map((timeObj, tIndex) => (
                  <button
                    key={tIndex}
                    onClick={() => handleSelectTime(cinema, timeObj)}
                    className="px-5 py-2 bg-secondary border border-border rounded-xl hover:bg-primary hover:text-primary-foreground hover:border-primary hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 text-sm font-semibold cursor-pointer"
                  >
                    {timeObj.time}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
