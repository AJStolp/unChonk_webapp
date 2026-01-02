// src/shared/security/SecurityConfig.ts
// Enterprise-grade security configuration and utilities

export interface SecurityHeaders {
  "Content-Security-Policy"?: string;
  "X-Frame-Options"?: string;
  "X-Content-Type-Options"?: string;
  "Referrer-Policy"?: string;
  "Permissions-Policy"?: string;
}

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  allowedOrigins: string[];
}

export interface ValidationRules {
  username: {
    minLength: number;
    maxLength: number;
    pattern: RegExp;
    forbiddenPatterns: RegExp[];
  };
  password: {
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    forbiddenPatterns: RegExp[];
  };
}

export class SecurityConfig {
  private static instance: SecurityConfig;

  public readonly API: APIConfig;
  public readonly VALIDATION: ValidationRules;
  public readonly HEADERS: SecurityHeaders;
  public readonly RATE_LIMITS = {
    LOGIN_ATTEMPTS: 5,
    LOGIN_WINDOW: 15 * 60 * 1000, // 15 minutes
    API_REQUESTS: 100,
    API_WINDOW: 60 * 1000, // 1 minute
  };

  private constructor() {
    // Load from environment or use secure defaults
    this.API = this.getAPIConfig();
    this.VALIDATION = this.getValidationRules();
    this.HEADERS = this.getSecurityHeaders();
  }

  public static getInstance(): SecurityConfig {
    if (!SecurityConfig.instance) {
      SecurityConfig.instance = new SecurityConfig();
    }
    return SecurityConfig.instance;
  }

  private getAPIConfig(): APIConfig {
    const isProduction = process.env.NODE_ENV === "production";

    return {
      baseURL: this.getEnvironmentVariable(
        "API_BASE_URL",
        "http://localhost:5000"
      ),
      timeout: parseInt(this.getEnvironmentVariable("API_TIMEOUT", "30000")),
      retryAttempts: parseInt(
        this.getEnvironmentVariable("API_RETRY_ATTEMPTS", "3")
      ),
      retryDelay: parseInt(
        this.getEnvironmentVariable("API_RETRY_DELAY", "1000")
      ),
      allowedOrigins: isProduction
        ? ["https://tts-deep-sight.com", "https://api.tts-deep-sight.com"]
        : [
            "http://localhost:3000",
            "http://localhost:5000",
            "http://127.0.0.1:5000",
          ],
    };
  }

  private getValidationRules(): ValidationRules {
    return {
      username: {
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_.-]+$/,
        forbiddenPatterns: [
          /^(admin|root|system|test|guest|user)$/i,
          /^(api|www|mail|ftp)$/i,
          /(script|javascript|vbscript)/i,
        ],
      },
      password: {
        minLength: 8,
        maxLength: 128,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        forbiddenPatterns: [
          /(password|123456|qwerty|admin)/i,
          /(.)\1{2,}/, // Repeated characters
          /(script|javascript|vbscript)/i,
        ],
      },
    };
  }

  private getSecurityHeaders(): SecurityHeaders {
    return {
      "Content-Security-Policy": [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' " + this.API.allowedOrigins.join(" "),
        "form-action 'self'",
        "frame-ancestors 'none'",
        "base-uri 'self'",
      ].join("; "),
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    };
  }

  private getEnvironmentVariable(name: string, defaultValue: string): string {
    // In browser environment, we'll use build-time configuration
    if (typeof process !== "undefined" && process.env) {
      return process.env[name] || defaultValue;
    }

    // Check for build-time injected values
    const buildConfig = (window as any).__BUILD_CONFIG__;
    if (buildConfig && buildConfig[name]) {
      return buildConfig[name];
    }

    return defaultValue;
  }

  public validateOrigin(origin: string): boolean {
    return (
      this.API.allowedOrigins.includes(origin) ||
      origin.startsWith("moz-extension://") ||
      origin.startsWith("chrome-extension://")
    );
  }

  public sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>\"'&]/g, "") // Remove potentially dangerous characters
      .substring(0, 1000); // Limit length
  }

  public validateUsername(username: string): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    const rules = this.VALIDATION.username;

    if (!username || username.length < rules.minLength) {
      errors.push(`Username must be at least ${rules.minLength} characters`);
    }

    if (username.length > rules.maxLength) {
      errors.push(`Username must not exceed ${rules.maxLength} characters`);
    }

    if (!rules.pattern.test(username)) {
      errors.push("Username contains invalid characters");
    }

    for (const forbidden of rules.forbiddenPatterns) {
      if (forbidden.test(username)) {
        errors.push("Username is not allowed");
        break;
      }
    }

    return { valid: errors.length === 0, errors };
  }

  public validatePassword(password: string): {
    valid: boolean;
    errors: string[];
    strength: number;
  } {
    const errors: string[] = [];
    const rules = this.VALIDATION.password;
    let strength = 0;

    if (!password || password.length < rules.minLength) {
      errors.push(`Password must be at least ${rules.minLength} characters`);
    }

    if (password.length > rules.maxLength) {
      errors.push(`Password must not exceed ${rules.maxLength} characters`);
    }

    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain uppercase letters");
    } else if (/[A-Z]/.test(password)) {
      strength += 1;
    }

    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain lowercase letters");
    } else if (/[a-z]/.test(password)) {
      strength += 1;
    }

    if (rules.requireNumbers && !/\d/.test(password)) {
      errors.push("Password must contain numbers");
    } else if (/\d/.test(password)) {
      strength += 1;
    }

    if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Password must contain special characters");
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 1;
    }

    for (const forbidden of rules.forbiddenPatterns) {
      if (forbidden.test(password)) {
        errors.push("Password is too common or contains forbidden patterns");
        break;
      }
    }

    // Additional strength checks
    if (password.length >= 12) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]{2,}/.test(password)) strength += 1;
    if (!/(.)\1{1,}/.test(password)) strength += 1; // No repeated characters

    return { valid: errors.length === 0, errors, strength };
  }
}

// Rate limiting utility
export class RateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> =
    new Map();

  public isAllowed(
    identifier: string,
    maxAttempts: number,
    windowMs: number
  ): boolean {
    const now = Date.now();
    const existing = this.attempts.get(identifier);

    if (!existing) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - existing.firstAttempt > windowMs) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now });
      return true;
    }

    // Check if limit exceeded
    if (existing.count >= maxAttempts) {
      return false;
    }

    // Increment counter
    existing.count++;
    return true;
  }

  public getRemainingAttempts(identifier: string, maxAttempts: number): number {
    const existing = this.attempts.get(identifier);
    if (!existing) return maxAttempts;
    return Math.max(0, maxAttempts - existing.count);
  }

  public getTimeUntilReset(identifier: string, windowMs: number): number {
    const existing = this.attempts.get(identifier);
    if (!existing) return 0;
    return Math.max(0, windowMs - (Date.now() - existing.firstAttempt));
  }
}

export default SecurityConfig;
