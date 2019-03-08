export interface ResearchItem {
  _id: string,
  title: string,
  ownerID: Array<string>,
  type: string,
  startDate: Date,
  endDate: Date,
  description: string,
}
