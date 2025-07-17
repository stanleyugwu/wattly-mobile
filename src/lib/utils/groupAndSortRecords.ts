import dayjs from "dayjs";

export type GroupableRecords<R> = R[];

/**
 * Groups and sort given records by month and in a map format to be rendered in SectionList
 */
export function groupAndSortRecords<T>(
  records: GroupableRecords<T>,
  getDate: (record: T) => string
) {
  const grouped = records.reduce((acc, tx) => {
    const txDate = getDate(tx);
    const month = dayjs(txDate || new Date()).format("MMMM YYYY");
    if (!acc[month]) acc[month] = [];
    acc[month].push(tx);
    return acc;
  }, {} as Record<string, GroupableRecords<T>>);

  const sortedSections = Object.entries(grouped).map(([month, data]) => ({
    title: month,
    data,
  }));

  return sortedSections;
}
