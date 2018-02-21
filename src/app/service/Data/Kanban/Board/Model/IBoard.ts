export interface IBoard {
  boardId: string;
  boardName: string;
  boardType: string;
  idleColumn: string;  // Id of idle column
  directColumns: string[];  // Array of the direct child columns of the board
  archiveColumn: string;  // Id of archive column
  entityId: string;  // Id of the upper-level entity of the board
}
