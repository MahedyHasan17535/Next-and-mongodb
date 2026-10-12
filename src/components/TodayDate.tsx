import { toBn } from "@/lib/format";

const TodayDate = ({ short = false }: { short?: boolean }) => {
  const today = new Date().toLocaleDateString("bn-BD", {
    ...(short ? {} : { weekday: "long" }),
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return <span>{toBn(today)}</span>;
};

export default TodayDate;