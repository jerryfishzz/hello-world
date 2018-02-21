export interface ICard {
  cardId: string;
  cardName: string;
  cardType: string;  // Dependent on board type. If board is portfolio, card will be project; if project, then card will be task.
  columnEntityId: string;  // The id of the column which holds this card
  boardEntityId: string;  // The id of the board which holds this card
  boardEntityType: string;  // The type of the board which holds this card
  comments: string;
  inArchive: boolean;  // If in archive column, true; if not, false.
}
