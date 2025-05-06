// utils/chatRoom.ts
export function generateChatRoomId(userId1: string, userId2: string) {
    return [userId1, userId2].sort().join("_");
  }
  