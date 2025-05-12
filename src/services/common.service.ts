import { DateTime } from "luxon";

export const getCookie = (name: string): [string, string] => {
  if (typeof window !== "undefined") {
    const { cookie } = document;

    const data = cookie?.split(";")?.find((data) => data?.includes(name));

    if (!data) return ["", ""];

    const cookieValue: [string, string] = data.split("=") as [string, string];

    if (cookieValue.length <= 1) return ["", ""];

    return cookieValue;
  }
  return ["", ""];
};

export const deleteCookies = () => {
  document.cookie.replace(/(?<=^|;).+?(?=\=|;|$)/g, (name) =>
    location.hostname
      .split(/\.(?=[^\.]+\.)/)
      .reduceRight(
        (acc: any, val: any, i: any, arr: any) =>
          i ? (arr[i] = "." + val + acc) : ((arr[i] = ""), arr),
        ""
      )
      ?.map(
        (domain: any) =>
          (document.cookie = `${name}=;max-age=0;path=/;domain=${domain}`)
      )
  );
};

export const mainNavigation = (baseUrl: string, path: string) => {
  const url: any = `${baseUrl}${path}`;
  // window.location = url;
  //   redirect(url);
};

export const setCookie = (name: string, cvalue: string, exdays: number) => {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = "expires=" + d.toUTCString();
  document.cookie =
    name +
    "=" +
    cvalue +
    ";" +
    expires +
    `;domain=.` +
    process.env.NEXT_PUBLIC_DOMAIN +
    ";path=/";
};

export const isDateTodayOrFuture = (dateString: string) => {
  const inputDate = DateTime.fromFormat(dateString, "d MMM yyyy").endOf("day");

  const today = DateTime.now().startOf("day");

  return inputDate < today;
};

export const getDateForTask = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const monthAbbreviation = new Intl.DateTimeFormat("en", {
    month: "short",
  }).format(date);
  const year = date.getFullYear();

  const formattedDate = `${day} ${monthAbbreviation} ${year}`;
  return formattedDate;
};
