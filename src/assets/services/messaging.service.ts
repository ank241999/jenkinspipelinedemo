import { Injectable } from '@angular/core';
import { StompService, StompConfig, StompState } from "@stomp/ng2-stompjs";
import { Message } from "@stomp/stompjs";
import { Observable, BehaviorSubject } from "rxjs";
import { environment } from '../../environments/environment';

const streamUrl = "/topic/greetings";

@Injectable()
export class MessagingService {
  private messages: Observable<Message>;
  private stompService: StompService;

  constructor() {
    // Create Stomp Configuration
    let stompConfig: StompConfig = {
      url: environment.websocket_url,
      headers: {
        login: "",
        passcode: ""
      },
      heartbeat_in: 0,
      heartbeat_out: 20000,
      reconnect_delay: 5000,
      debug: true
    };

    // Create Stomp Service
    //this.stompService = new StompService(stompConfig);

    // Connect to a Stream
    //this.messages = this.stompService.subscribe(streamUrl);
  }

  public stream(): Observable<Message> {
    return this.messages;
  }

  public send(url: string, message: any) {
    return this.stompService.publish(url, JSON.stringify(message));
  }

  public state(): BehaviorSubject<StompState> {
    return this.stompService.state;
  }

  public connect() {
    // Create Stomp Configuration
    let stompConfig: StompConfig = {
      url: environment.websocket_url,
      headers: {
        login: "",
        passcode: ""
      },
      heartbeat_in: 0,
      heartbeat_out: 20000,
      reconnect_delay: 5000,
      debug: true
    };

    // Create Stomp Service
    this.stompService = new StompService(stompConfig);

    // Connect to a Stream
    this.messages = this.stompService.subscribe(streamUrl);
  }

  public disconnect() {
    this.stompService.disconnect();
    this.stompService = null;
    this.messages = null;
  }
}
