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
      <h2 className="mb-8 text-2xl font-semibold">Lịch Chiếu</h2>

      {/* Danh sách ngày */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {days.map((day, idx) => (
          <button
            key={idx}
            onClick={() => onSelectDate(idx)}
            className={`flex-none px-6 py-3 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
              selectedDate === idx
                ? "bg-primary text-primary-foreground border-primary font-medium shadow-md"
                : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Kiểm tra và hiển thị suất chiếu */}
      {!data || !data.cinemas || data.cinemas.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg border-border">
          <p className="text-muted-foreground text-lg">
            {days.length === 0
              ? "Hiện chưa có lịch chiếu cho phim này."
              : `Chưa có suất chiếu cho ngày ${days[selectedDate]?.label ?? ""}.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {data.cinemas.map((cinema, cIndex) => (
            <div
              key={cIndex}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4 border-b pb-2 border-border/50">
                <h3 className="text-lg font-semibold text-card-foreground">{cinema.name}</h3>
                <p className="text-sm text-muted-foreground">{cinema.location}</p>
              </div>

              <div className="flex flex-wrap gap-3">
                {cinema.times.map((timeObj, tIndex) => (
                  <button
                    key={tIndex}
                    onClick={() => handleSelectTime(cinema, timeObj)}
                    className="px-6 py-2 bg-background border border-input rounded-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-sm font-medium shadow-sm cursor-pointer"
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
