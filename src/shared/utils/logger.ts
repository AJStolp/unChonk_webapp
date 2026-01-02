// src/shared/utils/Logger.ts
// Enterprise-grade logging utility with proper levels and security

import { CrossPlatformStorage } from "./RuntimeDetection";
import { BUFFER_LIMITS } from "../constants";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  requestId?: string;
  userId?: string;
  sessionId?: string;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableStorage: boolean;
  maxStoredLogs: number;
  sensitiveFields: string[];
  remoteEndpoint?: string;
}

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private sessionId: string;
  private logBuffer: LogEntry[] = [];

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableStorage: false,
      maxStoredLogs: BUFFER_LIMITS.MAX_STORED_LOGS,
      sensitiveFields: ["password", "token", "secret", "key", "authorization"],
      ...config,
    };

    // Override level in development
    if (process.env.NODE_ENV === "development") {
      this.config.level = LogLevel.DEBUG;
    }

    this.sessionId = this.generateSessionId();
    this.setupErrorHandlers();
  }

  public static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private setupErrorHandlers(): void {
    // Global error handler
    window.addEventListener("error", (event) => {
      this.error("Uncaught error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener("unhandledrejection", (event) => {
      this.error("Unhandled promise rejection", {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });
  }

  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    const sanitized = { ...context };

    const redactValue = (obj: unknown): void => {
      if (typeof obj === "object" && obj !== null) {
        const typedObj = obj as Record<string, unknown>;
        for (const [k, v] of Object.entries(typedObj)) {
          if (
            this.config.sensitiveFields.some((field) =>
              k.toLowerCase().includes(field.toLowerCase())
            )
          ) {
            typedObj[k] = "[REDACTED]";
          } else if (typeof v === "object" && v !== null) {
            redactValue(v);
          }
        }
      }
    };

    redactValue(sanitized);
    return sanitized;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      sessionId: this.sessionId,
    };

    if (context) {
      entry.context = this.sanitizeContext(context);
    }

    // Add stack trace for errors
    if (level >= LogLevel.ERROR) {
      entry.stack = new Error().stack;
    }

    return entry;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp.substring(11, 23); // HH:mm:ss.sss
    const levelName = LogLevel[entry.level];
    return `[${timestamp}] ${levelName}: ${entry.message}`;
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const message = this.formatConsoleMessage(entry);
    const context = entry.context;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, context);
        break;
      case LogLevel.INFO:
        console.info(message, context);
        break;
      case LogLevel.WARN:
        console.warn(message, context);
        break;
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(message, context);
        if (entry.stack) {
          console.error("Stack trace:", entry.stack);
        }
        break;
    }
  }

  private storeLog(entry: LogEntry): void {
    if (!this.config.enableStorage) return;

    this.logBuffer.push(entry);

    // Trim buffer if too large
    if (this.logBuffer.length > this.config.maxStoredLogs) {
      this.logBuffer = this.logBuffer.slice(-this.config.maxStoredLogs);
    }

    // Store in cross-platform storage for persistence (optional, fire-and-forget)
    const recentLogs = this.logBuffer.slice(-BUFFER_LIMITS.PERSIST_LOG_COUNT);
    CrossPlatformStorage.setItem("app_logs", recentLogs).catch((error) => {
      // Storage might be full or unavailable - this is best-effort
      console.warn("Failed to store logs in storage:", error);
    });
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": this.sessionId,
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Don't log this error to avoid infinite recursion
      console.warn("Failed to send log to remote endpoint:", error);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context);

    this.logToConsole(entry);
    this.storeLog(entry);

    // Send critical errors to remote endpoint immediately
    if (level >= LogLevel.ERROR && this.config.remoteEndpoint) {
      this.sendToRemote(entry).catch(() => {
        // Silently fail - we don't want logging to break the app
      });
    }
  }

  // Public logging methods
  public debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public error(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  public critical(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.CRITICAL, message, context);
  }

  // Utility methods
  public setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  public setUserId(userId: string): void {
    this.logBuffer.forEach((entry) => {
      if (!entry.userId) {
        entry.userId = userId;
      }
    });
  }

  public setRequestId(requestId: string): void {
    // This can be used to correlate logs with specific requests
    this.logBuffer.forEach((entry) => {
      if (!entry.requestId) {
        entry.requestId = requestId;
      }
    });
  }

  public getRecentLogs(count: number = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  public getLogsForLevel(level: LogLevel, count: number = 50): LogEntry[] {
    return this.logBuffer
      .filter((entry) => entry.level === level)
      .slice(-count);
  }

  public clearLogs(): void {
    this.logBuffer = [];
    // Clear logs from cross-platform storage (fire-and-forget)
    CrossPlatformStorage.removeItem("app_logs").catch((error) => {
      console.warn("Failed to clear logs from storage:", error);
    });
  }

  public exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }

  // Performance logging
  public time(label: string): void {
    console.time(label);
    this.debug(`Timer started: ${label}`);
  }

  public timeEnd(label: string): void {
    console.timeEnd(label);
    this.debug(`Timer ended: ${label}`);
  }

  // Group logging for related operations
  public group(label: string): void {
    console.group(label);
    this.debug(`Group started: ${label}`);
  }

  public groupEnd(): void {
    console.groupEnd();
    this.debug("Group ended");
  }

  // Helper for API request logging
  public logAPIRequest(method: string, url: string, requestId?: string): void {
    this.info("API Request", {
      method,
      url,
      requestId,
      timestamp: Date.now(),
    });
  }

  public logAPIResponse(
    method: string,
    url: string,
    status: number,
    duration: number,
    requestId?: string
  ): void {
    const level = status >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log(level, "API Response", {
      method,
      url,
      status,
      duration,
      requestId,
    });
  }

  // Helper for user actions
  public logUserAction(action: string, details?: Record<string, any>): void {
    this.info("User Action", {
      action,
      ...details,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  // Security logging
  public logSecurityEvent(event: string, details?: Record<string, any>): void {
    this.warn("Security Event", {
      event,
      ...details,
      ip: "client", // In a real app, this would come from the server
      userAgent: navigator.userAgent,
    });
  }
}

export default Logger;

/**
 * Helper function to create a logger instance with a specific namespace
 */
export function createLogger(namespace: string) {
  const logger = Logger.getInstance();

  return {
    debug: (message: string, context?: Record<string, any>) => {
      logger.debug(`[${namespace}] ${message}`, context);
    },
    info: (message: string, context?: Record<string, any>) => {
      logger.info(`[${namespace}] ${message}`, context);
    },
    warn: (message: string, context?: Record<string, any>) => {
      logger.warn(`[${namespace}] ${message}`, context);
    },
    error: (message: string, context?: Record<string, any>) => {
      logger.error(`[${namespace}] ${message}`, context);
    },
    critical: (message: string, context?: Record<string, any>) => {
      logger.critical(`[${namespace}] ${message}`, context);
    }
  };
}

/**
 * Helper function to convert an error to a context object for logging
 */
export function toErrorContext(error: unknown): Record<string, any> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    };
  }

  if (typeof error === 'string') {
    return { message: error };
  }

  if (typeof error === 'object' && error !== null) {
    return { ...error };
  }

  return { error: String(error) };
}
