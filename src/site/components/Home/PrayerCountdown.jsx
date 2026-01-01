import { useState } from "react";

const PrayerCountdown = ({ prayerTimes }) => {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [nextPrayer, setNextPrayer] = useState({
    name: "",
    time: "",
    timeString: "",
    progress: 0,
  });
  const [prevValues, setPrevValues] = useState({
    hours: ["0", "0"],
    minutes: ["0", "0"],
    seconds: ["0", "0"],
  });

  const calculateNextPrayer = useCallback(() => {
    if (!prayerTimes) {
      setNextPrayer({
        name: "Loading...",
        time: "",
        timeString: "",
        progress: 0,
      });
      return;
    }

    const now = new Date();

    // Define prayers in order
    const prayers = [
      {
        name: "Fajr",
        displayName: "Fajr",
        time: prayerTimes.fajr?.jamat || prayerTimes.fajr?.start,
        icon: "🌅",
      },
      {
        name: "Zuhr",
        displayName: "Dhuhr",
        time: prayerTimes.zuhr?.jamat || prayerTimes.zuhr?.start,
        icon: "☀️",
      },
      {
        name: "Asr",
        displayName: "Asr",
        time: prayerTimes.asr?.jamat || prayerTimes.asr?.start,
        icon: "🌤️",
      },
      {
        name: "Maghrib",
        displayName: "Maghrib",
        time: prayerTimes.maghrib?.jamat || prayerTimes.maghrib?.start,
        icon: "🌇",
      },
      {
        name: "Isha",
        displayName: "Isha",
        time: prayerTimes.isha?.jamat || prayerTimes.isha?.start,
        icon: "🌙",
      },
    ];

    let nextPrayerObj = null;
    let smallestDiff = Infinity;

    // Find the next prayer
    prayers.forEach((prayer) => {
      const prayerTime = parseTimeString(prayer.time);
      if (prayerTime) {
        const diff = prayerTime.getTime() - now.getTime();
        if (diff > 0 && diff < smallestDiff) {
          smallestDiff = diff;
          nextPrayerObj = prayer;
        }
      }
    });

    // If no prayer found for today, show first prayer of tomorrow
    if (!nextPrayerObj && prayers[0]) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const firstPrayerTime = parseTimeString(prayers[0].time);
      if (firstPrayerTime) {
        firstPrayerTime.setDate(firstPrayerTime.getDate() + 1);
        smallestDiff = firstPrayerTime.getTime() - now.getTime();
        nextPrayerObj = prayers[0];
      }
    }

    if (nextPrayerObj) {
      // Calculate time left
      const totalSeconds = Math.floor(smallestDiff / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      // Store previous values for flip animation
      setPrevValues({
        hours: [
          String(countdown.hours).padStart(2, "0").charAt(0),
          String(countdown.hours).padStart(2, "0").charAt(1),
        ],
        minutes: [
          String(countdown.minutes).padStart(2, "0").charAt(0),
          String(countdown.minutes).padStart(2, "0").charAt(1),
        ],
        seconds: [
          String(countdown.seconds).padStart(2, "0").charAt(0),
          String(countdown.seconds).padStart(2, "0").charAt(1),
        ],
      });

      // Update countdown
      setCountdown({ hours, minutes, seconds });

      // Calculate progress (percentage of time until next prayer)
      const prayerTime = parseTimeString(nextPrayerObj.time);
      if (prayerTime) {
        const prayerTimeMs = prayerTime.getTime();
        const nowMs = now.getTime();
        const dayStart = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).getTime();
        const nextDayStart = dayStart + 24 * 60 * 60 * 1000;

        let progress = 0;
        if (nextPrayerObj.name === "Fajr") {
          // For Fajr, calculate from midnight
          progress = ((prayerTimeMs - dayStart) / (24 * 60 * 60 * 1000)) * 100;
        } else {
          // For other prayers, calculate from previous prayer
          const prayerIndex = prayers.findIndex(
            (p) => p.name === nextPrayerObj.name
          );
          if (prayerIndex > 0) {
            const prevPrayer = prayers[prayerIndex - 1];
            const prevPrayerTime = parseTimeString(prevPrayer.time);
            if (prevPrayerTime) {
              const totalPeriod = prayerTimeMs - prevPrayerTime.getTime();
              const elapsedSincePrev = nowMs - prevPrayerTime.getTime();
              progress = (elapsedSincePrev / totalPeriod) * 100;
            }
          }
        }

        setNextPrayer({
          name: nextPrayerObj.displayName,
          time: nextPrayerObj.time,
          timeString: nextPrayerObj.time,
          progress: Math.min(100, Math.max(0, progress)),
          icon: nextPrayerObj.icon,
        });
      }
    } else {
      // All prayers finished for today
      setNextPrayer({
        name: "All prayers completed",
        time: "",
        timeString: "Come back tomorrow",
        progress: 100,
        icon: "✅",
      });
      setCountdown({ hours: 0, minutes: 0, seconds: 0 });
    }
  }, [prayerTimes, countdown]);

  useEffect(() => {
    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 1000);
    return () => clearInterval(interval);
  }, [calculateNextPrayer]);

  // Format numbers with leading zeros
  const formatNumber = (num) => {
    return String(num).padStart(2, "0");
  };

  return (
    <div className="prayer-countdown-container">
      {/* Inline CSS for the countdown */}
      <style>
        {`
          .prayer-countdown-container {
            background: linear-gradient(135deg, var(--theme) 0%, #2a5298 100%);
            border-radius: 20px;
            padding: 25px;
            color: white;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            margin: 20px 0;
            position: relative;
            overflow: hidden;
          }
          
          .prayer-countdown-container::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 30px 30px;
            opacity: 0.3;
            z-index: 0;
          }
          
          .countdown-header {
            text-align: center;
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
          }
          
          .countdown-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .countdown-subtitle {
            font-size: 14px;
            opacity: 0.9;
            letter-spacing: 1px;
          }
          
          .countdown-display {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 25px;
            position: relative;
            z-index: 1;
          }
          
          .countdown-unit {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .flip-card {
            position: relative;
            width: 80px;
            height: 100px;
            perspective: 1000px;
          }
          
          .flip-card-top,
          .flip-card-bottom {
            position: absolute;
            width: 100%;
            height: 50%;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px 10px 0 0;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 42px;
            font-weight: 800;
            color: white;
            backface-visibility: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          }
          
          .flip-card-top {
            top: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            line-height: 100px;
          }
          
          .flip-card-bottom {
            bottom: 0;
            border-radius: 0 0 10px 10px;
            align-items: flex-start;
            line-height: 100px;
            border-top: 1px solid rgba(0, 0, 0, 0.4);
          }
          
          .flip-card-top::after,
          .flip-card-bottom::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
          }
          
          .flip-card-top::after {
            bottom: 0;
          }
          
          .unit-label {
            margin-top: 12px;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.8;
            font-weight: 600;
          }
          
          .separator {
            font-size: 40px;
            font-weight: 700;
            margin: 20px 5px;
            opacity: 0.7;
          }
          
          .next-prayer-info {
            text-align: center;
            padding-top: 20px;
            border-top: 2px dashed rgba(255, 255, 255, 0.3);
            position: relative;
            z-index: 1;
          }
          
          .next-prayer-name {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }
          
          .next-prayer-time {
            font-size: 20px;
            margin-bottom: 15px;
            background: rgba(255, 255, 255, 0.1);
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
          }
          
          .progress-container {
            margin-top: 15px;
            text-align: left;
          }
          
          .progress-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 14px;
          }
          
          .prayer-progress {
            height: 10px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            overflow: hidden;
          }
          
          .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #FFD700, #FFED4E);
            border-radius: 5px;
            transition: width 1s ease-in-out;
            position: relative;
            overflow: hidden;
          }
          
          .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            );
            animation: shimmer 2s infinite;
          }
          
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          
          .flip-animation {
            position: absolute;
            top: 0;
            width: 100%;
            height: 50%;
            background: rgba(0, 0, 0, 0.4);
            border-radius: 10px 10px 0 0;
            transform-origin: bottom;
            animation: flip 0.5s ease-in forwards;
          }
          
          @keyframes flip {
            to {
              transform: rotateX(90deg);
            }
          }
          
          /* Responsive design */
          @media (max-width: 768px) {
            .flip-card {
              width: 60px;
              height: 80px;
            }
            
            .flip-card-top,
            .flip-card-bottom {
              font-size: 32px;
            }
            
            .separator {
              font-size: 30px;
              margin: 10px 5px;
            }
            
            .countdown-title {
              font-size: 20px;
            }
            
            .next-prayer-name {
              font-size: 18px;
            }
            
            .next-prayer-time {
              font-size: 16px;
            }
          }
          
          @media (max-width: 576px) {
            .flip-card {
              width: 50px;
              height: 70px;
            }
            
            .flip-card-top,
            .flip-card-bottom {
              font-size: 28px;
            }
            
            .separator {
              font-size: 24px;
            }
            
            .unit-label {
              font-size: 12px;
            }
            
            .countdown-display {
              gap: 8px;
            }
          }
        `}
      </style>

      {/* Countdown Header */}
      <div className="countdown-header">
        <div className="countdown-title">
          <span>⏳ Next Prayer Countdown</span>
        </div>
        <div className="countdown-subtitle">Time remaining until Jama'at</div>
      </div>

      {/* Countdown Display */}
      <div className="countdown-display">
        {/* Hours */}
        <div className="countdown-unit">
          <div className="flip-card">
            <div className="flip-card-top">
              {formatNumber(countdown.hours).charAt(0)}
            </div>
            <div className="flip-card-bottom">
              {formatNumber(countdown.hours).charAt(1)}
            </div>
            {prevValues.hours[0] !==
              formatNumber(countdown.hours).charAt(0) && (
              <div className="flip-animation">{prevValues.hours[0]}</div>
            )}
          </div>
          <div className="unit-label">Hours</div>
        </div>

        <div className="separator">:</div>

        {/* Minutes */}
        <div className="countdown-unit">
          <div className="flip-card">
            <div className="flip-card-top">
              {formatNumber(countdown.minutes).charAt(0)}
            </div>
            <div className="flip-card-bottom">
              {formatNumber(countdown.minutes).charAt(1)}
            </div>
            {prevValues.minutes[0] !==
              formatNumber(countdown.minutes).charAt(0) && (
              <div className="flip-animation">{prevValues.minutes[0]}</div>
            )}
          </div>
          <div className="unit-label">Minutes</div>
        </div>

        <div className="separator">:</div>

        {/* Seconds */}
        <div className="countdown-unit">
          <div className="flip-card">
            <div className="flip-card-top">
              {formatNumber(countdown.seconds).charAt(0)}
            </div>
            <div className="flip-card-bottom">
              {formatNumber(countdown.seconds).charAt(1)}
            </div>
            {prevValues.seconds[0] !==
              formatNumber(countdown.seconds).charAt(0) && (
              <div className="flip-animation">{prevValues.seconds[0]}</div>
            )}
          </div>
          <div className="unit-label">Seconds</div>
        </div>
      </div>

      {/* Next Prayer Info */}
      <div className="next-prayer-info">
        <div className="next-prayer-name">
          <span>{nextPrayer.icon}</span>
          <span>{nextPrayer.name}</span>
        </div>

        {nextPrayer.timeString && (
          <div className="next-prayer-time">
            ⏰ Jama'at at {nextPrayer.timeString}
          </div>
        )}

        {/* Progress Bar */}
        {nextPrayer.progress > 0 && nextPrayer.progress < 100 && (
          <div className="progress-container">
            <div className="progress-label">
              <span>Time Progress</span>
              <span>{Math.round(nextPrayer.progress)}%</span>
            </div>
            <div className="prayer-progress">
              <div
                className="progress-bar"
                style={{ width: `${nextPrayer.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default PrayerCountdown;
