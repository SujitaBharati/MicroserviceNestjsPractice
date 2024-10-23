import { Controller } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import {
  Conversation,
  Conversations,
  CreateConversationRequest,
  Empty,
  Message,
  MessagingServiceController,
  MessagingServiceControllerMethods,
  QueryMessagesRequest,
  User,
  Users,
} from 'src/messaging/common/messaging';
import { Observable, of } from 'rxjs';

@Controller()
@MessagingServiceControllerMethods()
export class MessagingController implements MessagingServiceController {
  constructor(private readonly usersService: MessagingService) {}
  sendMessage(request: Message): Promise<Empty> | Observable<Empty> | Empty {
    this.usersService.send_message(request);
    return of({});
  }
  queryMessages(request: QueryMessagesRequest): Observable<Message> {
    return this.usersService.queryMessages(request);
  }

  createUser(request: User): Promise<User> | Observable<User> | User {
    this.usersService.create_user(request);
    return of(request);
  }

  createConversation(
    request: CreateConversationRequest,
  ): Promise<Conversation> | Observable<Conversation> | Conversation {
    this.usersService.create_conversation(request);
    const newConversation = this.usersService
      .get_conversations()
      .find((conv) => conv.userIds.includes(request.userIds[0]));
    return of(newConversation);
  }

  getConversation():
    | Promise<Conversations>
    | Observable<Conversations>
    | Conversations {
    const allConversations = this.usersService.get_conversations();
    return of({ conversations: allConversations });
  }

  getUsers(): Promise<Users> | Observable<Users> | Users {
    const allUsers = this.usersService.get_users();
    return of({ users: allUsers });
  }
}
