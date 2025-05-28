import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from 'src/config/env.config';
import { App, initializeApp } from 'firebase-admin/app';
import {
  BatchResponse,
  getMessaging,
  Message,
  Messaging,
  MulticastMessage,
} from 'firebase-admin/messaging';
import { credential } from 'firebase-admin';
import { NotificationPayloadDto } from './dto/firebase-messaging.dto';

@Injectable()
export class FirebaseMessagingService {
  private app: App;
  private messaging: Messaging;
  private logger = new Logger(FirebaseMessagingService.name);

  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.app = initializeApp({
      credential: credential.cert({
        projectId: this.configService.get('FIREBASE_PROJECT_ID'),
        privateKey: this.configService
          .get('FIREBASE_PRIVATE_KEY')
          ?.replace(/\\n/g, '\n'),
        clientEmail: this.configService.get('FIREBASE_CLIENT_EMAIL'),
      }),
    });
    this.messaging = getMessaging(this.app);
  }

  /**
   * Send notification to a single device
   */
  async sendToDevice(
    token: string,
    payload: NotificationPayloadDto,
  ): Promise<string> {
    const message: Message = {
      token,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.messaging.send(message);
      this.logger.log(response);
      return response;
    } catch (error) {
      this.logger.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Send notification to multiple devices
   */
  async sendToMultipleDevices(
    tokens: string[],
    payload: NotificationPayloadDto,
  ): Promise<BatchResponse> {
    const message: MulticastMessage = {
      tokens,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.messaging.sendEachForMulticast(message);
      this.logger.log('Successfully sent messages:', response);
      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            this.logger.error(
              'Failed to send to token:',
              tokens[idx],
              resp.error,
            );
          }
        });
      }

      return response;
    } catch (error) {
      this.logger.error('Error sending multicast message:', error);
      throw error;
    }
  }

  /**
   * Send notification to a topic
   */
  async sendToTopic(topic: string, payload: NotificationPayloadDto) {
    const message: Message = {
      topic,
      notification: {
        title: payload.title,
        body: payload.body,
        ...(payload.imageUrl && { imageUrl: payload.imageUrl }),
      },
      data: payload.data || {},
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await this.messaging.send(message);
      this.logger.log('Successfully sent topic message:', response);
      return response;
    } catch (error) {
      this.logger.error('Error sending topic message:', error);
      throw error;
    }
  }

  /**
   * Subscribe tokens to a topic
   */
  async subscribeToTopic(tokens: string[], topic: string) {
    try {
      const response = await this.messaging.subscribeToTopic(tokens, topic);
      this.logger.log('Successfully subscribed to topic:', response);
      return response;
    } catch (error) {
      this.logger.error('Error subscribing to topic:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe tokens from a topic
   */
  async unsubscribeFromTopic(tokens: string[], topic: string) {
    try {
      const response = await this.messaging.unsubscribeFromTopic(tokens, topic);
      this.logger.log('Successfully unsubscribed from topic:', response);
      return response;
    } catch (error) {
      this.logger.error('Error unsubscribing from topic:', error);
      throw error;
    }
  }

  /**
   * Verify a registration token
   */
  async verifyToken(token: string) {
    try {
      await this.messaging.send(
        {
          token,
          data: { test: 'true' },
        },
        true,
      ); // dry run
      return true;
    } catch (error) {
      this.logger.error('Token verification failed:', error);
      return false;
    }
  }
}
