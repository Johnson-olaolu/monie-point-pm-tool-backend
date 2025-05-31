import { Inject, Injectable, Logger } from '@nestjs/common';
import { App } from 'firebase-admin/app';
import { Database } from 'firebase-admin/lib/database/database';
import {
  DataSnapshot,
  getDatabase,
  ServerValue,
} from 'firebase-admin/database';

@Injectable()
export class FirebaseRealtimeDBService {
  private database: Database;
  private logger = new Logger(FirebaseRealtimeDBService.name);

  constructor(@Inject('FIREBASE_APP') private readonly app: App) {
    this.database = getDatabase(this.app);
  }

  /**
   * Get a reference to a specific path in the database
   */
  getRef(path: string) {
    return this.database.ref(path);
  }

  /**
   * Set data at a specific path
   */
  async set(path: string, data: any) {
    try {
      await this.database.ref(path).set(data);
      this.logger.debug(`Data set successfully at path: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to set data at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Update data at a specific path
   */
  async update(path: string, data: any) {
    try {
      await this.database.ref(path).update(data);
      this.logger.debug(`Data updated successfully at path: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to update data at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Get data from a specific path
   */
  async get(path: string) {
    try {
      const snapshot = await this.database.ref(path).once('value');
      const data = snapshot.val();
      this.logger.debug(`Data retrieved successfully from path: ${path}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to get data from path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Push data to a path (generates unique key)
   */
  async push(path: string, data: any) {
    try {
      const ref = await this.database.ref(path).push(data);
      const key = ref.key;
      this.logger.debug(
        `Data pushed successfully to path: ${path}, key: ${key}`,
      );
      return key;
    } catch (error) {
      this.logger.error(`Failed to push data to path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Remove data from a specific path
   */
  async remove(path: string) {
    try {
      await this.database.ref(path).remove();
      this.logger.debug(`Data removed successfully from path: ${path}`);
    } catch (error) {
      this.logger.error(`Failed to remove data from path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Check if data exists at a specific path
   */
  async exists(path: string) {
    try {
      const snapshot = await this.database.ref(path).once('value');
      return snapshot.exists();
    } catch (error) {
      this.logger.error(`Failed to check existence at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Query data with filters
   */
  async query(
    path: string,
    options: {
      orderBy?: string;
      limitToFirst?: number;
      limitToLast?: number;
      startAt?: any;
      endAt?: any;
      equalTo?: any;
    } = {},
  ) {
    try {
      let query = this.database.ref(path).orderByKey();

      if (options.orderBy) {
        query = query.orderByChild(options.orderBy);
      }

      if (options.limitToFirst) {
        query = query.limitToFirst(options.limitToFirst);
      }

      if (options.limitToLast) {
        query = query.limitToLast(options.limitToLast);
      }

      if (options.startAt !== undefined) {
        query = query.startAt(options.startAt);
      }

      if (options.endAt !== undefined) {
        query = query.endAt(options.endAt);
      }

      if (options.equalTo !== undefined) {
        query = query.equalTo(options.equalTo);
      }

      const snapshot = await query.once('value');
      const data = snapshot.val();
      this.logger.debug(`Query executed successfully on path: ${path}`);
      return data;
    } catch (error) {
      this.logger.error(`Failed to execute query on path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Listen for data changes at a specific path
   */
  listen(
    path: string,
    callback: (data: any) => void,
    errorCallback?: (error: Error) => void,
  ): () => void {
    const ref = this.database.ref(path);

    const dataCallback = (snapshot: DataSnapshot) => {
      callback(snapshot.val());
    };

    const onError = (error: Error) => {
      this.logger.error(`Listener error on path: ${path}`, error);
      if (errorCallback) {
        errorCallback(error);
      }
    };

    ref.on('value', dataCallback, onError);

    // Return unsubscribe function
    return () => {
      ref.off('value', dataCallback);
      this.logger.debug(`Listener removed from path: ${path}`);
    };
  }

  /**
   * Listen for child events (added, changed, removed)
   */
  listenToChildren(
    path: string,
    callbacks: {
      onChildAdded?: (data: any, key: string) => void;
      onChildChanged?: (data: any, key: string) => void;
      onChildRemoved?: (data: any, key: string) => void;
    },
  ): () => void {
    const ref = this.database.ref(path);
    const unsubscribeFunctions: (() => void)[] = [];

    if (callbacks.onChildAdded) {
      const addedCallback = (snapshot: DataSnapshot) => {
        callbacks.onChildAdded(snapshot.val(), snapshot.key);
      };
      ref.on('child_added', addedCallback);
      unsubscribeFunctions.push(() => ref.off('child_added', addedCallback));
    }

    if (callbacks.onChildChanged) {
      const changedCallback = (snapshot: DataSnapshot) => {
        callbacks.onChildChanged(snapshot.val(), snapshot.key);
      };
      ref.on('child_changed', changedCallback);
      unsubscribeFunctions.push(() =>
        ref.off('child_changed', changedCallback),
      );
    }

    if (callbacks.onChildRemoved) {
      const removedCallback = (snapshot: DataSnapshot) => {
        callbacks.onChildRemoved(snapshot.val(), snapshot.key);
      };
      ref.on('child_removed', removedCallback);
      unsubscribeFunctions.push(() =>
        ref.off('child_removed', removedCallback),
      );
    }

    // Return function to unsubscribe from all listeners
    return () => {
      unsubscribeFunctions.forEach((unsub) => unsub());
      this.logger.debug(`All child listeners removed from path: ${path}`);
    };
  }

  /**
   * Perform a transaction at a specific path
   */
  async transaction(
    path: string,
    updateFunction: (currentData: any) => any,
  ): Promise<{ committed: boolean; snapshot: DataSnapshot }> {
    try {
      const result = await this.database.ref(path).transaction(updateFunction);
      this.logger.debug(
        `Transaction completed at path: ${path}, committed: ${result.committed}`,
      );
      return result;
    } catch (error) {
      this.logger.error(`Transaction failed at path: ${path}`, error);
      throw error;
    }
  }

  /**
   * Generate a unique key (without pushing data)
   */
  generateKey(path?: string): string {
    const ref = path ? this.database.ref(path) : this.database.ref();
    return ref.push().key;
  }

  /**
   * Get server timestamp
   */
  getServerTimestamp() {
    return ServerValue.TIMESTAMP;
  }

  /**
   * Batch write operations
   */
  async batchWrite(
    operations: Array<{
      type: 'set' | 'update' | 'remove';
      path: string;
      data?: any;
    }>,
  ): Promise<void> {
    try {
      const updates: { [path: string]: any } = {};

      for (const operation of operations) {
        switch (operation.type) {
          case 'set':
          case 'update':
            updates[operation.path] = operation.data;
            break;
          case 'remove':
            updates[operation.path] = null;
            break;
        }
      }

      await this.database.ref().update(updates);
      this.logger.debug(
        `Batch write completed with ${operations.length} operations`,
      );
    } catch (error) {
      this.logger.error('Batch write failed', error);
      throw error;
    }
  }
}
