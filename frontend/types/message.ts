export interface Message {
  _id: string;
  userId: string;
  sender: "user" | "ai";
  text: string;
  createdAt: string;
}
