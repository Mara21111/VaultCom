import {BaseUserDataDTO, PublicUserDataDTO, User} from './User';

export class Chat {
  id: number;
  type: number;
  chatId: number;
}

export class CreateChatDTO {
  type: number;
  id: number;
}

export class ChatFilterDTO {
  requestorId: number | null;
  type: number | null;
  isIn: boolean | null;
  isMuted: boolean | null;
}

export class ChatGetterDTO {
  id: number;
  title: string;
}

export class ChatPanelInfo {
  title: string;
  desc: string | null;
  activeUserName: string;
  users: BaseUserDataDTO[] | PublicUserDataDTO[];
}
