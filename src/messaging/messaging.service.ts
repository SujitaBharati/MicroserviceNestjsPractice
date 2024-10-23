import { Injectable } from '@nestjs/common';
import { ulid } from 'ulid';
import { Observable, Subject } from 'rxjs';
import {
  Conversation,
  CreateConversationRequest,
  Message,
  QueryMessagesRequest,
  User,
} from 'src/messaging/common/messaging';

@Injectable()
export class MessagingService {
  private readonly users: User[] = [];
  private readonly conversations: Conversation[] = [];
  private readonly conversationStreams: Map<string, Subject<Message>> =
    new Map();

  create_user(request: User) {
    const user: User = {
      userId: ulid(),
      name: request.name,
      conversationsIds: [],
    };
    this.users.push(user);
  }

  create_conversation(request: CreateConversationRequest) {
    const conversation: Conversation = {
      conversationId: ulid(),
      messages: [],
      userIds: request.userIds,
    };
    this.conversations.push(conversation);
    this.conversationStreams.set(
      conversation.conversationId,
      new Subject<Message>(),
    );
  }

  get_users(): User[] {
    return this.users;
  }

  get_conversations(): Conversation[] {
    return this.conversations;
  }

  send_message(request: Message) {
    const conversation = this.conversations.find(
      (c) => c.conversationId === request.conversationId,
    );
    if (conversation) {
      conversation.messages.push(request);
      const stream = this.conversationStreams.get(request.conversationId);
      if (stream) {
        stream.next(request);
      }
    }
  }
  queryMessages(request: QueryMessagesRequest): Observable<Message> {
    let stream = this.conversationStreams.get(request.conversationId);
    if (!stream) {
      stream = new Subject<Message>();
      this.conversationStreams.set(request.conversationId, stream);
    }
    return stream.asObservable();
  }
}
