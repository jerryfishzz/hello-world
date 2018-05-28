import { ICard } from "../Model/ICard";

export class CardFactory {
  public generateGenericCard
  (
    _cardId: string,
    _cardName: string,
    _cardType: string,
    _columnEntityId: string,
    _boardEntityId: string,
    _boardEntityType: string,
    _comments: string,
    _inArchive: boolean
  ): ICard
  {
    var returnValue: ICard;

    returnValue = {
      cardId: _cardId,
      cardName: _cardName,
      cardType: _cardType,
      columnEntityId: _columnEntityId,
      boardEntityId: _boardEntityId,
      boardEntityType: _boardEntityType,
      comments: _comments,
      inArchive: _inArchive
    }

    return returnValue;
  }
}
